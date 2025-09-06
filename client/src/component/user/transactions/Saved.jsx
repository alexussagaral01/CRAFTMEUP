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
  HeartIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';

export default function Saved() {
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

  const saved = [
    {
      title: "Origami Basics & Decorative Folding",
      category: "Origami Services",
      price: "SC 150/session",
      rating: "4.8",
      duration: "2-3 hrs",
      tag: "Crafting"
    },
    {
      title: "Crocheting for Beginners",
      category: "Crochet",
      price: "SC 150/hour",
      rating: "4.9",
      duration: "1-2 hrs",
      tag: "Crafting"
    },
    {
      title: "Hand Embroidery Essentials",
      category: "Hand Embroidery",
      price: "SC 150/visit",
      rating: "4.7",
      duration: "3-4 hrs",
      tag: "Crafting"
    },
    {
      title: "DIY Scrapbooking Techniques",
      category: "Scrapbooking",
      price: "SC 150/session",
      rating: "4.6",
      duration: "2 hrs",
      tag: "Crafting"
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
            <h1 className="text-lg font-semibold">Saved Services</h1>
          </div>
          <button 
            onClick={() => navigate('/notification')} 
            className="relative"
          >
            <BellIcon className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>
        </div>

        {/* Dropdown Filter */}
        <div className="mt-4">
          <button className="flex items-center justify-between w-full bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-sm">
            <span>All Categories</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Saved Services List with updated styling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {saved.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform relative"
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
              <HeartIcon className="h-5 w-5" />
            </button>

            <h2 className="font-semibold text-sm">{s.title}</h2>
            <p className="text-xs text-gray-500">{s.category}</p>
            <p className="font-semibold text-sm mt-2">{s.price}</p>

            <div className="flex items-center text-xs text-gray-500 mt-1 gap-4">
              <span>⭐ {s.rating}</span>
              <span>⏱ {s.duration}</span>
            </div>

            <div className="mt-2">
              <span className="px-2 py-1 text-xs rounded-lg bg-gray-200 text-gray-700">
                {s.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
