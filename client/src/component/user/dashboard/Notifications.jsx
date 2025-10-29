import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeftIcon,
  CreditCardIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../../services/api';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserData(storedUser);
  }, []);

  // Add to all components
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
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await getNotifications(user.id);
    
    setNotifications(response);
    // Calculate unread count
    const unreadNotifications = response.filter(n => !n.read);
    setUnreadCount(unreadNotifications.length);
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

  const handleMarkAsRead = async (notificationId) => {
  try {
    await markNotificationAsRead(notificationId);
    
    // Update the notifications state
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    
    // Decrement unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
    
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

  const handleMarkAllAsRead = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      console.error('User not found');
      return;
    }

    await markAllNotificationsAsRead(user.id);
    
    // Update all notifications to read
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    
    // Reset unread count to 0
    setUnreadCount(0);
    
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

  const getNotificationTypeStyle = (type) => {
    switch (type) {
      case 'tutor_request':
        return 'bg-purple-100';
      case 'request_accepted':
        return 'bg-green-100';
      case 'payment_confirmed':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'tutor_request':
        return <UserIcon className="h-5 w-5 text-purple-600" />;
      case 'request_accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'payment_confirmed':
        return <CreditCardIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto">
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
            <button className="text-white" onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
          <div className="relative">
            <BellIcon className="h-6 w-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {unreadCount > 0 && (
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 font-medium px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transform transition hover:scale-[1.02] ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getNotificationTypeStyle(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t">
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 text-sm font-medium hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}