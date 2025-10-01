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
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { getWalletBalance, getUserTransactions } from '../../../services/api';

export default function Wallet() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

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

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      // Fetch wallet balance
      const balanceResponse = await getWalletBalance(user.id);
      setBalance(balanceResponse.data.balance);

      // Fetch transactions
      const transactionsResponse = await getUserTransactions(user.id);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-lg font-semibold">Wallet</h1>
          </div>
          <button 
            onClick={() => navigate('/notification')} 
            className="relative"
          >
            <BellIcon className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>
        </div>

        {/* Balance Card - Inside Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <p className="text-white/80 text-sm">Current Balance</p>
          <h2 className="text-3xl font-bold mt-1 text-white">{balance}</h2>
          <p className="text-white/80 text-sm">SkillCoins</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-medium mb-2">GCash Reference Number</p>
          <input
            type="text"
            placeholder="Enter reference number"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-medium mb-2">Upload Proof of Payment</p>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <ArrowUpTrayIcon className="h-7 w-7 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Tap to upload image</p>
            <p className="text-xs text-gray-400 mt-1">(PNG, JPG up to 5MB)</p>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
          Submit Top-Up Request
        </button>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Transaction History</h3>
          <div className="space-y-3">
            {transactions.map((t, i) => (
              <div key={i} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">{t.type}</p>
                  <span className={`text-sm font-semibold ${
                    t.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {t.type === 'credit' ? '+' : '-'}{t.amount}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(t.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">Ref: {t.reference_number}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
