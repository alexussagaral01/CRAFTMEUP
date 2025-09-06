import React, { useState } from "react";
import { FiArrowLeft, FiEdit3, FiStar } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export default function View_Past_Feedback() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("given");
  const feedbacks = [
    {
      service: "Origami Basics & Decorative Folding",
      date: "Jan 15, 2025",
      rating: 5,
      text: "Excellent Origami! The teaching was professional and thorough. Highly recommend!",
    },
    {
      service: "Crocheting for Beginners",
      date: "Jan 10, 2025",
      rating: 4,
      text: "Good at teaching beginners. Arrived on time and completed the tutor efficiently.",
    },
    {
      service: "Hand Embroidery Essentials",
      date: "Jan 5, 2025",
      rating: 5,
      text: "Outstanding work! Very knowledgeable Embroidery who explained everything clearly.",
    },
    {
      service: "DIY Scrapbooking Techniques",
      date: "Dec 28, 2024",
      rating: 3,
      text: "Techniques was okay but took longer than expected.",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto">
      {/* Header - Updated to match dashboard */}
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

      {/* Filters */}
      <div className="p-4 bg-white border-b">
        <div className="flex justify-between gap-2">
          <select className="w-1/2 border rounded-xl px-3 py-2 text-sm bg-gray-50">
            <option>All Services</option>
          </select>
          <select className="w-1/2 border rounded-xl px-3 py-2 text-sm bg-gray-50">
            <option>All Ratings</option>
          </select>
        </div>
      </div>

      {/* Feedback List with updated styling */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {feedbacks.map((feedback, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{feedback.service}</span>
              <span className="text-xs text-gray-500">{feedback.date}</span>
            </div>
            <div className="flex items-center mb-2">
              {renderStars(feedback.rating)}
            </div>
            <p className="text-gray-700 text-sm">
              {feedback.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}