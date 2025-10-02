// src/components/SettingsPage.jsx

import { useState, useEffect } from 'react';
import { Settings, User, Phone, Mail, MapPin, Save, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import { GATEWAY_URL } from '../config';


export default function SettingsPage() {
  // Donor Name Section State
  const [nameData, setNameData] = useState({
    name: ''
  });
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password Section State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Details Section State
  const [detailsData, setDetailsData] = useState({
    address: '',
    latitude: '',
    longitude: '',
    email: '',
    phone: ''
  });
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsSuccess, setDetailsSuccess] = useState(false);

  const [isFetchingData, setIsFetchingData] = useState(true);
  const navigate = useNavigate();

  // Fetch donor details on component mount
  useEffect(() => {
    fetchDonorDetails();
  }, []);

  const fetchDonorDetails = async () => {
    setIsFetchingData(true);
    try {
      const donorId = localStorage.getItem('donor_id');

              const response = await authFetch(`${GATEWAY_URL}/donor/v1/getDonor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }, navigate);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch donor: ${response.status} - ${errorText}`);
      }

      const donor = await response.json();
      
      // Populate forms with fetched data
      setNameData({
        name: donor.name || ''
      });

      setDetailsData({
        address: donor.address || '',
        latitude: donor.location?.latitude?.toString() || '',
        longitude: donor.location?.longitude?.toString() || '',
        email: donor.contact?.email || '',
        phone: donor.contact?.phone || ''
      });

    } catch (error) {
      console.error("Error fetching donor details:", error.message);
      alert(`Failed to fetch donor details: ${error.message}`);
    } finally {
      setIsFetchingData(false);
    }
  };

  // Update Name Handler
  const handleNameUpdate = async () => {
    setNameLoading(true);
    setNameSuccess(false);

    try {
      const donorId = localStorage.getItem('donor_id');
      if (!donorId) {
        throw new Error("Donor ID not found in localStorage.");
      }

      if (!nameData.name.trim()) {
        throw new Error("Please enter a valid name.");
      }

      const updatePayload = {
        name: nameData.name.trim()
      };

                      const response = await authFetch(`${GATEWAY_URL}/auth/v1/updateName`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'donor_id': donorId
        },
        body: JSON.stringify(updatePayload)
      }, navigate);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);

    } catch (error) {
      console.error("Name update error:", error.message);
      alert(`Name update failed: ${error.message}`);
    } finally {
      setNameLoading(false);
    }
  };

  // Update Password Handler
  const handlePasswordUpdate = async () => {
    setPasswordLoading(true);
    setPasswordSuccess(false);

    try {
      const donorId = localStorage.getItem('donor_id');
      if (!donorId) {
        throw new Error("Donor ID not found in localStorage.");
      }

      if (!passwordData.oldPassword || !passwordData.newPassword) {
        throw new Error("Please enter both old and new passwords.");
      }


      const updatePayload = {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword
      };

                      const response = await authFetch(`${GATEWAY_URL}/auth/v1/updatePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'donor_id': donorId
        },
        body: JSON.stringify(updatePayload)
      }, navigate);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      setPasswordSuccess(true);
      setPasswordData({ oldPassword: '', newPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);

    } catch (error) {
      console.error("Password update error:", error.message);
      alert(`Password update failed: ${error.message}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Update Details Handler
  const handleDetailsUpdate = async () => {
    setDetailsLoading(true);
    setDetailsSuccess(false);

    try {
      const donorId = localStorage.getItem('donor_id');
      if (!donorId) {
        throw new Error("Donor ID not found in localStorage.");
      }

      if (!detailsData.address || !detailsData.email || !detailsData.phone) {
        throw new Error("Please fill in all required fields.");
      }

      const latitude = parseFloat(detailsData.latitude);
      const longitude = parseFloat(detailsData.longitude);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error("Please enter valid latitude and longitude values.");
      }

      const updatePayload = {
        address: detailsData.address,
        location: {
          latitude: latitude,
          longitude: longitude
        },
        contact: {
          email: detailsData.email,
          phone: detailsData.phone
        }
      };

        const response = await authFetch(`${GATEWAY_URL}/donor/v1/updateDetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'donor_id': donorId
        },
        body: JSON.stringify(updatePayload)
      }, navigate);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      setDetailsSuccess(true);
      setTimeout(() => setDetailsSuccess(false), 3000);

    } catch (error) {
      console.error("Details update error:", error.message);
      alert(`Details update failed: ${error.message}`);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
      
      {/* Subtle geometric background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
          }}
        ></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 225, 225, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,225,225,0.4) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-orange-600 mr-4"></div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
              <p className="text-gray-400 text-sm">Manage your donor profile information</p>
            </div>
          </div>
        </div>

        {isFetchingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white animate-spin mr-3"></div>
            <span className="text-gray-400">Loading your details...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Donor Name Section */}
            <div 
              className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Update Name</h2>
                  <p className="text-gray-400 text-sm">Change your display name</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                    <User className="w-3 h-3 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={nameData.name}
                    onChange={(e) => setNameData({ name: e.target.value })}
                    className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                </div>
                <button
                  onClick={handleNameUpdate}
                  disabled={nameLoading}
                  className="px-6 py-3 bg-gradient-to-r from-slate-700 to-gray-600 hover:from-slate-600 hover:to-gray-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none border border-white/20 flex items-center"
                >
                  {nameLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Name
                    </>
                  )}
                </button>
              </div>

              {nameSuccess && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <p className="text-green-300 text-sm font-medium">Name updated successfully!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div 
              className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Update Password</h2>
                  <p className="text-gray-400 text-sm">Change your account password</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                    <Lock className="w-3 h-3 mr-2" />
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                      className="w-full p-3 pr-10 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                    <Lock className="w-3 h-3 mr-2" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full p-3 pr-10 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handlePasswordUpdate}
                  disabled={passwordLoading}
                  className="px-6 py-3 bg-gradient-to-r from-slate-700 to-gray-600 hover:from-slate-600 hover:to-gray-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none border border-white/20 flex items-center"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </div>

              {passwordSuccess && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <p className="text-green-300 text-sm font-medium">Password updated successfully!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div 
              className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Update Contact Details</h2>
                  <p className="text-gray-400 text-sm">Update your contact information and location</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                      <MapPin className="w-3 h-3 mr-2" />
                      Address
                    </label>
                    <textarea
                      placeholder="Enter your complete address"
                      value={detailsData.address}
                      onChange={(e) => setDetailsData(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm resize-none"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                        Latitude
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 40.7128"
                        value={detailsData.latitude}
                        onChange={(e) => setDetailsData(prev => ({ ...prev, latitude: e.target.value }))}
                        step="any"
                        className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                        Longitude
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., -74.006"
                        value={detailsData.longitude}
                        onChange={(e) => setDetailsData(prev => ({ ...prev, longitude: e.target.value }))}
                        step="any"
                        className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                      <Mail className="w-3 h-3 mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={detailsData.email}
                      onChange={(e) => setDetailsData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                      <Phone className="w-3 h-3 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={detailsData.phone}
                      onChange={(e) => setDetailsData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                    <div className="flex items-start">
                      <Settings className="w-4 h-4 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-300 text-xs font-medium mb-1">Location Info</p>
                        <p className="text-blue-200/80 text-xs">
                          Accurate location helps with better recipient matching.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleDetailsUpdate}
                  disabled={detailsLoading}
                  className="px-6 py-3 bg-gradient-to-r from-slate-700 to-gray-600 hover:from-slate-600 hover:to-gray-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none border border-white/20 flex items-center"
                >
                  {detailsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>

              {detailsSuccess && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <p className="text-green-300 text-sm font-medium">Contact details updated successfully!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}