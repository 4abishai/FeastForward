// src/components/AddRecipient.jsx

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { User, MapPin, Building, Lock, Clock, Package, Refrigerator, Mail, Phone, FileText, Plus, X } from 'lucide-react';

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
            backgroundColor: '#0f172a',
            backdropFilter: 'none',
            borderTop: '1px solid #1e293b'
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

export default function AddRecipient() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    location: { latitude: null, longitude: null },
    status: 'active',
    timezone: 'Asia/Kolkata',
    accepted_types: [{ type: 'raw', min_quantity: 0, unit: 'kg' }],
    special_capabilities: [],
    storage_capabilities: [],
open_hours: {
  monday: '',
  tuesday: '',
  wednesday: '',
  thursday: '',
  friday: '',
  saturday: '',
  sunday: ''
},
    contact: { email: '', phone: '' },
    description: ''
  });
  
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]);
  const [mapKey, setMapKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const addressInputRef = useRef(null);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const storageOptions = ['refrigerated', 'frozen', 'dry', 'ambient'];
  const acceptedTypeOptions = ['raw', 'cooked', 'packaged', 'canned'];
  const unitOptions = ['kg', 'lbs', 'pieces', 'liters'];

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
    } else if (field.startsWith('open_hours.')) {
      const day = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        open_hours: { ...prev.open_hours, [day]: value }
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

  const addAcceptedType = () => {
    setFormData(prev => ({
      ...prev,
      accepted_types: [...prev.accepted_types, { type: 'raw', min_quantity: 0, unit: 'kg' }]
    }));
  };

  const removeAcceptedType = (index) => {
    setFormData(prev => ({
      ...prev,
      accepted_types: prev.accepted_types.filter((_, i) => i !== index)
    }));
  };

  const updateAcceptedType = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      accepted_types: prev.accepted_types.map((item, i) => 
        i === index ? { ...item, [field]: field === 'min_quantity' ? parseFloat(value) || 0 : value } : item
      )
    }));
  };

  const toggleStorageCapability = (capability) => {
    setFormData(prev => ({
      ...prev,
      storage_capabilities: prev.storage_capabilities.includes(capability)
        ? prev.storage_capabilities.filter(c => c !== capability)
        : [...prev.storage_capabilities, capability]
    }));
  };

const handleOpenHoursChange = (day, value) => {
  setFormData(prev => ({
    ...prev,
    open_hours: {
      ...prev.open_hours,
      [day]: value,
    }
  }));
};

const handleSubmit = async () => {
  setIsLoading(true);

  try {
    // basic required-fields check
    if (
      !formData.name ||
      !formData.address ||
      !formData.contact.email ||
      !formData.contact.phone ||
      !formData.location.latitude ||
      !formData.location.longitude ||
      !formData.accepted_types?.length ||
      !formData.storage_capabilities?.length
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    // ensure at least one open hour
    const hasAtLeastOneOpenHour = Object.values(formData.open_hours)
      .some(value => value.trim() !== '');
    if (!hasAtLeastOneOpenHour) {
      alert('Please provide open hours for at least one day.');
      return;
    }

    // filter out any empty open-hour entries
    const filteredOpenHours = {};
    for (const [day, raw] of Object.entries(formData.open_hours)) {
      const hours = (raw || '')
        .split(',')
        .map(h => h.trim())
        .filter(h => h !== '');
      if (hours.length) {
        filteredOpenHours[day] = hours;
      }
    }

    const recipientPayload = {
      ...formData,
      open_hours: filteredOpenHours
    };

    const response = await fetch('http://localhost:9898/recipient/v1/addRecipient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(recipientPayload),
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (response.status === 409) {
      alert(result.error || 'Recipient already exists');
      return;
    }

    if (!response.ok) {
      throw new Error(result.error || 'Failed to add recipient');
    }

    if (result['recipient-id'] != null) {
      localStorage.setItem('recipient-id', String(result['recipient-id']));
    }

    alert('Recipient added successfully!');
    // e.g. redirect if you like:
    window.location.href = '/home';

  } catch (error) {
    console.error('Error adding recipient:', error);
    alert(error.message || 'Failed to add recipient. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
      
      {/* Subtle geometric background patterns */}
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
        <div className="w-full max-w-4xl overflow-y-auto">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Add Recipient
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Organization Name */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wide flex items-center">
                    <Building className="w-3 h-3 mr-1" />
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter organization name"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                </div>

                {/* Contact Information */}
                <div className="group">
                  <h3 className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    Contact Information *
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={formData.contact.email}
                        onChange={e => handleChange('contact.email', e.target.value)}
                        className="flex-1 p-2 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                        style={{ backdropFilter: 'blur(10px)' }}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={formData.contact.phone}
                        onChange={e => handleChange('contact.phone', e.target.value)}
                        className="flex-1 p-2 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                        style={{ backdropFilter: 'blur(10px)' }}
                      />
                    </div>
                  </div>
                </div>



                {/* Status and Timezone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => handleChange('status', e.target.value)}
                      className="w-full p-2 text-sm bg-white/5 border border-white/10 text-white focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ backdropFilter: 'blur(10px)' }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                      Timezone
                    </label>
                    <input
                      type="text"
                      value={formData.timezone}
                      onChange={e => handleChange('timezone', e.target.value)}
                      className="w-full p-2 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                  </div>
                </div>


                                {/* Description */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wide flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe the organization and its mission"
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm resize-none"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                </div>

                {/* Open Hours */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Open Hours
                  </label>
                  <div className="space-y-2">
                    {daysOfWeek.map(day => (
                      <div key={day} className="flex items-center space-x-2">
                        <label className="w-16 text-xs text-gray-400 capitalize">{day.slice(0, 3)}</label>
                        <input
                          type="text"
                          placeholder="10:00-21:00, 14:00-18:00"
                          value={formData.open_hours[day] || ''}
                          onChange={e => handleOpenHoursChange(day, e.target.value)}
                          className="flex-1 p-2 text-xs bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                          style={{ backdropFilter: 'blur(10px)' }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: HH:MM-HH:MM, separate multiple periods with commas</p>
                </div>


              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Map Section */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                      Location on Map *
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

                {/* Address */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-300 mb-1 uppercase tracking-wide flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    Address *
                  </label>
                  <AddressAutocomplete
                    ref={addressInputRef}
                    value={formData.address}
                    onChange={(value) => handleChange('address', value)}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>

                {/* Storage Capabilities */}
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                    <Refrigerator className="w-3 h-3 mr-1" />
                    Storage Capabilities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {storageOptions.map(option => (
                      <label key={option} className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.storage_capabilities.includes(option)}
                          onChange={() => toggleStorageCapability(option)}
                          className="rounded border-white/10 bg-white/5 text-blue-400 focus:ring-blue-400/50"
                        />
                        <span className="capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Accepted Types */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      Accepted Food Types
                    </label>
                    <button
                      type="button"
                      onClick={addAcceptedType}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Type
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.accepted_types.map((type, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <select
                          value={type.type}
                          onChange={e => updateAcceptedType(index, 'type', e.target.value)}
                          className="flex-1 p-2 text-xs bg-white/5 border border-white/10 text-white focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                          style={{ backdropFilter: 'blur(10px)' }}
                        >
                          {acceptedTypeOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        
                        <input
                          type="number"
                          placeholder="Min qty"
                          value={type.min_quantity}
                          onChange={e => updateAcceptedType(index, 'min_quantity', e.target.value)}
                          className="w-20 p-2 text-xs bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                          style={{ backdropFilter: 'blur(10px)' }}
                        />
                        
                        <select
                          value={type.unit}
                          onChange={e => updateAcceptedType(index, 'unit', e.target.value)}
                          className="w-20 p-2 text-xs bg-white/5 border border-white/10 text-white focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                          style={{ backdropFilter: 'blur(10px)' }}
                        >
                          {unitOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        
                        {formData.accepted_types.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAcceptedType(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>





              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 mt-6 border-t border-white/10">
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
                      Adding Recipient...
                    </>
                  ) : (
                    <>
                      <Building className="w-3 h-3 mr-2" />
                      Add Recipient
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}