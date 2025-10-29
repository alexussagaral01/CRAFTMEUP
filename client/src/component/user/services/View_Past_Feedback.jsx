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
  }, []);

  useEffect(() => {
  fetchFeedback();
}, [activeRole, userData]);

  const fetchFeedback = async () => {
  setIsLoading(true);
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user:', user);
    
    const response = await getUserFeedback(user.id);
    console.log('Raw response:', response); // Debug the raw response

    // Since getUserFeedback already returns response.data, we don't need to access .data again
    if (Array.isArray(response)) {  // Changed from response.data to response
      const given = response.filter(f => 
        String(f.user_id) === String(user.id)
      );
      
      const received = response.filter(f => 
        f.provider_name && f.provider_name.toLowerCase() === user.full_name.toLowerCase()
      );
      
      console.log('Filtered given feedback:', given);
      console.log('Filtered received feedback:', received);

      setGivenFeedback(given);
      setReceivedFeedback(received);
    } else {
      console.error('Invalid response format:', response);
      setGivenFeedback([]);
      setReceivedFeedback([]);
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    setGivenFeedback([]);
    setReceivedFeedback([]);
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
          <button 
              onClick={() => navigate('/notification')} 
              className="relative"
            >
              <BellIcon className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>
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

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-3xl font-bold text-center">
              {currentFeedback.length}
            </p>
            <p className="text-gray-500 text-sm text-center">Reviews {activeTab}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-3xl font-bold text-center text-yellow-500">
              {currentFeedback.length > 0
                ? (currentFeedback.reduce((acc, f) => acc + f.rating, 0) / currentFeedback.length).toFixed(1)
                : "0.0"}
            </p>
            <p className="text-gray-500 text-sm text-center">Average Rating</p>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading feedback...</div>
          ) : currentFeedback.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} feedback yet
            </div>
          ) : (
            currentFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white p-4 rounded-xl shadow-sm space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{feedback.service_title}</h3>
                    <p className="text-sm text-gray-500">{feedback.provider_name}</p>
                  </div>
                  {renderStars(feedback.rating)}
                </div>
                {feedback.comment && (
                  <p className="text-gray-600 text-sm">{feedback.comment}</p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}