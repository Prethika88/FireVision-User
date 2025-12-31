import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MapPin, Clock, AlertTriangle, Flame, Users, TrendingUp, X } from 'lucide-react';
function AdvancedFireReportsMap() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); 
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    urgency: 'all',
    timeRange: 'all'
  });
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    critical: 0,
    avgUrgency: 0
  });

  useEffect(() => {
    loadReports();
    const interval = setInterval(loadReports, 15000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters, searchQuery]);

  const loadReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/active');
      const data = await response.json();

      if (data.success) {
        setReports(data.reports);
        calculateStats(data.reports);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      // Demo data
      const demoReports = generateDemoData();
      setReports(demoReports);
      calculateStats(demoReports);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = () => {
    const locations = [
      'Johnsonpet, Salem', 'Market Area, Salem', 'Railway Station, Salem',
      'Bus Stand, Salem', 'Hospital Road, Salem', 'College Area, Salem'
    ];
    const types = ['building', 'vehicle', 'wildfire', 'industrial'];
    const severities = ['low', 'moderate', 'high', 'critical'];

    return Array.from({ length: 12 }, (_, i) => ({
      _id: `demo-${i}`,
      reportText: `Fire incident reported in ${locations[i % locations.length]}`,
      extractedInfo: {
        location: locations[i % locations.length],
        fireType: types[i % types.length],
        severity: severities[Math.floor(Math.random() * severities.length)],
        urgencyScore: Math.floor(Math.random() * 11),
        hasCasualties: Math.random() > 0.7,
        description: 'Fire incident with visible flames'
      },
      verification: {
        status: Math.random() > 0.5 ? 'verified' : 'pending',
        confidence: 0.6 + Math.random() * 0.4,
        similarReportsCount: Math.floor(Math.random() * 5),
        reason: 'AI analysis completed'
      },
      reporter: {
        location: {
          coordinates: [78.16 + Math.random() * 0.1, 11.67 + Math.random() * 0.1]
        }
      },
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));
  };

  const calculateStats = (reportsList) => {
    const stats = {
      total: reportsList.length,
      verified: reportsList.filter(r => r.verification?.status === 'verified').length,
      critical: reportsList.filter(r => r.extractedInfo?.severity === 'critical').length,
      avgUrgency: reportsList.reduce((sum, r) => sum + (r.extractedInfo?.urgencyScore || 0), 0) / reportsList.length || 0
    };
    setStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...reports];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(r =>
        (r.extractedInfo?.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.extractedInfo?.fireType || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(r => r.extractedInfo?.severity === filters.severity);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.verification?.status === filters.status);
    }

    // Urgency filter
    if (filters.urgency !== 'all') {
      if (filters.urgency === 'high') {
        filtered = filtered.filter(r => (r.extractedInfo?.urgencyScore || 0) >= 7);
      } else if (filters.urgency === 'medium') {
        filtered = filtered.filter(r => (r.extractedInfo?.urgencyScore || 0) >= 4 && (r.extractedInfo?.urgencyScore || 0) < 7);
      } else if (filters.urgency === 'low') {
        filtered = filtered.filter(r => (r.extractedInfo?.urgencyScore || 0) < 4);
      }
    }

    // Time range filter
    if (filters.timeRange !== 'all') {
      const now = Date.now();
      const ranges = {
        '1h': 3600000,
        '6h': 21600000,
        '24h': 86400000
      };
      const range = ranges[filters.timeRange];
      if (range) {
        filtered = filtered.filter(r => now - new Date(r.timestamp).getTime() < range);
      }
    }

    setFilteredReports(filtered);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'from-yellow-500 to-yellow-600',
      moderate: 'from-orange-500 to-orange-600',
      high: 'from-red-500 to-red-600',
      critical: 'from-red-700 to-red-900',
      unknown: 'from-gray-500 to-gray-600'
    };
    return colors[severity] || 'from-gray-500 to-gray-600';
  };

  const getUrgencyBadgeColor = (score) => {
    const safeScore = score || 0;
    if (safeScore >= 9) return 'bg-red-700';
    if (safeScore >= 7) return 'bg-red-500';
    if (safeScore >= 5) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] p-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 
rounded-2xl p-6 shadow-[0_20px_50px_rgba(255,140,0,0.3)]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  Fire Incident Report
                </h1>
                <p className="text-white mt-1">Real-time incident monitoring and analysis</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-red-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-red-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500 rounded-xl p-5 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-600 text-sm font-medium">Total Reports</p>
<p className="text-3xl font-bold text-black mt-1">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-600 text-sm font-medium">Verified</p>
<p className="text-3xl font-bold text-black mt-1">{stats.verified}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-600 text-sm font-medium">Critical</p>
<p className="text-3xl font-bold text-black mt-1">{stats.critical}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-600 text-sm font-medium">Avg Urgency</p>
<p className="text-3xl font-bold text-black mt-1">
  {stats.avgUrgency.toFixed(1)}
</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-orange-200 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
  type="text"
  placeholder="Search location or fire type..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full pl-10 pr-4 py-2.5 
             bg-white text-gray-800 
             border border-orange-300 rounded-lg 
             placeholder-gray-400
             focus:border-orange-500 focus:ring-2 focus:ring-orange-400
             outline-none"
/>
              </div>
            </div>

            {/* Severity Filter */}
            <select
  value={filters.severity}
  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
  className="px-4 py-2.5 
             bg-white text-gray-800 
             border border-orange-300 rounded-lg
             focus:border-orange-500 focus:ring-2 focus:ring-orange-400
             outline-none">
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {/* Status Filter */}
            <select
  value={filters.status}
  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
  className="px-4 py-2.5 
             bg-white text-gray-800 
             border border-orange-300 rounded-lg
             focus:border-orange-500 focus:ring-2 focus:ring-orange-400
             outline-none">
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>

            {/* Time Range Filter */}
            <select
  value={filters.timeRange}
  onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
  className="px-4 py-2.5 
             bg-white text-gray-800 
             border border-orange-300 rounded-lg
             focus:border-orange-500 focus:ring-2 focus:ring-orange-400
             outline-none">
              <option value="all">All Time</option>
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
            </select>
          </div>
        </div>

        {/* Reports Display */}
        {loading ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 text-center border border-gray-700">
            <AlertTriangle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-300">No reports match your filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
            {filteredReports.map((report) => {
              const extracted = report.extractedInfo;
              const verification = report.verification;
              return (
                <div
  key={report._id}
  className="group bg-white rounded-xl overflow-hidden
             border border-orange-200
             transition-all duration-300 cursor-pointer
             hover:border-orange-400
             hover:shadow-[0_10px_30px_rgba(255,140,0,0.25)]"
  onClick={() => setSelectedReport(report)}>

                  {/* Urgency Bar */}
                  <div className={`h-1.5 ${getUrgencyBadgeColor(extracted?.urgencyScore)} ${(extracted?.urgencyScore || 0) >= 9 ? 'animate-pulse' : ''}`} />
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-lg">Fire Report</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md bg-gradient-to-r ${getSeverityColor(extracted.severity || 'unknown')}`}>
                        {(extracted.severity || 'UNKNOWN').toUpperCase()}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-black-200 font-medium">{extracted?.location || 'Unknown Location'}</span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <p className="text-gray-100 text-xs mb-1">Fire Type</p>
                        <p className="text-white font-semibold">{extracted.fireType || 'Unknown'}</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <p className="text-gray-100 text-xs mb-1">Urgency Score</p>
                        <p className="text-white font-bold text-lg">{extracted.urgencyScore || 0}/10</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
  verification?.status === 'verified'
    ? 'bg-green-50 text-green-700 border border-green-300'
    : 'bg-yellow-50 text-yellow-700 border border-yellow-300'
}`}>
  {verification?.status === 'verified' ? ' Verified' : ' Pending'}
</span>
                      <span className="text-black-400 text-sm">
                        {Math.round((verification?.confidence || 0) * 100)}% confidence
                      </span>
                    </div>

                    {/* Casualties Alert */}
                    {extracted?.hasCasualties && (
                      <div className="bg-red-600/20 border border-red-500 rounded-lg px-3 py-2 mb-4">
                        <p className="text-red-400 font-bold text-sm text-center">
                           CASUALTIES REPORTED
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Clock className="w-4 h-4 text-black" />
    <span className="text-black text-sm">
      {formatTimeAgo(report.timestamp)}
    </span>
  </div>
  <span className="text-black text-xs">
    {verification?.similarReportsCount || 0} similar
  </span>
</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Selected Report */}
        {selectedReport && (
          <div className="fixed inset-0 bg-[#fff7ed] flex items-center justify-center p-4 z-50"
onClick={() => setSelectedReport(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-200 shadow-xl"
 onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Full Report Details
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="bg-orange-50 border border-orange-200
 rounded-lg p-4">
                  <h3 className="text-orange-400 font-semibold mb-2">Report Text</h3>
                  <p className="text-gray-800">{selectedReport.reportText || 'No description provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 border border-orange-200
 rounded-lg p-4">
                    <h3 className="text-orange-400 font-semibold mb-2">Location</h3>
                    <p className="text-gray-800">{selectedReport.extractedInfo?.location || 'Unknown'}</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200
 rounded-lg p-4">
                    <h3 className="text-orange-400 font-semibold mb-2">Fire Type</h3>
                    <p className="text-gray-800">{selectedReport.extractedInfo?.fireType || 'Unknown'}</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-orange-400 font-semibold mb-2">Severity</h3>
                    <p className="text-gray-800">{selectedReport.extractedInfo?.severity || 'Unknown'}</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-orange-400 font-semibold mb-2">Urgency</h3>
                    <p className="text-gray-800 text-2xl font-bold">{selectedReport.extractedInfo?.urgencyScore || 0}/10</p>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200
 rounded-lg p-4">
                  <h3 className="text-orange-400 font-semibold mb-2">Verification Details</h3>
                  <p className="text-gray-800">Status: {selectedReport.verification?.status || 'Unknown'}</p>
                  <p className="text-gray-800">Confidence: {Math.round((selectedReport.verification?.confidence || 0) * 100)}%</p>
                  <p className="text-gray-800">Similar Reports: {selectedReport.verification?.similarReportsCount || 0}</p>
                  <p className="text-gray-800 mt-2">Reason: {selectedReport.verification?.reason || 'N/A'}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200
 rounded-lg p-4">
                  <h3 className="text-orange-400 font-semibold mb-2">Timestamp</h3>
                  <p className="text-gray-800">{new Date(selectedReport.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdvancedFireReportsMap; 