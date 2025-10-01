import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiEdit3, FiStar } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { getUserFeedback } from '../../../services/api';

export default function ViewPastFeedback() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("given");
  const [givenFeedback, setGivenFeedback] = useState([]);
  const [receivedFeedback, setReceivedFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await getUserFeedback(user.id);
      
      // Separate feedback given by user and received by user
      const given = response.data.filter(f => f.reviewer_id === user.id);
      const received = response.data.filter(f => f.service_provider_id === user.id);
      
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center space-x-3">
          <button 
            className="text-white"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Feedback & Ratings</h1>
        </div>

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
                ? "You haven't given any feedback yet" 
                : "You haven't received any feedback yet"}
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
                    <p className="text-sm text-gray-500">Provider: {feedback.provider_name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Reviewer: {feedback.reviewer_name}</p>
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