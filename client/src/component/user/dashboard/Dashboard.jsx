import React, { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon, // Changed from SearchIcon
  WalletIcon,
  ReceiptRefundIcon,
  ChatBubbleOvalLeftIcon, // Changed from AnnotationIcon
  ArrowRightOnRectangleIcon, // Changed from LogoutIcon
  BellIcon,
  StarIcon,
  PlusIcon,
  VideoCameraIcon,
  Bars3Icon,
  XMarkIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';//

export default function Dashboard() {
  const navigate = useNavigate();//
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
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col w-full md:max-w-sm mx-auto relative">
      {/* Sidebar - Updated with scrolling support */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
        {/* Header - Fixed at top */}
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

      {/* Main Content */}
      <div className="overflow-y-auto flex-1">
        {/* Welcome Section */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsSidebarOpen(true)}>
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
              <div>
                <div className="text-lg font-semibold">Welcome back, John</div>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full mt-1 inline-block backdrop-blur-sm">
                  Service Provider
                </span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/notification')} 
              className="relative"
            >
              <BellIcon className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-white/80">Active Services</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">SC 1,500</div>
              <div className="text-sm text-white/80">This Month</div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="p-4 mx-4 mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <div className="flex items-center mb-2">
            <VideoCameraIcon className="h-5 w-5 text-purple-500 mr-2" />
            <span className="font-medium">New Feature: Video Calls</span>
            <StarIcon className="h-4 w-4 text-yellow-400 ml-auto" />
          </div>
          <div className="text-sm text-gray-600 ml-7">Connect with clients through integrated video calling.</div>
        </div>

        {/* My Services */}
        <div className="p-4 m-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-lg">My Services</span>
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
              <PlusIcon className="h-4 w-4 mr-1" /> Add New
            </button>
          </div>
          
          {/* Service Cards */}
          <div className="space-y-4">
            {/* Active Service Card */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 transform transition hover:scale-[1.02]">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Resin Art Tutoring</span>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">Active</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">Learn how to safely mix and pour resin, add pigments, and finish your crafts.</div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">5 active bookings</span>
                </div>
                <span className="font-bold text-blue-600">SC 150/hr</span>
              </div>
            </div>
            
            {/* ...other service cards with similar styling... */}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-4 m-4">
          <span className="font-semibold text-lg mb-4 block">Recent Activity</span>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">New booking from Sarah M.</div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
              </div>
            </div>
            {/* ...other activity items... */}
          </div>
        </div>
      </div>
    </div>
  );
}
