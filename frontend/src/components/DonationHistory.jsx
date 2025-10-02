// src/components/DonationHistory.jsx
import { useEffect, useState } from 'react';
import { Heart, User, Package, Hash, Database, Sparkles, Clock, MapPin } from 'lucide-react';
import { authFetch } from '../utils/authFetch';
import { useNavigate } from 'react-router-dom';

export default function DonationHistory() {
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDonationHistory() {
      try {
        const donorid = localStorage.getItem('donor_id');
        if (!donorid) throw new Error('User ID not found in localStorage');

        const response = await authFetch('http://127.0.0.1:8000/donation/v1/fetchDonationHistory', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'donor_id': donorid
          }
        }, navigate);

        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setDonationHistory(data);
      } catch (error) {
        console.error('Error fetching donation history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDonationHistory();
  }, []); 

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
      
      {/* Subtle geometric background patterns */}
<div className="absolute inset-0 opacity-10">
  {/* Radial pattern */}
  <div 
    className="absolute inset-0" 
    style={{
      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
    }}
  ></div>

  {/* Grid lines overlay */}
  <div 
    className="absolute inset-0"
    style={{
      backgroundImage: `linear-gradient(rgba(255, 225, 225, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,225,225,0.4) 1px, transparent 1px)`,
      backgroundSize: '50px 50px'
    }}
  ></div>
</div>


      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
                  <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-blue-600 mr-4"></div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Donation History
              </h1>
              <p className="text-gray-400 text-sm">Track your contributions and impact on the community</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-12 shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white animate-spin mr-4"></div>
              <p className="text-gray-300 text-sm">Loading your donation history...</p>
            </div>
          </div>
        ) : donationHistory.length === 0 ? (
          <div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-12 shadow-2xl text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-white text-xl font-semibold mb-2">No donation history found</h2>
            <p className="text-gray-400 text-sm">Your generous contributions will appear here once you start donating</p>
          </div>
        ) : (
          <>
            {/* Table View (visible on large screens) */}
            <div 
              className="hidden lg:block backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="bg-white/10 border-b border-white/10 px-6 py-4">
                <div className="flex items-center">
                  <h2 className="text-lg font-bold text-white">Your Donations</h2>
                </div>
              </div>
              
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Donation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Recipient</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Storage</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Capabilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {donationHistory.map((donation, index) => (
                    <tr 
                      key={donation.donation_id || `donation-${index}`}
                      className="hover:bg-white/5 transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-medium text-white">{donation.donation_name}</td>
                      <td className="px-6 py-4 text-gray-300">{donation.recipient_name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
                          {donation.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-300">{donation.quantity} {donation.unit}</td>
                      <td className="px-6 py-4 text-gray-300">{donation.storage_capability}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {donation.special_capabilities.map((capability, capIndex) => (
                            <span 
                              key={`${donation.donation_id || index}-capability-${capIndex}`}
                              className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium border border-green-500/30"
                            >
                              {capability}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View (visible on small/medium screens) */}
            <div className="block lg:hidden space-y-6">
              {donationHistory.map((donation, index) => (
<div 
  key={donation.donation_id || `card-donation-${index}`}
  className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 p-6 shadow-2xl hover:border-white/20 transition-all duration-300"
  style={{
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
  }}
>

                  {/* Card Header */}
                  <div className="mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {donation.donation_name}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
                          <Package className="w-3 h-3 mr-2" />
                          {donation.type}
                        </span>
                      </div>
                      <Heart className="w-5 h-5 text-orange-400 opacity-70" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        Recipient
                      </label>
                      <p className="text-white font-medium">{donation.recipient_name}</p>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                        <Hash className="w-3 h-3 mr-2" />
                        Quantity
                      </label>
                      <p className="text-white font-medium">{donation.quantity} {donation.unit}</p>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                        <Database className="w-3 h-3 mr-2" />
                        Storage Requirements
                      </label>
                      <p className="text-white font-medium">{donation.storage_capability}</p>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                        <Sparkles className="w-3 h-3 mr-2" />
                        Special Capabilities
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {donation.special_capabilities.map((capability, capIndex) => (
                          <span 
                            key={`${donation.donation_id || index}-card-capability-${capIndex}`}
                            className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium border border-green-500/30"
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}