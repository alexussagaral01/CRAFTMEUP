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
  const [activeRole, setActiveRole] = useState("learner");
  const [givenFeedback, setGivenFeedback] = useState([]);
  const [receivedFeedback, setReceivedFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserData(storedUser);
    if (storedUser?.role?.toLowerCase() === 'tutor') {
      setActiveRole('tutor');
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [activeRole]);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await getUserFeedback(user.id);
      
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
      } else if (user.role.toLowerCase() === 'learner') {
        given = response.data.filter(f => f.reviewer_id === user.id && f.reviewer_role === 'learner');
        received = response.data.filter(f => f.service_provider_id === user.id && f.reviewer_role === 'learner');
      } else if (user.role.toLowerCase() === 'tutor') {
        given = response.data.filter(f => f.reviewer_id === user.id && f.reviewer_role === 'tutor');
        received = response.data.filter(f => f.service_provider_id === user.id && f.reviewer_role === 'tutor');
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

      {/* Stats Summary */}
      <div className="p-4 bg-white border-b">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {activeTab === "given" ? givenFeedback.length : receivedFeedback.length}
            </p>
            <p className="text-xs text-gray-500">
              {activeTab === "given" ? "Reviews Given" : "Reviews Received"}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-500">
              {currentFeedback.length > 0
                ? (currentFeedback.reduce((sum, f) => sum + f.rating, 0) / currentFeedback.length).toFixed(1)
                : "0.0"}
            </p>
            <p className="text-xs text-gray-500">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading feedback...</p>
          </div>
        ) : currentFeedback.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500">
              {activeTab === "given" 
                ? `No feedback given as ${activeRole}` 
                : `No feedback received as ${activeRole}`}
            </p>
          </div>
        ) : (
          currentFeedback.map((feedback, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{feedback.service_title}</p>
                  {activeTab === "given" ? (
                    <p className="text-sm text-gray-500">To: {feedback.provider_name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">From: {feedback.reviewer_name}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(feedback.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center mb-2">
                {renderStars(feedback.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {feedback.rating}/5
                </span>
              </div>
              
              {feedback.comment && (
                <p className="text-gray-700 text-sm">
                  {feedback.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}