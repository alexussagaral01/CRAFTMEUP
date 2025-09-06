import React, { useState } from "react";
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
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto relative">
      {/* Sidebar - Updated to match Dashboard */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
          <h2 className="font-semibold text-white">Menu</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
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

      {/* Header - Updated to match dashboard */}
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

      {/* Content area with updated styling */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm mx-4 mt-4">
          {/* Profile Section */}
          <div className="flex flex-col items-center py-6 border-b">
            <div className="relative">
              <img
                src="https://via.placeholder.com/100"
                alt="profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                <CameraIcon size={16} />
              </button>
            </div>
            <button className="mt-3 text-blue-600 font-medium text-sm hover:text-blue-700">
              Upload New Photo
            </button>
          </div>

          {/* Form Section with mobile-friendly spacing */}
          <div className="p-4 space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-gray-600 text-sm">Full Name</label>
              <input
                type="text"
                value="John Smith"
                readOnly
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* School Email */}
            <div>
              <label className="text-gray-600 text-sm">School Email</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1 justify-between">
                <span>john.smith@university.edu</span>
                <CheckCircleIcon className="text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Verified</p>
            </div>

            {/* School ID */}
            <div>
              <label className="text-gray-600 text-sm">School ID</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1 justify-between">
                <span>ID Verified</span>
                <CheckCircleIcon className="text-green-500" />
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Password</span>
              <button className="text-blue-500 text-sm">Change Password</button>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Role: Student</span>
              <button className="text-blue-500 text-sm">Request Change</button>
            </div>

            {/* Account Verified */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50">
              <CheckCircleIcon className="text-green-500" />
              <span className="text-sm">Account Verified - Your account has been fully verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
