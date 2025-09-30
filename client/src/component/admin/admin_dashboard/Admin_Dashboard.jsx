import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  WalletIcon,
  MegaphoneIcon,
  BellIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MagnifyingGlassIcon, // Changed from SearchIcon
  ArrowRightOnRectangleIcon,
  CheckCircleIcon // Import CheckCircleIcon
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("User Reports");

  const sidebarItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, path: "/admin-dashboard" },
    { name: "User Reports", icon: <UsersIcon className="w-5 h-5" />, path: "/user-reports" },
    { name: "Account Verification", icon: <CheckCircleIcon className="w-5 h-5" />, path: "/account-verification" },
    { name: "Wallet Logs", icon: <WalletIcon className="w-5 h-5" />, path: "/wallet-logs" },
    { name: "Post Announcement", icon: <MegaphoneIcon className="w-5 h-5" />, path: "/announcements" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
  ];

  const stats = [
    { title: "New Reports Today", value: 12, icon: <BellIcon className="w-5 h-5" /> },
    { title: "Active Users Online", value: "2,847", icon: <UsersIcon className="w-5 h-5" /> },
    { title: "Wallet Requests Pending", value: 34, icon: <ClockIcon className="w-5 h-5" /> },
    { title: "Flagged Messages", value: 8, icon: <ExclamationTriangleIcon className="w-5 h-5" /> },
    { title: "Services Listed This Week", value: 156, icon: <CalendarIcon className="w-5 h-5" /> },
  ];

  const tabs = ["User Reports", "Dispute Center", "Wallet Logs"];

  const reports = [
    {
      id: "#USR-001",
      name: "John Smith",
      type: "Inappropriate Content",
      submittedBy: "Maria Garcia",
      date: "Jan 15, 2025",
      status: "Pending",
    },
    {
      id: "#USR-002",
      name: "Alex Johnson",
      type: "Scam/Fraud",
      submittedBy: "Sarah Wilson",
      date: "Jan 14, 2025",
      status: "Resolved",
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
              Dashboard Overview
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" /> {/* Changed from SearchIcon */}
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                AS
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto h-[calc(100vh-5rem)]">
          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    index === 0 ? 'bg-blue-100' :
                    index === 1 ? 'bg-green-100' :
                    index === 2 ? 'bg-purple-100' :
                    index === 3 ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    index === 0 ? 'text-blue-600' :
                    index === 1 ? 'text-green-600' :
                    index === 2 ? 'text-purple-600' :
                    index === 3 ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    +{Math.floor(Math.random() * 30)}%
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex space-x-1 p-4 bg-gray-50 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table Content */}
            {activeTab === "User Reports" && (
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-4 py-3 bg-gray-50 rounded-l-lg">ID</th>
                      <th className="px-4 py-3 bg-gray-50">Name</th>
                      <th className="px-4 py-3 bg-gray-50">Type</th>
                      <th className="px-4 py-3 bg-gray-50">Submitted By</th>
                      <th className="px-4 py-3 bg-gray-50">Date</th>
                      <th className="px-4 py-3 bg-gray-50">Status</th>
                      <th className="px-4 py-3 bg-gray-50 rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {reports.map((r) => (
                      <tr key={r.id} className="border-b">
                        <td className="py-2">{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.type}</td>
                        <td>{r.submittedBy}</td>
                        <td>{r.date}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              r.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="space-x-2">
                          <button className="text-sm text-blue-600">View</button>
                          <button className="text-sm text-red-600">Suspend</button>
                          <button className="text-sm text-green-600">Resolve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
