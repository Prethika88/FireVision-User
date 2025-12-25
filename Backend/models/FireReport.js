// Backend/models/FireReport.js
const mongoose = require('mongoose');

const fireReportSchema = new mongoose.Schema({
  reportText: {
    type: String,
    required: true
  },
  reporter: {
    userId: String,
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [Number], // [longitude, latitude]
      address: String
    }
  },
  extractedInfo: {
    location: String,
    fireType: String,
    severity: String,
    urgencyScore: Number,
    keywords: [String],
    hasCasualties: Boolean,
    description: String
  },
  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'false_alarm'],
      default: 'pending'
    },
    confidence: Number,
    similarReportsCount: Number,
    verifiedBy: [String]
  },
  geoCluster: {
    clusterId: String,
    nearbyReports: Number
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false_alarm'],
    default: 'active'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location queries
fireReportSchema.index({ 'reporter.location': '2dsphere' });

module.exports = mongoose.model('FireReport', fireReportSchema);