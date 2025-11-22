import React, { useState, useEffect } from "react";
import { FiEdit3, FiStar } from "react-icons/fi";
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
  BellIcon,
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
      const response = await getUserFeedback(user.id);

      if (Array.isArray(response)) {
        const given = response.filter(f => String(f.user_id) === String(user.id));
        const received = response.filter(f => 
          f.provider_name && f.provider_name.toLowerCase() === user.full_name.toLowerCase()
        );

        setGivenFeedback(given);
        setReceivedFeedback(received);
      } else {
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
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm sm:text-base ${i < rating ? "text-yellow-500" : "text-gray-300"}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const currentFeedback = activeTab === "given" ? givenFeedback : receivedFeedback;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col lg:flex-row w-full">
      {/* Sidebar - Desktop (always visible) */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 bg-gradient-to-b from-gray-50 to-white w-64 flex-col shadow-xl border-r z-30">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="font-semibold text-white text-lg">Menu</h2>
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
              <span className="ml-3 font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar - Mobile (toggle-based) */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-40 lg:hidden flex flex-col shadow-xl border-r`}>
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
          <h2 className="font-semibold text-white">Menu</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className="flex items-center w-full p-3 text-gray-600 hover:text-blue-600 rounded-xl transition-all duration-200 group hover:bg-gradient-to-r from-blue-50 to-indigo-50"
            >
              <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <span className="ml-3 font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-20 shadow-lg">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex-shrink-0 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold truncate">Feedback & Ratings</h1>
            </div>
            <button 
              onClick={() => navigate('/notification')} 
              className="flex-shrink-0 hover:bg-white/10 p-2 rounded-lg transition-colors relative"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>
          </div>

          {/* Role Toggle for 'both' users */}
          {userData?.role?.toLowerCase() === 'both' && (
            <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl flex gap-1 mb-3">
              <button
                onClick={() => setActiveRole("learner")}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeRole === "learner" ? "bg-white text-blue-600" : "text-white/90 hover:bg-white/10"
                }`}
              >
                As Learner
              </button>
              <button
                onClick={() => setActiveRole("tutor")}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeRole === "tutor" ? "bg-white text-blue-600" : "text-white/90 hover:bg-white/10"
                }`}
              >
                As Tutor
              </button>
            </div>
          )}

          {/* Toggle Tabs */}
          <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab("given")}
              className={`flex items-center justify-center gap-1 flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "given" ? "bg-white text-blue-600" : "text-white/90 hover:bg-white/10"
              }`}
            >
              <FiEdit3 size={16} />
              <span className="hidden sm:inline">Given</span>
              <span className="sm:hidden">Given</span>
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`flex items-center justify-center gap-1 flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "received" ? "bg-white text-blue-600" : "text-white/90 hover:bg-white/10"
              }`}
            >
              <FiStar size={16} />
              <span className="hidden sm:inline">Received</span>
              <span className="sm:hidden">Received</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-center text-blue-600">{currentFeedback.length}</p>
                <p className="text-gray-500 text-xs text-center mt-1">Reviews {activeTab}</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-center text-yellow-500">
                  {currentFeedback.length > 0
                    ? (currentFeedback.reduce((acc, f) => acc + f.rating, 0) / currentFeedback.length).toFixed(1)
                    : "0.0"}
                </p>
                <p className="text-gray-500 text-xs text-center mt-1">Avg Rating</p>
              </div>  
            </div>

            {/* Feedback List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-8 text-gray-500 text-sm">Loading feedback...</div>
              ) : currentFeedback.length === 0 ? (
                <div className="col-span-full text-center py-12 sm:py-16 text-gray-500">
                  <BellIcon className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm sm:text-base">No {activeTab} feedback yet</p>
                </div>
              ) : (
                currentFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all space-y-2 sm:space-y-3 flex flex-col"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs sm:text-base text-gray-900 truncate">{feedback.service_title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {activeTab === "given" ? (
                            <>To: <span className="font-medium">{feedback.provider_name}</span></>
                          ) : (
                            <>From: <span className="font-medium">{feedback.user_full_name}</span></>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs sm:text-sm ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {feedback.comment && (
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">{feedback.comment}</p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        {new Date(feedback.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${
                        feedback.rating >= 4 ? 'bg-green-100 text-green-700' :
                        feedback.rating >= 3 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {feedback.rating}★
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom spacing */}
            <div className="h-2 sm:h-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}