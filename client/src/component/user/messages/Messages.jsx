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
  BookmarkIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon as SearchIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';

export default function Messages() {
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

  const chats = [
    {
      name: "Sarah Chen",
      time: "2:30 PM",
      message: "Sure! I can help with your logo design project...",
      service: "Logo Design Service",
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Mike Johnson",
      time: "Yesterday",
      message: "Thanks for the math tutoring session!",
      service: "Math Tutoring Service",
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Emma Davis",
      time: "11:45 AM",
      message: "When would be a good time to start the project?",
      service: "Web Development Service",
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Alex Rivera",
      time: "Monday",
      message: "Perfect! The essay editing is complete.",
      service: "Essay Editing Service",
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Lisa Park",
      time: "Sunday",
      message: "Great working with you on the presentation!",
      service: "Presentation Design Service",
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Tom Wilson",
      time: "Last Week",
      message: "The coding assignment help was excellent!",
      service: "Programming Help Service",
      avatar: "https://via.placeholder.com/40",
    },
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
            <h1 className="text-lg font-semibold">Messages</h1>
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

      {/* Search */}
      <div className="px-4 py-3 sticky top-0 bg-white/80 backdrop-blur-md border-b z-10">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4">
        {chats.map((chat, index) => (
          <div 
            key={index}
            onClick={() => navigate('/messages/chat')}
            className="flex items-center space-x-3 p-3 hover:bg-blue-50/50 rounded-2xl transition-all cursor-pointer border-b border-gray-100 last:border-none"
          >
            <div className="relative">
              <img 
                src={chat.avatar} 
                className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">{chat.name}</h2>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.message}</p>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full mt-1 inline-block">
                {chat.service}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
