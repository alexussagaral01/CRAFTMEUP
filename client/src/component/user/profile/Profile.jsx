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
  const storedUser = JSON.parse(localStorage.getItem('user'));
  setUserData(storedUser);
}, []);

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

  // Add to all components
const role = userData?.role?.toLowerCase() || '';

const navItems = (() => {
  if (role === 'learner') {
    return [
      { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
      { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
      { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
      { name: "Find Services", icon: <MagnifyingGlassIcon className="h-5 w-5" />, path: "/find-services" },
      { name: "Saved", icon: <BookmarkIcon className="h-5 w-5" />, path: "/saved" },
      { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
      { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
      { name: "Past Feedbacks", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/view-past-feedback" },
      { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
    ];
  }

  if (role === 'tutor') {
    return [
      { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
      { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
      { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
      { name: "My Services", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/my-services" },
      { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
      { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
      { name: "Past Feedbacks", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/view-past-feedback" },
      { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
    ];
  }

  return [
    { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
    { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
    { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
    { name: "My Services", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/my-services" },
    { name: "Find Services", icon: <MagnifyingGlassIcon className="h-5 w-5" />, path: "/find-services" },
    { name: "Saved", icon: <BookmarkIcon className="h-5 w-5" />, path: "/saved" },
    { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
    { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
    { name: "Past Feedbacks", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/view-past-feedback" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
  ];
})();

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
    <div className="p-4 space-y-4">
      <div>
        <label className="text-gray-600 text-sm">Full Name</label>
        <input
          type="text"
          name="full_name"
          value={isEditing ? editedData.full_name : (userData?.full_name || '')}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            isEditing ? 'bg-white' : 'bg-gray-50'
          }`}
        />
      </div>

      {/* School Email */}
      <div>
        <label className="text-gray-600 text-sm">School Email</label>
        <div className="flex items-center border rounded-lg px-3 py-2 mt-1 justify-between bg-gray-50">
          <span>{userData?.email || ''}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Verified</p>
      </div>

      {/* Course */}
      <div>
        <label className="text-gray-600 text-sm">Course</label>
        <input
          type="text"
          name="course"
          value={isEditing ? editedData.course : (userData?.course || 'Not specified')}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            isEditing ? 'bg-white' : 'bg-gray-50'
          }`}
        />
      </div>

      {/* Year Level */}
      <div>
        <label className="text-gray-600 text-sm">Year Level</label>
        <input
          type="text"
          name="year"
          value={isEditing ? editedData.year : (userData?.year || 'Not specified')}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full border rounded-lg px-3 py-2 mt-1 ${
            isEditing ? 'bg-white' : 'bg-gray-50'
          }`}
        />
      </div>

      {/* Role */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-gray-700 font-medium">Role: {userData?.role || 'User'}</span>
        <button className="text-blue-500 text-sm hover:text-blue-600">Request Change</button>
      </div>

      {/* Account Verification Status */}
      {renderVerificationStatus()}

      {/* Action Buttons (only show when editing) */}
      {isEditing && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto relative">
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

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm mx-4 mt-4">
          {/* Profile Section */}
          <div className="flex flex-col items-center py-6 border-b">
            <div className="relative">
              <img
                src={userData?.profileImage || "https://via.placeholder.com/100"}
                alt=""
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                <CameraIcon className="h-5 w-5" />
              </button>
            </div>
            <button className="mt-3 text-blue-600 font-medium text-sm hover:text-blue-700">
              Upload New Photo
            </button>

            {/* Edit Profile button moved here */}
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
  );
}
