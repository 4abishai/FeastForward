import { useState } from 'react';
import { Heart, MapPin, Clock, Package, Snowflake, Users, CheckCircle, ArrowRight, Sparkles, Zap } from 'lucide-react';
import DonationForm from './DonationForm';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import { GATEWAY_URL } from '../config';


export default function CreateDonation() {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [donationComplete, setDonationComplete] = useState(false);
  const [currentFormData, setCurrentFormData] = useState(null);
  const [currentDonor, setCurrentDonor] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();
  // const GATEWAY_URL = import.meta.env.VITE_DONOR_GATEWAY_URL;
  // console.log("Gateway URL:", import.meta.env.VITE_DONOR_GATEWAY_URL);
  // const GATEWAY_URL = "http://localhost:8000";


  const handleFormSubmit = async (formData) => {
    setCurrentFormData(formData);
    setIsLoading(true);
    setDonationComplete(false);
    setResponse(null);
    setAiRecommendation(null);
    setCurrentDonor(null);

    try {
      const donorId = localStorage.getItem('donor_id');
      if (!donorId) {
        throw new Error("Donor ID not found in localStorage.");
      }

      // Fetch donor details
      const donorRes = await authFetch(`${GATEWAY_URL}/donor/v1/getDonor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'donor_id': donorId,
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      }, navigate);

      if (!donorRes.ok) {
        const errorText = await donorRes.text();
        throw new Error(`Failed to fetch donor: ${donorRes.status} - ${errorText}`);
      }

      const donor = await donorRes.json();
      setCurrentDonor(donor);

      // Validate pickup time
      const pickupTime = formData.donation_pickup_time;
      if (!pickupTime) {
        throw new Error("Pickup time is required.");
      }

      const formattedTime = pickupTime.length === 16
        ? `${pickupTime}:00`
        : pickupTime;

      const isoPickupTime = new Date(formattedTime);
      if (isNaN(isoPickupTime.getTime())) {
        throw new Error("Invalid pickup time format.");
      }

      // Construct payload
      const payload = {
        donor: {
          ...donor,
        },
        donation: {
          ...formData,
          quantity: Number(formData.quantity),
          donation_pickup_time: isoPickupTime.toISOString(),
        },
      };

      const res = await authFetch('http://localhost:9898/recipient/v1/findRecipients', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'donor_id': `${localStorage.getItem("donor_id")}`
        },
        body: JSON.stringify(payload),
      }, navigate);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      console.error("Submission error:", error.message);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiMatch = async () => {
    if (!response || !currentFormData || !currentDonor) {
      alert("No recipients found to match with AI");
      return;
    }

    setIsAiLoading(true);
    
    try {
      // Format pickup time using stored form data
      const pickupTime = currentFormData.donation_pickup_time.length === 16
        ? `${currentFormData.donation_pickup_time}:00`
        : currentFormData.donation_pickup_time;

      const isoPickupTime = new Date(pickupTime);
      if (isNaN(isoPickupTime.getTime())) {
        throw new Error("Invalid pickup time format.");
      }

      // Prepare AI matching payload using stored donor data
      const aiPayload = {
        donor: {
          id: String(currentDonor.id),
          name: currentDonor.name,
          address: currentDonor.address,
          location: currentDonor.location,
          donation: {
            name: currentFormData.name,
            type: currentFormData.type,
            quantity: Number(currentFormData.quantity),
            unit: currentFormData.unit
          },
          special_capabilities: currentFormData.special_capabilities || [],
          donation_pickup_time: isoPickupTime.toISOString(),
          packaging_type: currentFormData.packaging_type || "bulk",
          storage_capability: currentFormData.storage_capability || "frozen"
        },
        eligible_recipients: response.map(recipient => ({
          id: String(recipient.id),
          name: recipient.name,
          address: recipient.address,
          description: recipient.description || "",
          location: recipient.location,
          status: "active",
          timezone: "America/Los_Angeles",
          contact: {
            ...recipient.contact,
            name: recipient.contact?.name || "Unknown Contact"
          },
          accepted_types: recipient.accepted_types || [],
          special_capabilities: recipient.capabilities || [],
          storage_capabilities: recipient.storage_capabilities || [],
          open_hours: recipient.open_hours || {}
        }))
      };

      // Send request to AI matching endpoint
      const aiRes = await authFetch(`${GATEWAY_URL}/match/getBest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiPayload),
      }, navigate);

      if (!aiRes.ok) {
        const errorText = await aiRes.text();
        throw new Error(`AI matching failed: ${aiRes.status} - ${errorText}`);
      }

      const aiResult = await aiRes.json();
      setAiRecommendation(aiResult);
      
    } catch (error) {
      console.error("AI matching error:", error.message);
      alert(`AI matching failed: ${error.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRecipientSelect = async (recipient) => {
    if (!currentDonor || !currentFormData) {
      alert("Missing donor or form data");
      return;
    }
    setIsLoading(true);

    try {
      // Re-format pickup time using stored form data
      const pickupTime = currentFormData.donation_pickup_time.length === 16
        ? `${currentFormData.donation_pickup_time}:00`
        : currentFormData.donation_pickup_time;

      const isoPickupTime = new Date(pickupTime);
      if (isNaN(isoPickupTime.getTime())) {
        throw new Error("Invalid pickup time format.");
      }

      // Use stored donor data instead of fetching again
      const finalPayload = {
        donor: {
          id: currentDonor.id,
          name: currentDonor.name,
          address: currentDonor.address,
          location: currentDonor.location,
          contact: currentDonor.contact
        },
        donation: {
          ...currentFormData,
          quantity: Number(currentFormData.quantity),
          donation_pickup_time: isoPickupTime.toISOString(),
        },
        recipient: {
          id: recipient.id,
          name: recipient.name,
          address: recipient.address,
          location: recipient.location,
          contact: recipient.contact
        }
      };


      const donationRes = await authFetch(`${GATEWAY_URL}/donation/v1/createDonation`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'donor_id': `${localStorage.getItem("donor_id")}`
        },
        body: JSON.stringify(finalPayload),
      }, navigate);

      if (!donationRes.ok) {
        const errorText = await donationRes.text();
        throw new Error(`Donation creation failed: ${donationRes.status} - ${errorText}`);
      }

      setDonationComplete(true);
      setResponse(null);
      setAiRecommendation(null);
      setCurrentDonor(null);
      setCurrentFormData(null);
    } catch (error) {
      console.error("Error creating donation:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to find recipient by ID
  const findRecipientById = (recipientId) => {
    return response?.find(recipient => String(recipient.id) === String(recipientId));
  };

  // Handler for accepting AI recommendation
  const handleAcceptAiRecommendation = () => {
    if (!aiRecommendation || !response) {
      alert("No AI recommendation available");
      return;
    }

    const recommendedRecipient = findRecipientById(aiRecommendation.recipient_id);
    if (!recommendedRecipient) {
      alert("Recommended recipient not found");
      return;
    }

    handleRecipientSelect(recommendedRecipient);
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

      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-orange-600 mr-4"></div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Create Donation
              </h1>
              <p className="text-gray-400 text-sm">Connect your food donations with those who need them most</p>
            </div>
          </div>
        </div>

        {/* Donation Form */}
        <DonationForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        {/* AI Recommendation Display */}
        {aiRecommendation && (
          <div 
            className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20 p-6 shadow-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(147, 51, 234, 0.3)',
            }}
          >
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                  <h2 className="text-xl font-bold text-white mb-1">AI Recommendation</h2>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 mb-4">
              <h3 className="text-lg font-bold text-white mb-2">{aiRecommendation.recipient_name}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{aiRecommendation.justification}</p>
              
              <button
                onClick={handleAcceptAiRecommendation}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Accept AI Recommendation
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Recipients Display */}
        {
          donationComplete ? (
            <div className="text-center mt-10">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
              <h2 className="text-white text-2xl font-semibold mb-2">Your donation has been made</h2>
              <p className="text-gray-400 text-sm">You can make another donation</p>
            </div>
          ) : 
          response && Array.isArray(response) && (
            <div 
              className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 mr-4"></div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Recipients Found</h2>
                      <p className="text-gray-400 text-sm">Organizations ready to receive your donation</p>
                    </div>
                  </div>
                  
                  {/* AI Match Button */}
                  <button
                    onClick={handleAiMatch}
                    disabled={isAiLoading}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAiLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Matching...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Match with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="grid gap-5 lg:grid-cols-2">
                {response.map((recipient, index) => (
                  <div 
                    key={index} 
                    className={`group backdrop-blur-sm bg-white/5 border transition-all duration-300 p-5 ${
                      aiRecommendation && aiRecommendation.recipient_id === recipient.id
                        ? 'border-purple-400/50 bg-purple-500/10 ring-2 ring-purple-400/30'
                        : 'border-white/10 hover:bg-white/8 hover:border-white/20'
                    }`}
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{recipient.name}</h3>
                        {aiRecommendation && aiRecommendation.recipient_id === recipient.id && (
                          <div className="flex items-center text-purple-400">
                            <Sparkles className="w-4 h-4 mr-1" />
                            <span className="text-xs font-semibold">AI Pick</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start text-gray-400">
                        <MapPin className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{recipient.address}</span>
                      </div>
                    </div>
                    
                    {recipient.capabilities && recipient.capabilities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">
                          Special Capabilities
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {recipient.capabilities.map((cap, capIndex) => (
                            <span 
                              key={capIndex}
                              className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium border border-green-500/30"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleRecipientSelect(recipient)}
                      disabled={isLoading}
                      className={`w-full py-3 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        aiRecommendation && aiRecommendation.recipient_id === recipient.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                      }`}
                    >
                      {isLoading ? 'Processing...' : 'Select Recipient'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}