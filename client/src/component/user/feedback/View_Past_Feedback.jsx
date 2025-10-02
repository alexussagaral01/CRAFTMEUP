import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  StarIcon,
} from "@heroicons/react/24/outline";
import { getUserFeedback } from '../../../services/api';

export default function ViewPastFeedback() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacksAsLearner, setFeedbacksAsLearner] = useState([]);
  const [feedbacksAsTutor, setFeedbacksAsTutor] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all'); // 'all', 'learner', or 'tutor'
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role?.toLowerCase() || '');
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Current user:', user); 
      
      const response = await getUserFeedback(user.id);
      console.log('Feedback response:', response.data); 
      
      // Separate feedbacks based on role
      const learnerFeedbacks = response.data.filter(fb => fb.role_type === 'learner');
      const tutorFeedbacks = response.data.filter(fb => fb.role_type === 'tutor');
      
      console.log('Learner feedbacks:', learnerFeedbacks); 
      console.log('Tutor feedbacks:', tutorFeedbacks); 
      
      setFeedbacksAsLearner(learnerFeedbacks);
      setFeedbacksAsTutor(tutorFeedbacks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setLoading(false);
    }
  };

  const renderFeedbackSection = (title, feedbacks, emptyMessage) => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {feedbacks && feedbacks.length > 0 ? (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{feedback.service_title}</h3>
                  <p className="text-sm text-gray-500">
                    {feedback.role_type === 'tutor' 
                      ? `From: ${feedback.learner_name}` 
                      : `To: ${feedback.provider_name}`}
                  </p>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 font-medium">{feedback.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{feedback.comment}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(feedback.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  const navItems = [
    { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
    { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
    { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
    { name: "My Services", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/my-services" },
    { name: "Find Services", icon: <MagnifyingGlassIcon className="h-5 w-5" />, path: "/find-services" },
    { name: "Saved", icon: <BookmarkIcon className="h-5 w-5" />, path: "/saved" },
    { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
    { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
    { name: "View Past Feedback", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/view-past-feedback" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
  ];

  // Update the role filter buttons based on user role
  const getRoleButtons = () => {
    if (userRole === 'both') {
      return (
        <div className="flex space-x-2 p-4">
          <button
            onClick={() => setSelectedRole('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedRole === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Feedback
          </button>
          <button
            onClick={() => setSelectedRole('learner')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedRole === 'learner'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            As Learner
          </button>
          <button
            onClick={() => setSelectedRole('tutor')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedRole === 'tutor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            As Tutor
          </button>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <p>Loading feedbacks...</p>
        </div>
      );
    }

    if (userRole === 'learner') {
      return renderFeedbackSection(
        "Feedback Given (As Learner)",
        feedbacksAsLearner,
        "No feedback given yet"
      );
    }

    if (userRole === 'tutor') {
      return renderFeedbackSection(
        "Feedback Received (As Tutor)",
        feedbacksAsTutor,
        "No feedback received yet"
      );
    }

    if (userRole === 'both') {
      if (selectedRole === 'all') {
        return (
          <>
            {renderFeedbackSection(
              "Feedback Given (As Learner)",
              feedbacksAsLearner,
              "No feedback given as a learner"
            )}
            {renderFeedbackSection(
              "Feedback Received (As Tutor)",
              feedbacksAsTutor,
              "No feedback received as a tutor"
            )}
          </>
        );
      }
      if (selectedRole === 'learner') {
        return renderFeedbackSection(
          "Feedback Given (As Learner)",
          feedbacksAsLearner,
          "No feedback given as a learner"
        );
      }
      return renderFeedbackSection(
        "Feedback Received (As Tutor)",
        feedbacksAsTutor,
        "No feedback received as a tutor"
      );
    }

    return (
      <div className="text-center py-8">
        <p>No feedback available</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-lg font-semibold">Past Feedback</h1>
          </div>
          <button onClick={() => navigate('/notification')} className="relative">
            <BellIcon className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Role Filter Tabs - Only show for users with both roles */}
      {getRoleButtons()}

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
