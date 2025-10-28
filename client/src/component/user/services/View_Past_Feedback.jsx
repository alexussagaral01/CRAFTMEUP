import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiEdit3, FiStar } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { getUserFeedback } from '../../../services/api';
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
} from "@heroicons/react/24/outline";

export default function ViewPastFeedback() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("given");
  const [activeRole, setActiveRole] = useState("learner"); // New state for role toggle
  const [givenFeedback, setGivenFeedback] = useState([]);
  const [receivedFeedback, setReceivedFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const role = userData?.role?.toLowerCase() || '';

  // Navigation items based on role
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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserData(storedUser);
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [activeRole]); // Re-fetch when activeRole changes

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await getUserFeedback(user.id);
      
      // Filter feedback based on active role and user role
      let given = [];
      let received = [];

      if (user.role.toLowerCase() === 'both') {
        if (activeRole === 'learner') {
          given = response.data.filter(f => f.reviewer_id === user.id && f.reviewer_role === 'learner');
          received = response.data.filter(f => f.service_provider_id === user.id && f.reviewer_role === 'learner');
        } else {
          given = response.data.filter(f => f.reviewer_id === user.id && f.reviewer_role === 'tutor');
          received = response.data.filter(f => f.service_provider_id === user.id && f.reviewer_role === 'tutor');
        }
      } else {
        given = response.data.filter(f => f.reviewer_id === user.id);
        received = response.data.filter(f => f.service_provider_id === user.id);
      }
      
      setGivenFeedback(given);
      setReceivedFeedback(received);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? "text-yellow-500" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const currentFeedback = activeTab === "given" ? givenFeedback : receivedFeedback;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
          <h2 className="font-semibold text-white">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors">
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
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Bars3Icon className="h-6 w-6 text-white" />
          </button>
          <button className="text-white" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Feedback & Ratings</h1>
        </div>

        {/* Role Toggle for 'both' users */}
        {userData?.role?.toLowerCase() === 'both' && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm p-1 rounded-xl flex mb-2">
            <button
              onClick={() => setActiveRole("learner")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeRole === "learner"
                  ? "bg-white text-blue-600"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              As Learner
            </button>
            <button
              onClick={() => setActiveRole("tutor")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeRole === "tutor"
                  ? "bg-white text-blue-600"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              As Tutor
            </button>
          </div>
        )}

        {/* Toggle Tabs */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab("given")}
            className={`flex items-center justify-center gap-1 w-1/2 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "given"
                ? "bg-white text-blue-600"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            <FiEdit3 />
            <span>Given</span>
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`flex items-center justify-center gap-1 w-1/2 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "received"
                ? "bg-white text-blue-600"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            <FiStar />
            <span>Received</span>
          </button>
        </div>
      </div>

      {/* Rest of your existing code... */}
      {/* Stats Summary and Feedback List sections remain the same */}
    </div>
  );
}