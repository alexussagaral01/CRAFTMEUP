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
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from "react-icons/fi";

function ConfirmPayment({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[85%] max-w-sm m-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Confirm Payment</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">Resume Editing</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">John A. Reyes</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">60 SkillCoins</span>
          </div>

          <hr />

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Your Balance:</span>
            <span className="font-medium">100 SkillCoins</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining:</span>
            <span className="font-medium">40 SkillCoins</span>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
            <FiAlertTriangle className="text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-700">
              Note: This action is final and cannot be reversed.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
              Confirm Payment
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

export default function Transaction() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
            <h1 className="text-lg font-semibold">Transactions</h1>
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

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Current Transactions */}
        <div className="mb-6">
          <h2 className="text-gray-600 text-sm font-medium mb-2">
            Current Transactions
          </h2>
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Crocheting for Beginners</h3>
              <p className="font-semibold">₱150</p>
            </div>
            <p className="text-gray-500 text-sm mb-3">
              Learn to crochet scarves, coasters, and other beginner-friendly patterns.
            </p>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                On-Going
              </span>
              <p className="text-gray-400 text-xs">Jun 15, 2025</p>
            </div>
            <button 
              className="mt-3 w-full bg-green-500 text-white text-sm py-2 rounded-lg hover:bg-green-600"
              onClick={() => setShowConfirmModal(true)}
            >
              Mark as Completed
            </button>
          </div>
        </div>

        {/* Past Transactions */}
        <div>
          <h2 className="text-gray-600 text-sm font-medium mb-2">
            Past Transactions
          </h2>
          
          {/* Transaction 1 */}
          <div className="border rounded-lg p-4 shadow-sm bg-white mb-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Hand Embroidery</h3>
              <p className="font-semibold">₱150</p>
            </div>
            <p className="text-gray-500 text-sm mb-3">
              Basic stitches and pattern making for clothing or décor.
            </p>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Completed
              </span>
              <p className="text-gray-400 text-xs">Jan 12, 2025</p>
            </div>
          </div>

          {/* Transaction 2 */}
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">DIY Scrapbooking Techniques</h3>
              <p className="font-semibold">₱150</p>
            </div>
            <p className="text-gray-500 text-sm mb-3">
              Layout tips, material selection, and creative ideas for memory-keeping.
            </p>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Completed
              </span>
              <p className="text-gray-400 text-xs">Nov 19, 2024</p>
            </div>
          </div>
        </div>

        {/* Add Confirm Payment Modal */}
        {showConfirmModal && <ConfirmPayment onClose={() => setShowConfirmModal(false)} />}
      </div>
    </div>
  );
}
