// Backend base URL
const BASE_URL = "http://127.0.0.1:5000";

// Get admin dashboard metrics
export const getAdminMetrics = async () => {
  // TEMP static data (backend endpoint can be added later)
  return {
    fires_detected: 12,
    alerts_sent: 4,
    ml_predictions: 8,
    cnn_predictions: 6,
  };

  /*
  // REAL API (use later)
  const response = await fetch(`${BASE_URL}/admin-metrics`);
  return await response.json();
  */
};
