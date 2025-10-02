// src/components/Login.jsx

import { useState } from 'react';
import { Lock, Building, User} from 'lucide-react';
import { GATEWAY_URL } from '../config';


export default function Login() {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!formData.name || !formData.password) {
      alert('Please enter both name and password.');
      setIsLoading(false);
      return;
    }

    try {
              const response = await fetch(`${GATEWAY_URL}/auth/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem('donor_id', data['donor_id']);
      localStorage.setItem('access_token', data['access_token']);

      window.location.href = '/home';
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 225, 225, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,225,225,0.4) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md p-6 bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
        <h2 className="text-white text-2xl font-bold text-center mb-6">Donor Login</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 flex items-center mb-1">
              {/* <User className="w-4 h-4 mr-2" /> */}
                  <Building className="w-3 h-3 mr-1" />
              Organization Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 flex items-center mb-1">
              <Lock className="w-4 h-4 mr-2" />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
              placeholder="Enter password"
            />
          </div>

<div className="flex justify-center pt-4">
<button
  type="button"
  onClick={handleSubmit}
  disabled={isLoading}
  className="group relative px-8 py-3 bg-gradient-to-r from-orange-600/80 to-orange-500/80 hover:from-orange-500/90 hover:to-orange-400/90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none border border-orange-400/30"
>
  <span className="flex items-center justify-center">
    {isLoading ? (
      <>
        <div className="w-3 h-3 border-2 border-white/30 border-t-white animate-spin mr-2"></div>
        Logging in...
      </>
    ) : (
      <>
        <User className="w-4 h-4 mr-3" />
        Login
      </>
    )}
  </span>
</button>
</div>
        </div>
      </div>
    </div>
  );
}
