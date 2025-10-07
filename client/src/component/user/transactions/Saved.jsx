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
  StarIcon,
  ClockIcon,
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
    { name: "Past Feedbacks", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/view-past-feedback" },
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
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full">
      {/* Sidebar with fixed height and scrolling */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30
        flex flex-col h-full`}>
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
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-1">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <div className="w-full px-2">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <Bars3Icon className="h-6 w-6 text-white" />
                </button>
                <h1 className="text-lg font-semibold ml-3">Saved Services</h1>
              </div>
              <button 
                onClick={() => navigate('/notification')} 
                className="relative p-2"
              >
                <BellIcon className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
              </button>
            </div>

            {/* Filter Section */}
            <div className="px-2 pb-4">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <button className="flex items-center justify-between w-full text-sm">
                  <span>All Categories</span>
                  <ChevronDownIcon className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Services Grid */}
        <div className="w-full px-2 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {saved.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:scale-[1.02] transition-all relative"
                >
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                    <HeartIcon className="h-5 w-5" />
                  </button>

                  <h2 className="font-semibold text-sm pr-8">{service.title}</h2>
                  <p className="text-xs text-gray-500">{service.category}</p>
                  <p className="font-semibold text-sm mt-2">{service.price}</p>

                  <div className="flex items-center text-xs text-gray-500 mt-1 gap-4">
                    <span className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      {service.rating}
                    </span>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {service.duration}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="px-2 py-1 text-xs rounded-lg bg-blue-50 text-blue-600">
                      {service.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
