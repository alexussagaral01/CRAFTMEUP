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
  PlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { submitFeedback } from '../../../services/api';

function ReportUser({ booking, onClose }) {
  const [reportReason, setReportReason] = useState('');

  const handleSubmitReport = async () => {
    // Add your report submission logic here
    console.log('Reporting user:', booking.provider_name, 'Reason:', reportReason);
    // You can add API call to submit report
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-[85%] max-w-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Report User</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-xl">
            <img
              src="https://via.placeholder.com/40"
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="font-medium text-sm">{booking?.provider_name || 'Unknown'}</h3>
              <p className="text-xs text-gray-500">{booking?.service_title || 'Service'}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Reason for Report<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please describe the issue..."
              className="w-full border border-gray-200 rounded-xl p-2 text-sm focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500"
              rows="3"
            ></textarea>
          </div>

          <div className="border border-dashed border-gray-200 rounded-xl p-3 text-center hover:bg-gray-50 transition-colors cursor-pointer">
            <PlusIcon className="h-5 w-5 mx-auto mb-1 text-gray-400" />
            <p className="text-xs text-gray-600">Add screenshots (optional)</p>
            <p className="text-[10px] text-gray-400">Max 5MB per file</p>
          </div>

          <div className="space-y-2 pt-2">
            <button 
              onClick={handleSubmitReport}
              disabled={!reportReason.trim()}
              className={`w-full ${
                reportReason.trim() 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                  : 'bg-gray-300'
              } text-white py-2.5 rounded-xl text-sm font-medium transition-all`}
            >
              Submit Report
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

export default function Feedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!booking) {
      navigate('/transactions');
    }
  }, [booking, navigate]);

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      await submitFeedback({
        serviceId: booking.service_id,
        userId: user.id,
        rating: rating,
        comment: comment.trim()
      });

      alert('Feedback submitted successfully!');
      navigate('/transactions');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate('/transactions');
  };

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-lg font-semibold">Rate & Review</h1>
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
        {/* Service Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src="https://via.placeholder.com/40"
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold">{booking.provider_name}</h2>
              <p className="text-sm text-gray-500">{booking.service_title}</p>
              <p className="text-xs text-gray-400">
                Completed on {new Date(booking.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-3">How was your experience?</p>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <StarIcon
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-gray-500 text-sm">{rating} out of 5 stars</p>
            )}
          </div>
        </div>

        {/* Comment Box */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share your experience
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience with this service..."
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            rows="4"
            maxLength={1500}
          ></textarea>
          <p className="text-right text-xs text-gray-400 mt-1">
            {comment.length}/1500 characters
          </p>
        </div>

        {/* Report Button */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">Had an issue with this service?</p>
          <button 
            className="bg-red-500 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => setShowReportModal(true)}
          >
            Report
          </button>
        </div>

        {/* Submit Buttons */}
        <div className="space-y-2 mb-6">
          <button 
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || rating === 0}
            className={`w-full ${
              isSubmitting || rating === 0
                ? 'bg-gray-300'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            } text-white py-3 rounded-xl font-medium transition-all`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button 
            onClick={() => navigate('/view-past-feedback')}
            disabled={isSubmitting}
            className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all"
          >
            View Past Feedback
          </button>
          <button 
            onClick={handleSkip}
            disabled={isSubmitting}
            className="w-full border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            Skip for Now
          </button>
        </div>

        {/* Helpful Tips */}
        <div className="border border-blue-100 rounded-xl p-4 bg-blue-50">
          <h3 className="font-medium text-sm mb-2 text-blue-900">💡 Helpful Tips</h3>
          <p className="text-xs text-blue-700">
            Your feedback helps improve our community. Be honest and constructive
            in your review to help others make informed decisions.
          </p>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportUser 
          booking={booking}
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
}