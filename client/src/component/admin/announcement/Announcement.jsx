import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  WalletIcon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

export default function Announcements() {
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, path: "/admin-dashboard" },
    { name: "User Reports", icon: <UsersIcon className="w-5 h-5" />, path: "/user-reports" },
    { name: "Wallet Logs", icon: <WalletIcon className="w-5 h-5" />, path: "/wallet-logs" },
    { name: "Post Announcement", icon: <MegaphoneIcon className="w-5 h-5" />, path: "/announcements" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
  ];

  const announcements = [
    {
      title: "Service Policy Update",
      date: "Jan 15, 2025",
      audience: "All Users",
      status: "Active",
    },
    {
      title: "Maintenance Notice",
      date: "Jan 8, 2025",
      audience: "Providers",
      status: "Expires Soon",
    },
    {
      title: "Holiday Schedule",
      date: "Dec 20, 2024",
      audience: "All Users",
      status: "Expired",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl z-20">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-100 text-sm mt-1">System Management</p>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Post Announcement
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                AS
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Create New Announcement</h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Announcement Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Service Notification Policy Update"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    rows="5"
                    placeholder="Enter announcement content, guidelines, news, reminders, policies, or updates..."
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  ></textarea>
                  <div className="flex justify-end text-xs text-gray-400 mt-1">
                    0/1000 characters
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <p className="text-sm font-medium mb-1">Target Audience</p>
                  <div className="space-y-1 text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="audience" defaultChecked />
                      <span>All Users</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="audience" />
                      <span>Providers Only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="audience" />
                      <span>Requesters Only</span>
                    </label>
                  </div>
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty for permanent announcement
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                    Publish Announcement
                  </button>
                  <button className="border px-4 py-2 rounded-md text-sm">
                    Preview
                  </button>
                  <button className="border px-4 py-2 rounded-md text-sm">
                    Save Draft
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Announcements</h2>
                <button className="text-sm text-blue-600">View All</button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    className="w-full border rounded-md pl-8 pr-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {announcements.map((a, idx) => (
                  <div key={idx} className="border-b pb-2">
                    <h3 className="text-sm font-medium">{a.title}</h3>
                    <p className="text-xs text-gray-500">
                      {a.date} • {a.audience}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        a.status === "Active"
                          ? "text-green-600"
                          : a.status === "Expires Soon"
                          ? "text-yellow-600"
                          : "text-gray-400"
                      }`}
                    >
                      {a.status}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm mt-6">
                <div>
                  <p className="font-semibold">12</p>
                  <p className="text-gray-500">Active</p>
                </div>
                <div>
                  <p className="font-semibold">8</p>
                  <p className="text-gray-500">Archived</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
