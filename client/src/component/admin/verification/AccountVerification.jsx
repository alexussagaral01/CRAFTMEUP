import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  WalletIcon,
  MegaphoneIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import api from '../../../services/api';

export default function AccountVerification() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, path: "/admin-dashboard" },
    { name: "User Reports", icon: <UsersIcon className="w-5 h-5" />, path: "/user-reports" },
    { name: "Account Verification", icon: <CheckCircleIcon className="w-5 h-5" />, path: "/account-verification" },
    { name: "Wallet Logs", icon: <WalletIcon className="w-5 h-5" />, path: "/wallet-logs" },
    { name: "Post Announcement", icon: <MegaphoneIcon className="w-5 h-5" />, path: "/announcements" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
  ];

  useEffect(() => {
    fetchUnverifiedUsers();
  }, []);

  const fetchUnverifiedUsers = async () => {
    try {
      const response = await api.get('/auth/unverified-users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleVerify = async (userId, status) => {
    try {
      await api.post(`/auth/verify-user/${userId}`, { status });
      fetchUnverifiedUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

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
              Account Verification
            </h2>
            <div className="text-sm text-gray-600">
              Pending: <span className="font-semibold text-blue-600">{users.length}</span>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow">
              <CheckCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No pending verifications</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{user.full_name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Course:</span>
                        <span className="font-medium text-gray-700">{user.course}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Year:</span>
                        <span className="font-medium text-gray-700">{user.year}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetails(user)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
                    >
                      View Details & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Verification Details</h2>
                <p className="text-blue-100 text-sm mt-1">Review user information and documents</p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">User Information</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 font-medium uppercase">Full Name</label>
                      <p className="font-medium text-gray-800 mt-1">{selectedUser.full_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 font-medium uppercase">Email</label>
                      <p className="font-medium text-gray-800 mt-1">{selectedUser.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 font-medium uppercase">Course</label>
                      <p className="font-medium text-gray-800 mt-1">{selectedUser.course}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 font-medium uppercase">Year Level</label>
                      <p className="font-medium text-gray-800 mt-1">{selectedUser.year}</p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-medium uppercase">Role</label>
                      <p className="font-medium text-gray-800 mt-1">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Submitted Documents</h3>
                  
                  <div>
                    <label className="text-sm text-gray-600 font-medium mb-2 block">Student ID</label>
                    {selectedUser.student_id_file ? (
                      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={`http://localhost:5000${selectedUser.student_id_file}`}
                          alt="Student ID"
                          className="w-full object-contain max-h-48"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500 text-sm">No file uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 font-medium mb-2 block">Study Load</label>
                    {selectedUser.study_load_file ? (
                      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={`http://localhost:5000${selectedUser.study_load_file}`}
                          alt="Study Load"
                          className="w-full object-contain max-h-48"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500 text-sm">No file uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 flex space-x-4 border-t">
              <button
                onClick={() => handleVerify(selectedUser.id, 'approved')}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <CheckCircleIcon className="w-5 h-5" />
                <span>Approve Account</span>
              </button>
              <button
                onClick={() => handleVerify(selectedUser.id, 'rejected')}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <XCircleIcon className="w-5 h-5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}