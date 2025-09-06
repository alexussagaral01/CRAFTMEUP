import React from "react";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';

export default function Convo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto">
      {/* Header - Updated to match dashboard */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              className="text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="font-semibold">Sarah Chen</h1>
              <p className="text-xs text-white/80">Active 2 min ago</p>
            </div>
          </div>
          <button className="text-white">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Service Card */}
      <div className="m-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900">Crocheting for Beginners</h2>
        <p className="text-sm text-blue-600 mt-1">View service details →</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto">
        {/* Message bubbles with updated styling */}
        <div className="flex gap-3">
          <img
            src="https://via.placeholder.com/30"
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <p className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 text-sm max-w-xs">
              Hi! I'm interested in your crocheting skills service.
            </p>
            <p className="text-xs text-gray-400 mt-1 ml-2">10:30 AM</p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-xs">
            <p className="bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-sm text-sm">
              Hello! I offer beginner-friendly lessons. What would you like to learn?
            </p>
            <p className="text-xs text-gray-400 mt-1 text-right mr-2">10:32 AM</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t px-4 py-3 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-100">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm px-2"
          />
          <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all">
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
