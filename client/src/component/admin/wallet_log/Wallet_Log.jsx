import { useState } from "react";
import {
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  UsersIcon,
  WalletIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon 
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function WalletLogs() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const transactions = [
    {
      id: "#TXN-001",
      user: { name: "John Doe", email: "john@example.com" },
      type: "Top-up",
      amount: "₱500.00",
      ref: "GC-123456789",
      proof: "View",
      status: "Pending",
    },
    {
      id: "#TXN-002",
      user: { name: "Jane Smith", email: "jane@example.com" },
      type: "Cash-out",
      amount: "₱1,200.00",
      ref: "GC-987654321",
      proof: "View",
      status: "Approved",
    },
    {
      id: "#TXN-003",
      user: { name: "Mike Johnson", email: "mike@example.com" },
      type: "Top-up",
      amount: "₱300.00",
      ref: "GC-555666777",
      proof: "View",
      status: "Rejected",
    },
  ];

  const sidebarItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, path: "/admin-dashboard" },
    { name: "User Reports", icon: <UsersIcon className="w-5 h-5" />, path: "/user-reports" },
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
              Wallet Logs
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
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 items-end">
            <input
              type="text"
              placeholder="Type:"
              className="border rounded-lg px-3 py-2 w-40"
            />
            <input
              type="text"
              placeholder="Status:"
              className="border rounded-lg px-3 py-2 w-40"
            />
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="border rounded-lg px-3 py-2 w-40"
            />
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="border rounded-lg px-3 py-2 w-40"
            />
            <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              <FunnelIcon className="h-5 w-5 mr-2" /> Apply Filters
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">24</p>
              <p className="text-gray-500 text-sm">Pending</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">156</p>
              <p className="text-gray-500 text-sm">Approved</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-gray-500 text-sm">Rejected</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">₱45,320</p>
              <p className="text-gray-500 text-sm">Total Amount</p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="py-2">Transaction ID</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">GCash Ref</th>
                  <th className="py-2">Proof</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{txn.id}</td>
                    <td>
                      <p className="font-medium">{txn.user.name}</p>
                      <p className="text-gray-500 text-xs">{txn.user.email}</p>
                    </td>
                    <td>{txn.type}</td>
                    <td>{txn.amount}</td>
                    <td>{txn.ref}</td>
                    <td>
                      <button className="text-blue-600 hover:underline">
                        {txn.proof}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          txn.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : txn.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="space-x-2">
                      {txn.status === "Pending" && (
                        <>
                          <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Reject
                          </button>
                        </>
                      )}
                      {txn.status === "Approved" && (
                        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                          Mark Complete
                        </button>
                      )}
                      {txn.status === "Rejected" && (
                        <span className="text-gray-500">No Action</span>
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
              Showing 1 to 3 of 192 results
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
