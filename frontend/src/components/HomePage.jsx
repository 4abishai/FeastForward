// src/components/HomePage.jsx
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, DollarSign, X, Menu, PlusCircle } from 'lucide-react';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const isActive = (path) => location.pathname.includes(path);
  
  const baseLinkClass = 'flex items-center gap-3 p-3 transition-all duration-300';
  const baseIconLinkClass = 'flex justify-center items-center p-2 transition-all duration-300 h-12 w-12';
  const activeClass = 'bg-gradient-to-r from-orange-600/80 to-orange-500/80 text-white font-semibold border border-orange-400/30 backdrop-blur-sm shadow-lg';
  const inactiveClass = 'text-gray-400 hover:bg-white/8 hover:text-white hover:border-white/10 border border-transparent';

  return (
    <div className="flex min-h-screen bg-gray-900 text-white overflow-x-hidden relative">
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
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-64 min-w-64 max-w-64' : 'w-16 min-w-16 max-w-16'
        } backdrop-blur-xl bg-white/5 border-r border-white/10 transition-all duration-300 p-4 flex flex-col shadow-2xl relative z-10`}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 mr-3"></div>
              <h2 className="text-xl font-bold text-white">Dashboard</h2>
            </div>
          )}
          <button
            className="p-2 backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className={`space-y-3 flex flex-col ${!sidebarOpen ? 'items-center' : ''}`}>
            {/* Create Donation */}
            <li className={`${!sidebarOpen ? 'w-full flex justify-center' : ''}`}>
              <Link
                to="create-donation"
                className={
                  sidebarOpen
                    ? `${baseLinkClass} ${isActive('create-donation') ? activeClass : inactiveClass}`
                    : `${baseIconLinkClass} ${isActive('create-donation') ? activeClass : inactiveClass}`
                }
                title={!sidebarOpen ? 'Create Donation' : undefined}
                aria-label="Create Donation"
                style={sidebarOpen ? {} : { backdropFilter: 'blur(10px)' }}
              >
                <PlusCircle className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm font-medium uppercase tracking-wide">Create Donation</span>}
              </Link>
            </li>

            {/* Donation History */}
            <li className={`${!sidebarOpen ? 'w-full flex justify-center' : ''}`}>
              <Link
                to="donation-history"
                className={
                  sidebarOpen
                    ? `${baseLinkClass} ${isActive('donation-history') ? activeClass : inactiveClass}`
                    : `${baseIconLinkClass} ${isActive('donation-history') ? activeClass : inactiveClass}`
                }
                title={!sidebarOpen ? 'Donation History' : undefined}
                aria-label="Donation History"
                style={sidebarOpen ? {} : { backdropFilter: 'blur(10px)' }}
              >
                <DollarSign className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm font-medium uppercase tracking-wide">Donation History</span>}
              </Link>
            </li>

            {/* Settings */}
            <li className={`${!sidebarOpen ? 'w-full flex justify-center' : ''}`}>
              <Link
                to="settings"
                className={
                  sidebarOpen
                    ? `${baseLinkClass} ${isActive('settings') ? activeClass : inactiveClass}`
                    : `${baseIconLinkClass} ${isActive('settings') ? activeClass : inactiveClass}`
                }
                title={!sidebarOpen ? 'Settings' : undefined}
                aria-label="Settings"
                style={sidebarOpen ? {} : { backdropFilter: 'blur(10px)' }}
              >
                <Settings className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm font-medium uppercase tracking-wide">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer section for collapsed sidebar */}
        {!sidebarOpen && (
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto opacity-60"></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-0 min-h-screen relative z-10">
        <Outlet />
      </main>
    </div>
  );
}