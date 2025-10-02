import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

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
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Start typing address..."
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1px solid #4B3C6F',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: '#2D2A3B',
          color: '#E2E1E8',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.borderColor = '#7B61FF'}
        onMouseLeave={(e) => e.target.style.borderColor = '#4B3C6F'}
      />
      
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#2D2A3B',
          border: '1px solid #4B3C6F',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}>
          {isLoading ? (
            <div style={{ padding: '12px', color: '#A8A4CE', textAlign: 'center' }}>
              Searching...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #4B3C6F' : 'none',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#E2E1E8',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3B3654'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2D2A3B'}
              >
                <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                  {suggestion.address?.road || suggestion.address?.name || 'Unknown'}
                  {suggestion.address?.house_number && ` ${suggestion.address.house_number}`}
                </div>
                <div style={{ color: '#A8A4CE', fontSize: '12px' }}>
                  {suggestion.display_name}
                </div>
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
    id: '',
    password: '',
    name: '',
    address: '',
    location: { latitude: null, longitude: null },
    contact: { name: '', email: '', phone: '' }
  });
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]);
  const [mapKey, setMapKey] = useState(0);
  const addressInputRef = useRef(null);

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
      err => console.error(err)
    );
  }, []);

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
    const newCenter = [location.latitude, location.longitude];
    setMapCenter(newCenter);
    setMapKey(prev => prev + 1);
  };

  const handleLocationUpdate = (location) => {
    setFormData(prev => ({ ...prev, location }));
    reverseGeocode(location);
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch('/api/donor/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      width: '100%',
      padding: '20px', 
      backgroundColor: 'rgba(36, 34, 47, 0.5)', // Translucent background
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      color: '#E2E1E8'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#E2E1E8',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        Donor Signup
      </h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          placeholder="ID" 
          onChange={e => handleChange('id', e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #4B3C6F',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#2D2A3B',
            color: '#E2E1E8',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#7B61FF'}
          onMouseLeave={(e) => e.target.style.borderColor = '#4B3C6F'}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => handleChange('password', e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #4B3C6F',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#2D2A3B',
            color: '#E2E1E8',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#7B61FF'}
          onMouseLeave={(e) => e.target.style.borderColor = '#4B3C6F'}
        />
        
        <input 
          placeholder="Organization Name" 
          onChange={e => handleChange('name', e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #4B3C6F',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#2D2A3B',
            color: '#E2E1E8',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#7B61FF'}
          onMouseLeave={(e) => e.target.style.borderColor = '#4B3C6F'}
        />
        
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500', 
            color: '#A8A4CE'
          }}>
            Address
          </label>
          <AddressAutocomplete
            ref={addressInputRef}
            value={formData.address}
            onChange={(value) => handleChange('address', value)}
            onLocationSelect={handleLocationSelect}
          />
        </div>
        
        <h3 style={{ 
          marginTop: '20px', 
          marginBottom: '10px', 
          color: '#E2E1E8',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Contact Information
        </h3>
        
        <input 
          placeholder="Contact Name" 
          onChange={e => handleChange('contact.name', e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #4B3C6F',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#2D2A3B',
            color: '#E2E1E8',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#7B61FF'}
          onMouseLeave={(e) => e.target.style.borderColor = '#4B3C6F'}
        />
        
        <input 
          placeholder="Email" 
          type="email" 
          onChange={e => handleChange('contact.email', e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #4B3C6F',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#2D2A3B',
            color: '#E2E1E8',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#7B61FF'}
          onMouseLeave={(e) => e.target.style.borderColor = '#4B3C6F'}
        />
        
        <input 
          placeholder="Phone" 
          onChange={e => handleChange('contact.phone', e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #4B3C6F',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#2D2A3B',
            color: '#E2E1E8',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#7B61FF'}
          onMouseLeave={(e) => e.target.style.borderColor = '#4B3C6F'}
        />
        
        <div style={{ marginTop: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontWeight: '500', 
            color: '#A8A4CE'
          }}>
            Location (Click on map to set, or drag the marker to adjust position)
          </label>
          <div style={{ 
            height: '300px', 
            border: '1px solid #4B3C6F', 
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <MapContainer 
              key={mapKey}
              center={mapCenter} 
              zoom={15} 
              style={{ height: '100%', borderRadius: '6px' }}
            >
              <MapController center={mapCenter} zoom={15} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
          {formData.location.latitude && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#A8A4CE' }}>
              📍 Coordinates: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
            </div>
          )}
        </div>
        
        <button 
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#7B61FF',
            color: '#E2E1E8',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#6A4EE6'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#7B61FF'}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}