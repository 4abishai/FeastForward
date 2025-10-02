// src/components/HomePage.jsx
// src/components/HomePage.jsx

import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Settings, DollarSign, X, Menu, PlusCircle, Package, LogOut } from 'lucide-react';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => location.pathname.includes(path);
  
  const baseLinkClass = 'flex items-center p-3 transition-all duration-300';
  const baseIconLinkClass = 'flex justify-center items-center p-2 transition-all duration-300 h-12 w-12';
  const activeClass = 'bg-gradient-to-r from-orange-600/80 to-orange-500/80 text-white font-semibold border border-orange-400/30 backdrop-blur-sm shadow-lg';
  const inactiveClass = 'text-gray-400 hover:bg-white/8 hover:text-white hover:border-white/10 border border-transparent';

  const handleSignOut = () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname;
      });
      
      // Redirect to login or home page
      navigate('/add-recipient'); // Adjust the path as needed
      
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still redirect even if there's an error
      navigate('/login');
    }
  };

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
        {sidebarOpen && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 mr-3"></div>
              <h2 className="text-xl font-bold text-white">Dashboard</h2>
            </div>
            <button
              className="p-2 backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
              aria-label="Collapse Sidebar"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1">
          <ul className={`space-y-3 flex flex-col ${!sidebarOpen ? 'items-center' : ''}`}>
            
            {/* Hamburger Icon in collapsed view */}
            {!sidebarOpen && (
              <li className="flex mb-15 justify-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex justify-center items-center h-12 w-12 text-gray-400 hover:text-white border border-transparent transition-all duration-300"
                  title="Expand Sidebar"
                  aria-label="Expand Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </li>
            )}

            {/* Add consistent spacing for expanded sidebar */}
            {sidebarOpen && (
              <li className="mb-15">
                {/* Empty spacer to match collapsed sidebar spacing */}
              </li>
            )}

            {/* Inventory */}
            <li className={`${!sidebarOpen ? 'w-full flex justify-center' : ''}`}>
              <Link
                to="inventory"
                className={
                  sidebarOpen
                    ? `${baseLinkClass} ${isActive('inventory') ? activeClass : inactiveClass}`
                    : `${baseIconLinkClass} ${isActive('inventory') ? activeClass : inactiveClass}`
                }
                title={!sidebarOpen ? 'Inventory' : undefined}
                aria-label="Inventory"
                style={sidebarOpen ? {} : { backdropFilter: 'blur(10px)' }}
              >
                <Package className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <div className="flex-1 flex justify-center">
                    <span className="text-sm font-medium uppercase tracking-wide">Inventory</span>
                  </div>
                )}
              </Link>
            </li>

          </ul>
        </nav>

        {/* Sign Out Button */}
        <div className="mt-auto pt-6 border-t border-white/10">
          {sidebarOpen ? (
            <button
              onClick={handleSignOut}
              className={`${baseLinkClass} ${inactiveClass} w-full hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30`}
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 flex justify-center">
                <span className="text-sm font-medium uppercase tracking-wide">Sign Out</span>
              </div>
            </button>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleSignOut}
                className="flex justify-center items-center h-12 w-12 text-gray-400 hover:text-red-300 border border-transparent transition-all duration-300 p-0"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer section for collapsed sidebar */}
        {!sidebarOpen && (
          <div className="mt-4 pt-4 ">
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