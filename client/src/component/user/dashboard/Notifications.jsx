import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  EnvelopeIcon,
  CreditCardIcon,
  InformationCircleIcon,
  CalendarIcon,
  StarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { getUserBookings, updateTransactionStatus } from '../../../services/api';

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [pendingBookings, setPendingBookings] = useState([]);

  const tabs = ["All", "Unread", "Messages", "Transactions"];

  const notifications = [
    {
      id: 1,
      type: "message",
      title: "New Message",
      content: "Sarah Johnson sent you a message about the project timeline.",
      time: "2m ago",
      action: "View Message",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      content: "SG 150 payment received from Client ABC for Invoice #1234.",
      time: "15m ago",
      action: "View Transaction",
    },
    {
      id: 3,
      type: "system",
      title: "System Announcement",
      content: "Scheduled maintenance will occur tonight from 11 PM to 2 AM EST.",
      time: "1h ago",
      action: "View Details",
    },
    {
      id: 4,
      type: "reminder",
      title: "Team Meeting Reminder",
      content: "Don't forget about the team meeting scheduled for tomorrow at 10 AM.",
      time: "3h ago",
      action: "View Message",
    },
    {
      id: 5,
      type: "update",
      title: "Feature Update",
      content: "New dashboard features are now available. Check out the updated interface.",
      time: "1d ago",
      action: "View Details",
    },
  ];

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await getUserBookings(user.id);
      const pending = response.data.filter(booking => booking.status === 'pending');
      setPendingBookings(pending);
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await updateTransactionStatus(bookingId, 'ongoing');
      if (response.data) {
        setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
        alert('Booking accepted successfully!');
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await updateTransactionStatus(bookingId, 'rejected');
      setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
      alert('Booking rejected');
    } catch (error) {
      console.error(error);
      alert('Failed to reject booking');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <EnvelopeIcon className="w-5 h-5 text-gray-600" />;
      case "payment":
        return <CreditCardIcon className="w-5 h-5 text-green-600" />;
      case "system":
        return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
      case "reminder":
        return <CalendarIcon className="w-5 h-5 text-purple-600" />;
      case "update":
        return <StarIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return <BellIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full">
      {/* Header - Updated for full width */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="w-full px-2">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button className="hover:bg-white/10 p-2 rounded-lg" onClick={() => navigate(-1)}>
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold ml-3">Notifications</h1>
            </div>
            <div className="relative p-2">
              <BellIcon className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {pendingBookings.length}
              </span>
            </div>
          </div>

          {/* Tabs - Updated styling */}
          <div className="px-2 pb-4">
            <div className="flex space-x-1 bg-white/10 backdrop-blur-sm p-1 rounded-xl">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content - Updated for responsive layout */}
      <div className="w-full px-2 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Mark all as read button */}
          <div className="flex justify-end mb-4">
            <button className="text-sm text-blue-600 font-medium px-4 py-2 hover:bg-blue-50 rounded-lg">
              Mark all as read
            </button>
          </div>

          {/* Notifications Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Regular Notifications */}
            <div className="space-y-4">
              {notifications.map(n => (
                <div key={n.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transform transition hover:scale-[1.02]">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      n.type === "message"
                        ? "bg-blue-100"
                        : n.type === "payment"
                        ? "bg-green-100"
                        : n.type === "system"
                        ? "bg-purple-100"
                        : n.type === "reminder"
                        ? "bg-yellow-100"
                        : "bg-gray-100"
                    }`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{n.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{n.content}</p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t">
                        <button className="text-blue-600 text-sm font-medium hover:underline">{n.action}</button>
                        <span className="text-xs text-gray-400">{n.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Bookings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Booking Requests</h2>
              {pendingBookings.length > 0 ? (
                pendingBookings.map(b => (
                  <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{b.title}</h3>
                        <p className="text-sm text-gray-500">New booking request</p>
                      </div>
                      <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">Pending</span>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleRejectBooking(b.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAcceptBooking(b.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No pending bookings</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
