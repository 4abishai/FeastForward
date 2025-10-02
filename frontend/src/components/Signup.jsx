// stc/components/Signup.jsx

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { User, MapPin, Building, Lock } from 'lucide-react';
import { GATEWAY_URL } from '../config';


// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ setLocation, onAddressUpdate }) {
  useMapEvents({
    click(e) {
      const newLocation = {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      };
      setLocation(newLocation);
      onAddressUpdate(newLocation);
    }
  });
  return null;
}

function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [map, center, zoom]);
  
  return null;
}

function DraggableMarker({ position, onLocationChange }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        const newLocation = {
          latitude: newPos.lat,
          longitude: newPos.lng
        };
        onLocationChange(newLocation);
      }
    },
  };

  return position ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[position.latitude, position.longitude]}
      ref={markerRef}
    />
  ) : null;
}

function AddressAutocomplete({ value, onChange, onLocationSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const [isManualUpdate, setIsManualUpdate] = useState(false);

  const searchAddresses = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();

      const formattedSuggestions = data.map(item => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: item.address
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    onChange(query);
    setIsManualUpdate(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchAddresses(query);
    }, 300);

    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setIsManualUpdate(false);
    onChange(suggestion.display_name);
    onLocationSelect({
      latitude: suggestion.lat,
      longitude: suggestion.lon
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.updateAddress = (newAddress) => {
        if (!isManualUpdate) {
          onChange(newAddress);
        }
        setIsManualUpdate(false);
      };
    }
  }, [onChange, isManualUpdate]);

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="Start typing address..."
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full p-2 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
        style={{ backdropFilter: 'blur(10px)' }}
      />

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
  className="absolute top-full left-0 right-0 z-[9999] shadow-2xl border border-slate-800 overflow-hidden"
  style={{
    backgroundColor: '#0f172a', // Matches Tailwind's slate-900
    backdropFilter: 'none',
    borderTop: '1px solid #1e293b' // slate-800
  }}
>
          {isLoading ? (
            <div className="p-2 text-gray-400 text-center text-xs">Searching...</div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 cursor-pointer border-b last:border-b-0 border-white/10 text-xs text-white hover:bg-white/10 transition-all duration-300"
              >
                <div className="font-medium mb-1">
                  {suggestion.address?.road || suggestion.address?.name || 'Unknown'}
                  {suggestion.address?.house_number && ` ${suggestion.address.house_number}`}
                </div>
                <div className="text-gray-400 text-xs">{suggestion.display_name}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    address: '',
    location: { latitude: null, longitude: null },
    contact: { email: '', phone: '' }
  });
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]);
  const [mapKey, setMapKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const addressInputRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
      err => console.error(err)
    );
  }, []);

  const reverseGeocode = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, address: data.display_name }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const handleChange = (field, value) => {
    if (field.startsWith('contact.')) {
      const subfield = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: { ...prev.contact, [subfield]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, location }));
    setMapCenter([location.latitude, location.longitude]);
    setMapKey(prev => prev + 1);
  };

  const handleLocationUpdate = (location) => {
    setFormData(prev => ({ ...prev, location }));
    reverseGeocode(location);
  };

const handleSubmit = async () => {
  setIsLoading(true);

  try {
    if (
      !formData.name ||
      !formData.password ||
      !formData.address ||
      !formData.contact.email ||
      !formData.contact.phone ||
      !formData.location.latitude ||
      !formData.location.longitude
    ) {
      alert('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    const signupPayload = {
      name: formData.name,
      password: formData.password,
      address: formData.address,
      location: {
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
      },
      contact: {
        email: formData.contact.email,
        phone: formData.contact.phone,
      },
    };

      const response = await fetch(`${GATEWAY_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: allows browser to accept and store cookies
      body: JSON.stringify(signupPayload),
    });

// First check if it's a user-already-exists case
if (response.status === 409) {
  const data = await response.json();
  alert(data.error || 'User already exists'); // Replace `alert` with toast/snackbar if you have one
  return;
}

// Now handle other failures
if (!response.ok) {
  throw new Error('Signup failed');
}

    const result = await response.json();

    // Store values in localStorage
    localStorage.setItem('donor_id', result['donor_id']);
    localStorage.setItem('access_token', result['access_token']);


    window.location.href = '/home';

  } catch (error) {
    console.error('Error during signup:', error);
    alert('Signup failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
      
      {/* Subtle geometric background patterns */}
            {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
           backgroundImage: `linear-gradient(rgba(255, 225, 225, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,225,225,0.4) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
          }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6">
        <div className="w-full min-h-[400px] max-w-[641px]">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Donor Signup
                </h1>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="space-y-4">
               {/* Organization Name */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wide flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Enter organization name"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  style={{ backdropFilter: 'blur(10px)' }}
                   autoComplete="username"
                />
              </div>


              {/* Password */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wide flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={e => handleChange('password', e.target.value)}
                  className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  style={{ backdropFilter: 'blur(10px)' }}
                  autoComplete="new-password"
                />
              </div>



              {/* Contact Information Section */}
              <div className="group">
                <h3 className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  Contact Information
                </h3>
                
                <div className="space-y-2">
                  

                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.contact.email}
                    onChange={e => handleChange('contact.email', e.target.value)}
                    className="w-full p-2 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />

                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.contact.phone}
                    onChange={e => handleChange('contact.phone', e.target.value)}
                    className="w-full p-2 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wide flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Address
                </label>
                <AddressAutocomplete
                  ref={addressInputRef}
                  value={formData.address}
                  onChange={(value) => handleChange('address', value)}
                  onLocationSelect={handleLocationSelect}
                />
              </div>

              {/* Map Section */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
    Location on Map (Place marker)
  </label>
  {formData.location.latitude && (
    <div className="text-xs text-gray-400 font-mono">
      {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
    </div>
  )}
</div>

                <div 
                  className="h-60 border border-white/10 overflow-hidden shadow-lg backdrop-blur-sm"
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <MapContainer
                    key={mapKey}
                    center={mapCenter}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© OpenStreetMap contributors'
                    />
                    <LocationMarker
                      setLocation={loc => setFormData(prev => ({ ...prev, location: loc }))}
                      onAddressUpdate={handleLocationUpdate}
                    />
                    <DraggableMarker
                      position={formData.location.latitude ? formData.location : null}
                      onLocationChange={handleLocationUpdate}
                    />
                  </MapContainer>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="group relative px-8 py-3 bg-gradient-to-r from-orange-600/80 to-orange-500/80 hover:from-orange-500/90 hover:to-orange-400/90 text-white text-xs font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none border border-orange-400/30"
                >
                  <span className="flex items-center">
                    {isLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 mr-2" />
                        Create Account
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}