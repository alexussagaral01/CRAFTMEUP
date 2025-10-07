import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  WalletIcon,
  ReceiptRefundIcon,
  ChatBubbleOvalLeftIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  BookmarkIcon,
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api'; 

export default function Profile() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const response = await api.get(`/auth/user/${user.id}`);
          const freshUserData = response.data;
          
          // Update local state and localStorage with fresh data
          setUserData(freshUserData);
          localStorage.setItem('user', JSON.stringify(freshUserData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setEditedData(userData || {});
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/auth/update-profile/${userData.id}`, {
        full_name: editedData.full_name,
        course: editedData.course,
        year: editedData.year
      });

      const updatedUser = response.data.user;
      
      // Update both state and localStorage
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value
    });
  };

  const navItems = [
    { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
    { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
    { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
    { name: "My Services", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/my-services" },
    { name: "Find Services", icon: <MagnifyingGlassIcon className="h-5 w-5" />, path: "/find-services" },
    { name: "Saved", icon: <BookmarkIcon className="h-5 w-5" />, path: "/saved" },
    { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
    { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
    { name: "Feedback", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/feedback" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
  ];

  // Function to render verification status
  const renderVerificationStatus = () => {
    console.log('User Data:', userData); // Debug log
    
    if (userData?.verified === 1 || userData?.verification_status === 'approved') {
      return (
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-green-50 border-green-200">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-700 font-medium">Account Verified - Your account has been fully verified</span>
        </div>
      );
    } else if (userData?.verification_status === 'rejected') {
      return (
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-red-50 border-red-200">
          <XCircleIcon className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-700 font-medium">Verification Rejected - Please contact support</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-yellow-50 border-yellow-200">
        <ClockIcon className="h-5 w-5 text-yellow-500" />
        <span className="text-sm text-yellow-700 font-medium">Verification Pending - Your account is awaiting verification</span>
      </div>
    );
  };

  const renderFormInputs = () => (
    <div className="p-4">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="col-span-full">
          <label className="text-gray-600 text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={isEditing ? editedData.full_name : (userData?.full_name || '')}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full border rounded-xl px-4 py-3 mt-1 text-gray-700 ${
              isEditing ? 'bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'bg-gray-50'
            }`}
          />
        </div>

        {/* School Email */}
        <div className="col-span-full">
          <label className="text-gray-600 text-sm font-medium">School Email</label>
          <div className="flex items-center border rounded-xl px-4 py-3 mt-1 bg-gray-50">
            <span className="text-gray-700">{userData?.email || ''}</span>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
          </div>
        </div>

        {/* Course */}
        <div>
          <label className="text-gray-600 text-sm font-medium">Course</label>
          <input
            type="text"
            name="course"
            value={isEditing ? editedData.course : (userData?.course || 'Not specified')}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full border rounded-xl px-4 py-3 mt-1 text-gray-700 ${
              isEditing ? 'bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'bg-gray-50'
            }`}
          />
        </div>

        {/* Year Level */}
        <div>
          <label className="text-gray-600 text-sm font-medium">Year Level</label>
          <input
            type="text"
            name="year"
            value={isEditing ? editedData.year : (userData?.year || 'Not specified')}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full border rounded-xl px-4 py-3 mt-1 text-gray-700 ${
              isEditing ? 'bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'bg-gray-50'
            }`}
          />
        </div>

        {/* Role Section */}
        <div className="col-span-full flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <span className="text-gray-700 font-medium">Role: {userData?.role || 'User'}</span>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            Request Change
          </button>
        </div>

        {/* Verification Status */}
        <div className="col-span-full">
          {renderVerificationStatus()}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="col-span-full flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 border rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
          <h2 className="font-semibold text-white">Menu</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
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

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
          <button 
            onClick={() => navigate('/notification')} 
            className="relative"
          >
            <BellIcon className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="w-full px-2 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center py-8 border-b">
              <div className="relative">
                <img
                  src={userData?.profileImage || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                  <CameraIcon className="h-5 w-5" />
                </button>
              </div>
              <button className="mt-4 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                Upload New Photo
              </button>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Form Section */}
            {renderFormInputs()}
          </div>
        </div>
      </div>
    </div>
  );
}
