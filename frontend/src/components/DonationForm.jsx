// src/components/DonationForm.jsx

import { useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';

export default function DonationForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'raw',
    quantity: '',
    unit: 'meals',
    special_capabilities: [],
    donation_pickup_time: '',
    packaging_type: 'bulk',
    storage_capability: 'frozen',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        special_capabilities: checked
          ? [...prev.special_capabilities, value]
          : prev.special_capabilities.filter((cap) => cap !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div 
      className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 mb-6 shadow-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Donation Name */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
              Donation Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g, Fresh Vegetable Soup"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              style={{ backdropFilter: 'blur(10px)' }}
            />
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g, 50"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
              />
            </div>
            <div className="group">
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
              >
                <option value="kg" className="bg-gray-800">Kg</option>
                <option value="meals" className="bg-gray-800">Meals</option>
              </select>
            </div>
          </div>

          {/* Food Type */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
              Food Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
            >
              <option value="prepared" className="bg-gray-800">Prepared Meals</option>
              <option value="raw" className="bg-gray-800">Raw Ingredients</option>
            </select>
          </div>

          {/* Pickup Time */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
              Pickup Time
            </label>
            <input
              type="datetime-local"
              name="donation_pickup_time"
              value={formData.donation_pickup_time}
              onChange={handleChange}
              className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Packaging Type */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
              Packaging Type
            </label>
            <select
              name="packaging_type"
              value={formData.packaging_type}
              onChange={handleChange}
              className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
            >
              <option value="bulk" className="bg-gray-800">Bulk Packaging</option>
              <option value="individual" className="bg-gray-800">Individual Portions</option>
              <option value="sealed_containers" className="bg-gray-800">Sealed Containers</option>
              <option value="vacuum_sealed" className="bg-gray-800">Vacuum Sealed</option>
              <option value="loose" className="bg-gray-800">Loose (unpackaged)</option>
            </select>
          </div>

          {/* Storage Requirements */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center">
              Storage Requirements
            </label>
            <select
              name="storage_capability"
              value={formData.storage_capability}
              onChange={handleChange}
              className="w-full p-3 text-sm bg-white/5 border border-white/10 text-white focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
            >
              <option value="frozen" className="bg-gray-800">Frozen</option>
              <option value="refrigerated" className="bg-gray-800">Refrigerated</option>
              <option value="shelf_stable" className="bg-gray-800">Shelf Stable</option>
              <option value="dry" className="bg-gray-800">Dry</option>
            </select>
          </div>

          {/* Special Capabilities */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Special Dietary Options
            </label>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                name="special_input"
                value={formData.special_input || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, special_input: e.target.value }))
                }
                placeholder="Enter dietary option"
                className="flex-1 p-3 text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/8 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => {
                  const option = (formData.special_input || '').trim().toLowerCase();
                  if (option && !formData.special_capabilities.includes(option)) {
                    setFormData((prev) => ({
                      ...prev,
                      special_capabilities: [...prev.special_capabilities, option],
                      special_input: '',
                    }));
                  }
                }}
                className="px-4 py-2 bg-orange-600/80 hover:bg-orange-500/90 text-white font-semibold shadow backdrop-blur-sm border border-orange-400/20 transition-all duration-300"
              >
                Add
              </button>
            </div>

            {formData.special_capabilities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.special_capabilities.map((item, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-sm border border-white/20"
                  >
                    {item}
                    <button
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          special_capabilities: prev.special_capabilities.filter(
                            (cap) => cap !== item
                          ),
                        }))
                      }
                      className="text-white hover:text-red-400 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="group relative px-8 py-3 bg-gradient-to-r from-slate-700 to-gray-600 hover:from-slate-600 hover:to-gray-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none border border-white/20"
        >
          <span className="flex items-center">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin mr-3"></div>
                Processing Request...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-3" />
                Find Recipients
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}