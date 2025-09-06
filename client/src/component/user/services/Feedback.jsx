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
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';

function ReportUser({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-[85%] max-w-sm">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Report User</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* User Info - More compact */}
          <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-xl">
            <img
              src="https://via.placeholder.com/40"
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="font-medium text-sm">Sarah Johnson</h3>
              <p className="text-xs text-gray-500">@sarahj_design</p>
            </div>
          </div>

          {/* Report Form - More compact */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Reason for Report<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              placeholder="Please describe the issue..."
              className="w-full border border-gray-200 rounded-xl p-2 text-sm focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500"
              rows="3"
            ></textarea>
          </div>

          {/* File Upload - More compact */}
          <div className="border border-dashed border-gray-200 rounded-xl p-3 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <PlusIcon className="h-5 w-5 mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-600">Add screenshots (optional)</p>
            <p className="text-[10px] text-gray-400">Max 5MB per file</p>
          </div>

          {/* Buttons - More compact */}
          <div className="space-y-2 pt-2">
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
              Submit Report
            </button>
            <button 
              className="w-full py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Feedback() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

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
            <h1 className="text-lg font-semibold">Rate & Review</h1>
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

      {/* Content with updated styling */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="https://via.placeholder.com/40"
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold">Sarah Johnson</h2>
              <p className="text-sm text-gray-500">House Cleaning Service</p>
              <p className="text-xs text-gray-400">Completed on Jan 15, 2025</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          {/* Rating */}
          <div className="text-center mb-4">
            <p className="text-gray-700 font-medium mb-2">How was your experience?</p>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <span
                  key={index}
                  className={`text-3xl ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm">4 out of 5 stars</p>
          </div>
        </div>

        {/* Comment Box */}
        <div className="mb-4">
          <textarea
            placeholder="Leave a comment (optional)"
            className="w-full border rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
            rows="4"
            maxLength={1500}
          ></textarea>
          <p className="text-right text-xs text-gray-400 mt-1">0/1500 characters</p>
        </div>

        {/* Report Button */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">Report an Issue</p>
          <button 
            className="bg-red-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-red-600"
            onClick={() => setShowReportModal(true)}
          >
            Report
          </button>
        </div>

        {/* Submit Buttons */}
        <div className="space-y-2 mb-6">
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            Submit Feedback
          </button>
          <button 
            onClick={() => navigate('/view-past-feedback')}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50"
          >
            View Past Feedback
          </button>
        </div>

        {/* Helpful Tips */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <h3 className="font-medium text-sm mb-1">Helpful Tips</h3>
          <p className="text-xs text-gray-600">
            Your feedback helps improve our community. Be honest and constructive
            in your review.
          </p>
        </div>

        {/* Report Modal */}
        {showReportModal && <ReportUser onClose={() => setShowReportModal(false)} />}
      </div>
    </div>
  );
}
