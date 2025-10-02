// src/components/Inventory.jsx
import { useEffect, useState } from 'react';
import { Package, AlertCircle, Hash, User, Database, Sparkles, Box, CheckCircle, Clock } from 'lucide-react';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        console.log('Fetching inventory details...');
        const response = await fetch('http://localhost:8009/getInventoryDetail', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'recipient-id': '1'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch inventory');
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []); 

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'unfulfilled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return <CheckCircle className="w-3 h-3 mr-2" />;
      case 'unfulfilled':
        return <AlertCircle className="w-3 h-3 mr-2" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-2" />;
      default:
        return <Box className="w-3 h-3 mr-2" />;
    }
  };

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

      {/* Header with horizontal blurred background */}
<div className="relative z-10">
  <div  
    className="absolute top-0 left-0 right-0 h-25 bg-white/5 border-b border-white/10"
    style={{
      backdropFilter: 'blur(20px)',
      background: 'rgba(255, 255, 255, 0.03)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
    }}
  ></div>

  {/* Vertically centered header content */}
  <div className="relative z-20 h-25 flex items-center max-w-7xl mx-auto px-6">
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">
        Inventory Management
      </h1>
      <p className="text-gray-400 text-sm">Track and manage your received donations inventory</p>
    </div>
  </div>
</div>


      <div className="relative z-10 p-6 max-w-7xl mx-auto">
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
              <p className="text-gray-300 text-sm">Loading inventory details...</p>
            </div>
          </div>
        ) : inventory.length === 0 ? (
          <div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-12 shadow-2xl text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-white text-xl font-semibold mb-2">No inventory items found</h2>
            <p className="text-gray-400 text-sm">Your inventory items will appear here once donations are received</p>
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
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 mr-4"></div>
                  <h2 className="text-lg font-bold text-white">Current Inventory</h2>
                </div>
              </div>
              
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Item Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Packaging</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Storage</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wide">Capabilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {inventory.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-white/5 transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-300">{item.quantity} {item.unit}</td>
                      <td className="px-6 py-4 text-gray-300">{item.packagingType}</td>
                      <td className="px-6 py-4 text-gray-300">{item.storageCapability}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.specialCapabilities.map((capability, idx) => (
                            <span 
                              key={idx}
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
              {inventory.map((item) => (
                <div 
                  key={item.id} 
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
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
                            <Package className="w-3 h-3 mr-2" />
                            {item.type}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <Box className="w-5 h-5 text-orange-400 opacity-70" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                        <Hash className="w-3 h-3 mr-2" />
                        Quantity
                      </label>
                      <p className="text-white font-medium">{item.quantity} {item.unit}</p>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                        <Package className="w-3 h-3 mr-2" />
                        Packaging
                      </label>
                      <p className="text-white font-medium">{item.packagingType}</p>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                        <Database className="w-3 h-3 mr-2" />
                        Storage Requirements
                      </label>
                      <p className="text-white font-medium">{item.storageCapability}</p>
                    </div>

                    <div className="group">
                      <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
                        <Sparkles className="w-3 h-3 mr-2" />
                        Special Capabilities
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {item.specialCapabilities.map((capability, idx) => (
                          <span 
                            key={idx}
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