import React, { useState, useEffect } from 'react';
function CommunityReports() {
  const [reportText, setReportText] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          setStatus({ 
            message: 'Please enable location services for accurate reporting', 
            type: 'warning' 
          });
        }
      );
    }
  }, []);
  const quickReportTemplates = {
    smoke: 'I see smoke in my area',
    flames: 'I see flames and active fire',
    spreading: 'Fire is spreading rapidly',
    emergency: 'Emergency! Fire out of control, need immediate help'
  };
  const handleQuickReport = (type) => {
    setReportText(quickReportTemplates[type]);
  };

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      setStatus({ message: 'Please describe what you see', type: 'error' });
      return;
    }

    if (includeLocation && !userLocation) {
      setStatus({ message: 'Getting your location...', type: 'warning' });
      return;
    }

    setLoading(true);
    setStatus({ message: 'Submitting report...', type: 'info' });

    try {
      const response = await fetch('http://localhost:5000/api/reports/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText,
          gpsLocation: includeLocation ? userLocation : { latitude: 0, longitude: 0 },
          userId: localStorage.getItem('userId') || 'anonymous_' + Date.now()
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          message: ` Report submitted! Urgency: ${data.extractedInfo.urgencyScore}/10`,
          type: 'success'
        });
        setReportText('');

        setTimeout(() => {
          setStatus({
            message: ` Location: ${data.extractedInfo.location} |  Type: ${data.extractedInfo.fireType} |  Severity: ${data.extractedInfo.severity} | Confidence: ${Math.round(data.verification.confidence * 100)}%`,
            type: 'success'
          });
        }, 2000);
      } else {
        setStatus({ message: ' Error: ' + data.error, type: 'error' });
      }
    } catch (error) {
      setStatus({ message: ' Network error: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Card Container with Orange Border */}
        <div className="rounded-3xl overflow-hidden bg-white border border-orange-200 shadow-[0_20px_60px_rgba(255,140,0,0.25)]">

          {/* Header - Orange to Red Gradient */}
          <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 px-8 py-6">
            <div className="flex justify-center items-center">
  <h1 className="text-white text-2xl font-bold text-center">
    Community Fire Reports
  </h1>
</div>
</div>

          {/* Main Content Area - Dark Background */}
          <div className="bg-white p-8">
          <p className="text-gray-600 text-center text-lg mb-8">
            Report fire incidents to help your community stay safe
          </p>

            {/* Quick Report Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => handleQuickReport('smoke')}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-6
rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02]">
                <span className="text-2xl"></span>
                <span>Smoke Sighting</span>
              </button>
              <button
                onClick={() => handleQuickReport('flames')}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-6
rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02]">
                <span className="text-2xl"></span>
                <span>Flames Visible</span>
              </button>
              <button
                onClick={() => handleQuickReport('spreading')}
                className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-8 py-6
rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02]">
                <span className="text-2xl"></span>
                <span>Fire Spreading</span>
              </button>
              <button
                onClick={() => handleQuickReport('emergency')}
                className="bg-gradient-to-r from-red-500 to-orange-700 text-white px-8 py-6
rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02]">
                <span className="text-2xl"></span>
                <span>Emergency</span>
              </button>
            </div>

            {/* Detailed Report */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">
                Detailed Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl resize-none bg-white text-gray-800
placeholder-gray-400 border border-orange-300
focus:border-orange-500 focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="Describe what you see in detail... (e.g., 'Large fire in warehouse on Main Street, flames visible from 2 blocks away, heavy smoke')"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={5}
              />
            </div>

            {/* Location Toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer text-gray-300">
                <input
                  type="checkbox"
                  checked={includeLocation}
                  onChange={(e) => setIncludeLocation(e.target.checked)}
                  className="w-5 h-5 accent-orange-500"
                />
                 Include my GPS location
                {userLocation && (
                  <span className="text-gray-500 text-sm ml-2">
                    (Lat: {userLocation.latitude.toFixed(4)}, Lon: {userLocation.longitude.toFixed(4)})
                  </span>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_10px_30px_rgba(255,140,0,0.45)] hover:scale-105'

              }`}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>

            {/* Status Message */}
            {status.message && (
              <div
                className={`mt-6 p-4 rounded-xl font-medium border-l-4 ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : status.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : status.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                    : 'bg-blue-50 text-blue-700 border-blue-300'
                }`}>
                {status.message}
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-500 text-sm text-center">
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CommunityReports;