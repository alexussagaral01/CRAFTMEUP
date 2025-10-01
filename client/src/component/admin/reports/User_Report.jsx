import { useState } from "react";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  UsersIcon,
  WalletIcon,
  MegaphoneIcon,
  ShieldExclamationIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon, // Add this import
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function UserReports() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const reports = [
    {
      id: 1,
      reportedUser: { name: "John Smith", role: "@johnsmith" },
      reporter: { name: "Sarah Wilson", role: "Premium User" },
      category: "Harassment",
      date: "Jan 15, 2025",
      status: "Pending",
    },
    {
      id: 2,
      reportedUser: { name: "Mike Johnson", role: "@mike" },
      reporter: { name: "Lisa Chen", role: "Standard User" },
      category: "Spam",
      date: "Jan 14, 2025",
      status: "Resolved",
    },
    {
      id: 3,
      reportedUser: { name: "Alex Turner", role: "@alexturner" },
      reporter: { name: "Emma Davis", role: "Moderator" },
      category: "Inappropriate Content",
      date: "Jan 15, 2025",
      status: "Pending",
    },
  ];

  const sidebarItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, path: "/admin-dashboard" },
    { name: "User Reports", icon: <UsersIcon className="w-5 h-5" />, path: "/user-reports" },
    { name: "Account Verification", icon: <CheckCircleIcon className="w-5 h-5" />, path: "/account-verification" },
    { name: "Wallet Logs", icon: <WalletIcon className="w-5 h-5" />, path: "/wallet-logs" },
    { name: "Post Announcement", icon: <MegaphoneIcon className="w-5 h-5" />, path: "/announcements" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
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
              User Reports
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
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">247</p>
              <p className="text-gray-500 text-sm">Total Reports</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">18</p>
              <p className="text-gray-500 text-sm">Pending</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">229</p>
              <p className="text-gray-500 text-sm">Resolved</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-gray-500 text-sm">This Week</p>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="flex justify-between items-center mb-4">
            <button className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              <FunnelIcon className="h-5 w-5 mr-2" /> Filter Reports
            </button>
            <div className="relative w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="pl-10 pr-3 py-2 w-full border rounded-lg focus:ring focus:ring-gray-300"
              />
            </div>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="py-2">Reported User</th>
                  <th className="py-2">Reporter</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <p className="font-medium">{report.reportedUser.name}</p>
                      <p className="text-gray-500 text-xs">
                        {report.reportedUser.role}
                      </p>
                    </td>
                    <td>
                      <p className="font-medium">{report.reporter.name}</p>
                      <p className="text-gray-500 text-xs">
                        {report.reporter.role}
                      </p>
                    </td>
                    <td>{report.category}</td>
                    <td>{report.date}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="space-x-2">
                      <button className="text-blue-600 hover:underline">
                        View Report
                      </button>
                      {report.status === "Pending" ? (
                        <>
                          <button className="text-red-600 hover:underline">
                            Suspend User
                          </button>
                          <button className="text-green-600 hover:underline">
                            Mark Resolved
                          </button>
                        </>
                      ) : (
                        <button className="text-gray-600 hover:underline">
                          User Warned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing 1 to 3 of 18 results
            </p>
            <div className="flex space-x-2">
              <button className="p-2 border rounded-lg hover:bg-gray-200">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button className="px-3 py-1 border rounded-lg bg-black text-white">
                1
              </button>
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-200">
                2
              </button>
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-200">
                3
              </button>
              <button className="p-2 border rounded-lg hover:bg-gray-200">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}