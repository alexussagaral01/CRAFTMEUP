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
  StarIcon,
  PlusIcon,
  VideoCameraIcon,
  Bars3Icon,
  XMarkIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';//
import { getAnnouncements, getUserServices } from '../../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();//
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          // Fetch fresh user data from API
          const response = await api.get(`/auth/user/${storedUser.id}`);
          const freshUserData = response.data;
          
          // Update both state and localStorage
          setUserData(freshUserData);
          localStorage.setItem('user', JSON.stringify(freshUserData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to stored data if API fails
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUserData(storedUser);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData?.id) {
      fetchAnnouncements();
      fetchUserServices(userData.id);
    }
  }, [userData]);

  const fetchAnnouncements = async () => {
    try {
      const response = await getAnnouncements();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchUserServices = async (userId) => {
    try {
      const response = await getUserServices(userId);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const canSeeAnnouncement = (announcement) => {
    const userRole = userData?.role?.toLowerCase() || '';
    const target = announcement.target_audience?.toLowerCase() || '';

    if (target === 'all users') return true;
    if (target === 'tutors only' && userRole === 'tutor') return true;
    if (target === 'learners only' && userRole === 'learner') return true;
    return false;
  };

  const role = userData?.role?.toLowerCase() || '';

  const navItems = (() => {
    if (role === 'learner') {
      // Learners: can see Find Services and Saved, cannot see My Services or add services
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
      // Tutors: can see My Services and manage/add them, cannot see Find Services or Saved
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

    // role === 'both' or unknown: show all features (both learner + tutor capabilities)
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

  const renderAnnouncements = () => (
    <>
      {/* Feature Announcement - Static */}
     

      {/* Dynamic Announcements */}
      <div className="p-4 mx-4">
      <h2 className="font-semibold mb-4">Announcements</h2>
      {/* Scrollable container */}
      <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
        {announcements
          .filter(announcement => canSeeAnnouncement(announcement))
          .map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="font-medium">{announcement.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{announcement.content}</p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span>Target: {announcement.target_audience}</span>
                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
    </>
  );

  const renderServices = () => {
    if (userData?.role?.toLowerCase() === 'learner') {
    return null; // Don't render services section for learners
    }
  return (
    <div className="p-4 m-4">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-lg">My Services</span>
        <button 
          onClick={() => navigate('/my-services')} 
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-1" /> Add New
        </button>
      </div>
      
      {/* Scrollable container */}
      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 transform transition hover:scale-[1.02]"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{service.title}</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    service.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {service.status || "Active"}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {service.description}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    {service.availability}
                  </span>
                </div>
                <span className="font-bold text-blue-600">SC {service.price}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No services found</p>
            <button
              onClick={() => navigate("/my-services")}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Create your first service
            </button>
          </div>
        )}
      </div>
    </div>
  );
  };


  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col w-full md:max-w-sm mx-auto relative">
      {/* Sidebar - Updated with scrolling support */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
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

      {/* Main Content */}
      <div className="overflow-y-auto flex-1">
        {/* Welcome Section - Updated */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsSidebarOpen(true)}>
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
              <div>
                <div className="text-lg font-semibold">
                  Welcome back, {userData?.full_name || userData?.fullName || 'User'}
                </div>
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full mt-1 inline-block backdrop-blur-sm">
                  {userData?.role || 'User'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/notification')} 
              className="relative"
            >
              <BellIcon className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">{services.filter(s => s.status === "active").length}</div>
              <div className="text-sm text-white/80">Active Services</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold"></div>
                SC {services.reduce((sum, s) => sum + (s.monthlyEarnings || 0), 0)}
                <div className="mt-2 text-sm text-white/80">This Month</div>
              </div>
            </div>
          </div>
          {renderAnnouncements()}

          {/* My Services */}
        {renderServices()}

        {/* Recent Activity */}
        

       
      </div>
    </div>
  );
}
