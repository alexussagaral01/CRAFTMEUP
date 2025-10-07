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
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from "react-icons/fi";
import { getUserBookings, updateTransactionStatus, getWalletBalance, transferFunds } from '../../../services/api';

function ConfirmPayment({ booking, userWallet, onConfirm, onClose }) {
  const remainingBalance = userWallet - booking.price;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[85%] max-w-sm m-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Confirm Payment</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{booking.service_title}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">{booking.provider_name}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">{booking.price} SkillCoins</span>
          </div>

          <hr />

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Your Balance:</span>
            <span className="font-medium">{userWallet} SkillCoins</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining:</span>
            <span className={`font-medium ${remainingBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {remainingBalance} SkillCoins
            </span>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
            <FiAlertTriangle className="text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-700">
              Note: This action is final and cannot be reversed.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button 
              onClick={onConfirm}
              disabled={remainingBalance < 0}
              className={`w-full ${
                remainingBalance < 0 
                  ? 'bg-gray-300' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              } text-white py-2.5 rounded-xl text-sm font-medium transition-all`}
            >
              {remainingBalance < 0 ? 'Insufficient Balance' : 'Confirm Payment'}
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
  const [pendingBookings, setPendingBookings] = useState([]);
  const [ongoingBookings, setOngoingBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userWallet, setUserWallet] = useState(0);

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
    fetchUserBookings();
    fetchWalletBalance();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await getUserBookings(user.id);

      const ongoing = [];
      const pending = [];
      const completed = [];

      response.data.forEach(booking => {
        switch(booking.status) {
          case 'ongoing':
          case 'ready':
            ongoing.push(booking);
            break;
          case 'pending':
            pending.push(booking);
            break;
          case 'completed':
            completed.push(booking);
            break;
        }
      });

      setOngoingBookings(ongoing);
      setPendingBookings(pending);
      setCompletedBookings(completed);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await getWalletBalance(user.id);
      setUserWallet(response.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const handleMarkReady = async (bookingId) => {
    try {
      await updateTransactionStatus(bookingId, 'ready');
      await fetchUserBookings();
      alert('Service marked as ready for completion');
    } catch (error) {
      console.error('Error marking service as ready:', error);
      alert('Failed to update service status');
    }
  };

  const handleConfirmCompletion = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmModal(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Determine the correct IDs
      let fromUserId, toUserId;
      
      if (selectedBooking.is_provider) {
        alert('Error: Providers cannot confirm payment');
        return;
      } else {
        fromUserId = user.id;
        toUserId = selectedBooking.provider_id || selectedBooking.user_id;
      }

      const paymentData = {
        fromUserId: parseInt(fromUserId),
        toUserId: parseInt(toUserId),
        amount: parseFloat(selectedBooking.price),
        bookingId: parseInt(selectedBooking.id)
      };

      console.log('Payment data being sent:', paymentData);
      console.log('Booking details:', {
        id: selectedBooking.id,
        is_provider: selectedBooking.is_provider,
        user_id: selectedBooking.user_id,
        provider_id: selectedBooking.provider_id,
        provider_name: selectedBooking.provider_name
      });

      await transferFunds(paymentData);
      
      await fetchWalletBalance();
      await fetchUserBookings();
      
      setShowConfirmModal(false);
      
      navigate('/view-past-feedback', {  // Updated path
        state: { 
          booking: selectedBooking 
        }
      });
    } catch (error) {
      console.error('Payment error details:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Failed to process payment. Please try again.';
      alert(errorMessage);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await updateTransactionStatus(bookingId, 'ongoing');
      await fetchUserBookings();
      alert('Booking accepted successfully');
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await updateTransactionStatus(bookingId, 'rejected');
      await fetchUserBookings();
      alert('Booking rejected');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      ongoing: 'bg-blue-100 text-blue-700',
      ready: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const renderBooking = (booking) => (
    <div key={booking.id} className="border rounded-lg p-4 shadow-sm bg-white mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{booking.service_title}</h3>
          <p className="text-sm text-gray-600">
            {booking.is_provider ? `Requested by: ${booking.requester_name}` : `Provider: ${booking.provider_name}`}
          </p>
        </div>
        {booking.price && parseFloat(booking.price) > 0 && (
          <p className="font-semibold">SC {booking.price}</p>
        )}
      </div>

      <p className="text-gray-500 text-sm mb-3">{booking.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`flex items-center text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
            <span className={`w-2 h-2 mr-1 rounded-full ${
              booking.status === 'pending'
                ? 'bg-yellow-500'
                : booking.status === 'ongoing'
                ? 'bg-blue-500'
                : booking.status === 'ready'
                ? 'bg-purple-500'
                : booking.status === 'completed'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}></span>
            {booking.status}
          </span>
          <p className="text-gray-400 text-xs">
            {new Date(booking.created_at).toLocaleDateString('en-US', {
              month: 'numeric',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {( (booking.is_provider && (booking.status === 'ongoing' || booking.status === 'ready')) 
          || (!booking.is_provider && booking.status === 'ready') ) && (
          <div className="flex space-x-2">
            {booking.is_provider && booking.status === 'ongoing' && (
              <button
                onClick={() => handleMarkReady(booking.id)}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Mark Ready
              </button>
            )}

            {booking.is_provider && booking.status === 'ready' && (
              <div className="px-3 py-1 text-gray-500 text-sm">
                Waiting for completion
              </div>
            )}

            {!booking.is_provider && booking.status === 'ready' && (
              <button
                onClick={() => handleConfirmCompletion(booking)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm Completion
              </button>
            )}
          </div>
        )}

        {booking.is_provider && booking.status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleAcceptBooking(booking.id)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Accept
            </button>
            <button
              onClick={() => handleRejectBooking(booking.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-gray-600 text-sm font-medium mb-2">Current Transactions</h2>
        {ongoingBookings.length > 0 ? ongoingBookings.map(renderBooking) : (
          <div className="flex items-center justify-center min-h-[300px] w-full bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-center max-w-sm mx-auto px-4">
              <div className="flex justify-center mb-4">
                <ReceiptRefundIcon className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-gray-600 font-medium text-lg mb-2">
                No ongoing transactions
              </h3>
              <p className="text-gray-400">
                Your active transactions will appear here
              </p>
            </div>
          </div>
        )}
      </div>

      {pendingBookings.length > 0 && (
        <div className="mb-6">
          <h2 className="text-gray-600 text-sm font-medium mb-2">Pending Transactions</h2>
          {pendingBookings.map(renderBooking)}
        </div>
      )}

      {completedBookings.length > 0 && (
        <div>
          <h2 className="text-gray-600 text-sm font-medium mb-2">Past Transactions</h2>
          {completedBookings.map(renderBooking)}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full">
      {/* Sidebar with fixed height and scrolling */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30
        flex flex-col h-full`}>
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
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-1">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <div className="w-full px-2">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <Bars3Icon className="h-6 w-6 text-white" />
                </button>
                <h1 className="text-lg font-semibold ml-3">Transactions</h1>
              </div>
              <button 
                onClick={() => navigate('/notification')} 
                className="relative p-2"
              >
                <BellIcon className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Content */}
        <div className="w-full px-4 py-4">
          <div className="max-w-5xl mx-auto"> {/* Added max-width and margin auto */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Current Transactions */}
              <div className="lg:col-span-2">
                <h2 className="text-gray-600 text-sm font-medium mb-2">Current Transactions</h2>
                <div className="space-y-4">
                  {ongoingBookings.length > 0 ? (
                    ongoingBookings.map(renderBooking)
                  ) : (
                    <div className="flex items-center justify-center min-h-[300px] w-full bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="text-center max-w-sm mx-auto px-4">
                        <div className="flex justify-center mb-4">
                          <ReceiptRefundIcon className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-gray-600 font-medium text-lg mb-2">
                          No ongoing transactions
                        </h3>
                        <p className="text-gray-400">
                          Your active transactions will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pending & Past Transactions */}
              <div className="space-y-6">
                {pendingBookings.length > 0 && (
                  <div>
                    <h2 className="text-gray-600 text-sm font-medium mb-2">Pending Transactions</h2>
                    <div className="space-y-4">
                      {pendingBookings.map(renderBooking)}
                    </div>
                  </div>
                )}

                {completedBookings.length > 0 && (
                  <div>
                    <h2 className="text-gray-600 text-sm font-medium mb-2">Past Transactions</h2>
                    <div className="space-y-4">
                      {completedBookings.map(renderBooking)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Payment Confirmation Modal */}
      {showConfirmModal && selectedBooking && (
        <ConfirmPayment
          booking={selectedBooking}
          userWallet={userWallet}
          onConfirm={handlePaymentConfirm}
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}