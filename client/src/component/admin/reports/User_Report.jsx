import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  WalletIcon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { getAllReports, updateReportStatus, getUserReportHistory, notifyUser } from "../../../services/api";

const ReportDetailModal = ({ selectedReport, onClose, reportHistory, onResolve, violationTypes, getStatusBadgeClass }) => {
  if (!selectedReport) return null;

  const isResolved = selectedReport.status && selectedReport.status !== 'pending';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Report Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-medium text-gray-700">Reporter</h4>
            <p>{selectedReport.reporter_name}</p>
            <p className="text-sm text-gray-500">ID: {selectedReport.reporter_id}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Reported User</h4>
            <p>{selectedReport.reported_user_name}</p>
            <p className="text-sm text-gray-500">ID: {selectedReport.reported_user_id}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700">Report Reason</h4>
          <p>{selectedReport.reason}</p>
          <h4 className="font-medium text-gray-700 mt-4">Report Description</h4>
          {selectedReport.description && (
            <p className="text-sm text-gray-600">{selectedReport.description}</p>
          )}
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Violation Type</h4>
          <div className="p-2 bg-gray-50 rounded-lg border">
            <p className="text-gray-600">{selectedReport.violationType || 'Not specified'}</p>
            <div className="mt-2">
              <h5 className="text-sm text-gray-600">Subcategories:</h5>
              <div className="flex flex-wrap gap-2 mt-1">
                {violationTypes[selectedReport.violationType || 'minor']?.map(type => (
                  <span key={type} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {type.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!isResolved && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => onResolve(selectedReport.id, 'invalid')}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
            >
              Mark Invalid
            </button>
            <button
              onClick={() => onResolve(selectedReport.id, 'warning')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Issue Warning
            </button>
            <button
              onClick={() => onResolve(selectedReport.id, 'suspended')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Suspend User
            </button>
          </div>
        )}

        {isResolved && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Resolution Details</h4>
              <p className="text-sm text-gray-600">Status: 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Resolved on: {selectedReport.updated_at ? new Date(selectedReport.updated_at).toLocaleString() : 'Not resolved'}
              </p>
              {selectedReport.adminNotes && (
                <p className="text-sm text-gray-600 mt-1">
                  Notes: {selectedReport.adminNotes}
                </p>
              )}
            </div>
          )}
      </div>
    </div>
  );
};


export default function UserReports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    thisWeek: 0
  });

  const sidebarItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, path: "/admin-dashboard" },
    { name: "User Reports", icon: <UsersIcon className="w-5 h-5" />, path: "/user-reports" },
    { name: "Account Verification", icon: <CheckCircleIcon className="w-5 h-5" />, path: "/account-verification" },
    { name: "Wallet Requests", icon: <WalletIcon className="w-5 h-5" />, path: "/wallet-logs" },
    { name: "Post Announcement", icon: <MegaphoneIcon className="w-5 h-5" />, path: "/announcements" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
  ];

  const violationTypes = {
    minor: ['spam', 'rude_message', 'irrelevant_post'],
    serious: ['harassment', 'scamming', 'fake_credentials', 'offensive_behavior'],
    abuse: ['fake_account', 'coin_misuse', 'credit_abuse']
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await getAllReports();
      console.log('Reports response:', response);
      
      setReports(response);
      
      const pending = response.filter(r => r.status === 'pending' || !r.status).length;
      const resolved = response.filter(r => r.status === 'resolved').length;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeek = response.filter(r => new Date(r.created_at) > oneWeekAgo).length;

      setStats({
        total: response.length,
        pending,
        resolved,
        thisWeek
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (report) => {
  try {
    console.log('Opening modal for report:', report);
    setSelectedReport(report);
    setShowDetailModal(true);
  } catch (error) {
    console.error('Error showing report details:', error);
  }
};

  const handleResolveReport = async (reportId, resolution) => {
  try {
    console.log('Resolving report:', reportId, resolution);

    const statusData = {
      status: resolution,
      violationType: selectedReport.violationType, // Use the existing violation type
      adminNotes: resolution === 'invalid' 
        ? 'No violation found' 
        : `${selectedReport.violationType} violation confirmed`,
      resolvedAt: new Date().toISOString()
    };

    await updateReportStatus(reportId, statusData);

    await Promise.all([
      notifyUser(selectedReport.reporter_id, {
        type: 'report_resolved',
        message: `Your report has been reviewed and marked as ${resolution}.`
      }),
      resolution !== 'invalid' && notifyUser(selectedReport.reported_user_id, {
        type: resolution,
        message: `Your account has received a ${resolution} due to ${violationType} violation.`
      })
    ].filter(Boolean));

    setShowDetailModal(false);
    await fetchReports();
    
    alert(`Report has been marked as ${resolution}`);
    
  } catch (error) {
    console.error('Error resolving report:', error);
    alert('Failed to resolve report. Please try again.');
  }
};

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'resolved':
        return 'bg-green-100 text-green-600';
      case 'suspended':
        return 'bg-red-100 text-red-600';
      case 'invalid':
        return 'bg-gray-100 text-gray-600';
      case 'warning':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredReports = reports.filter(report => 
    (report.reported_user_name?.toLowerCase().includes(search.toLowerCase()) ||
    report.reporter_name?.toLowerCase().includes(search.toLowerCase()) ||
    report.reason?.toLowerCase().includes(search.toLowerCase()))
    &&
    (showHistory 
      ? report.status !== 'pending' 
      : report.status === 'pending' || !report.status)
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl z-20">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-100 text-sm mt-1">System Management</p>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex items-center w-full p-3 text-gray-600 hover:text-blue-600 rounded-xl transition-all duration-200 group hover:bg-gradient-to-r from-blue-50 to-indigo-50"
            >
              <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <span className="ml-3 font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              User Reports
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                AS
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-gray-500 text-sm">Total Reports</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-gray-500 text-sm">Pending</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">{stats.resolved}</p>
              <p className="text-gray-500 text-sm">Resolved</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">{stats.thisWeek}</p>
              <p className="text-gray-500 text-sm">This Week</p>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="pl-10 pr-3 py-2 w-full border rounded-lg focus:ring focus:ring-gray-300"
              />
            </div>
            <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showHistory 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ClockIcon className="w-5 h-5 mr-2" />
                {showHistory ? 'Pending Reports' : 'History'}
              </button>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">Loading reports...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-gray-500">
                    <th className="py-2">Reported User</th>
                    <th className="py-2">Reporter</th>
                    <th className="py-2">Reason</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <p className="font-medium">{report.reported_user_name}</p>
                        <p className="text-gray-500 text-xs">ID: {report.reported_user_id}</p>
                      </td>
                      <td>
                        <p className="font-medium">{report.reporter_name}</p>
                        <p className="text-gray-500 text-xs">ID: {report.reporter_id}</p>
                      </td>
                      <td>
                        <p>{report.reason}</p>
                        {report.description && (
                          <p className="text-gray-500 text-xs truncate max-w-xs">
                            {report.description}
                          </p>
                        )}
                      </td>
                      <td>{new Date(report.created_at).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            getStatusBadgeClass(report.status)
                          }`}
                        >
                          {report.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col space-y-2">
                          <button 
                            className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                            onClick={() => handleViewDetails(report)}
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing 1 to {filteredReports.length} of {reports.length} results
            </p>
            <div className="flex space-x-2">
              <button className="p-2 border rounded-lg hover:bg-gray-200">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button className="px-3 py-1 border rounded-lg bg-black text-white">
                1
              </button>
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-200">
                2
              </button>
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-200">
                3
              </button>
              <button className="p-2 border rounded-lg hover:bg-gray-200">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      {showDetailModal && (
        <ReportDetailModal
          selectedReport={selectedReport}
          onClose={() => setShowDetailModal(false)}
          onResolve={handleResolveReport}
          violationTypes={violationTypes}
          getStatusBadgeClass={getStatusBadgeClass}
        />
      )}
    </div>
  );
}