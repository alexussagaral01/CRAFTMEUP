import { useState } from "react";
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

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

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
      content:
        "Don't forget about the team meeting scheduled for tomorrow at 10 AM.",
      time: "3h ago",
      action: "View Message",
    },
    {
      id: 5,
      type: "update",
      title: "Feature Update",
      content:
        "New dashboard features are now available. Check out the updated interface.",
      time: "1d ago",
      action: "View Details",
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto">
      {/* Header - Updated to match dashboard */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              className="text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
          <div className="relative">
            <BellIcon className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2 bg-white">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 px-4 py-6">
        <div className="flex justify-end mb-4">
          <button className="text-sm text-blue-600 font-medium px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transform transition hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    n.type === "message"
                      ? "bg-blue-100"
                      : n.type === "payment"
                      ? "bg-green-100"
                      : n.type === "system"
                      ? "bg-purple-100"
                      : n.type === "reminder"
                      ? "bg-yellow-100"
                      : "bg-gray-100"
                  }`}
                >
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{n.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{n.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                      {n.action}
                    </button>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
