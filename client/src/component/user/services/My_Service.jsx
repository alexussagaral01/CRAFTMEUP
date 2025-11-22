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
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
  createService,
  getUserServices,
  updateService,
  deleteService,
} from "../../../services/api";
import Toast from "../../common/Toast";

export default function MyServices() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [toast, setToast] = useState(null);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    availability: "",
    status: "Active",
  });

  const navItems = [
    { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
    { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
    { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
    { name: "My Services", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/my-services" },
    { name: "Find Services", icon: <MagnifyingGlassIcon className="h-5 w-5" />, path: "/find-services" },
    { name: "Saved", icon: <BookmarkIcon className="h-5 w-5" />, path: "/saved" },
    { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
    { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
    { name: "Feedback", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/feedback" },
    { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
  ];

  useEffect(() => {
    fetchUserServices();
  }, []);

  const fetchUserServices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await getUserServices(user.id);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setNewService({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      availability: service.availability,
      status: service.status || "Active",
    });
    setShowServiceModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        fetchUserServices();
        
        setToast({
          message: "Service deleted successfully!",
          type: "success",
          isLoading: false,
          showProgress: true,
          duration: 2000,
        });
      } catch (error) {
        setToast({
          message: "Failed to delete service",
          type: "error",
          isLoading: false,
          showProgress: false,
          duration: 2000,
        });
      }
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const serviceData = {
        userId: user.id,
        ...newService
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
        
        setToast({
          message: "Service updated successfully!",
          type: "success",
          isLoading: false,
          showProgress: true,
          duration: 2000,
        });
      } else {
        await createService(serviceData);
        
        setToast({
          message: "Service created successfully!",
          type: "success",
          isLoading: false,
          showProgress: true,
          duration: 2000,
        });
      }

      setShowServiceModal(false);
      setNewService({
        title: "",
        description: "",
        price: "",
        availability: "",
        status: "Active",
      });
      setEditingService(null);
      fetchUserServices();
    } catch (error) {
      setToast({
        message: editingService ? "Failed to update service" : "Failed to create service",
        type: "error",
        isLoading: false,
        showProgress: false,
        duration: 2000,
      });
    }
  };

  const renderServiceForm = () => (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white z-50 w-full flex flex-col">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>
            <button
              onClick={() => {
                setShowServiceModal(false);
                setEditingService(null);
                setNewService({
                  title: "",
                  description: "",
                  price: "",
                  availability: "",
                  status: "Active",
                });
              }}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full px-4 py-4 sm:py-6">
            <form onSubmit={handleCreateOrUpdate} className="space-y-4 sm:space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={newService.title}
                  onChange={(e) => setNewService(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <textarea
                  name="description"
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Price (SC)</label>
                  <input
                    type="number"
                    name="price"
                    value={newService.price}
                    onChange={(e) => setNewService(prev => ({
                      ...prev,
                      price: e.target.value
                    }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Availability</label>
                  <input
                    type="text"
                    name="availability"
                    value={newService.availability}
                    onChange={(e) => setNewService(prev => ({
                      ...prev,
                      availability: e.target.value
                    }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g., Mon-Fri"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
                    setNewService({
                      title: "",
                      description: "",
                      price: "",
                      availability: "",
                      status: "Active",
                    });
                  }}
                  className="flex-1 px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 text-sm font-medium transition-all"
                >
                  {editingService ? "Update Service" : "Create Service"}
                </button>
              </div>

              {/* Bottom spacing */}
              <div className="h-4 sm:h-6"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col lg:flex-row w-full">
      {/* Sidebar - Desktop (always visible) */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 bg-gradient-to-b from-gray-50 to-white w-64 flex-col shadow-xl border-r z-30">
        {/* Header - Fixed at top */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="font-semibold text-white text-lg">Menu</h2>
        </div>

        {/* Navigation - Scrollable */}
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
              <span className="ml-3 font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar - Mobile (toggle-based) */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-40 lg:hidden flex flex-col shadow-xl border-r`}
      >
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
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className="flex items-center w-full p-3 text-gray-600 hover:text-blue-600 rounded-xl transition-all duration-200 group hover:bg-gradient-to-r from-blue-50 to-indigo-50"
            >
              <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <span className="ml-3 font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-20 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex-shrink-0 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold truncate">My Services</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={() => navigate("/notification")} 
                className="hover:bg-white/10 p-2 rounded-lg transition-colors relative"
              >
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
              </button>
              <button
                onClick={() => setShowServiceModal(true)}
                className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-white/20 transition-all"
              >
                <PlusIcon className="h-4 w-4" /> Add Service
              </button>
              <button
                onClick={() => setShowServiceModal(true)}
                className="sm:hidden flex items-center justify-center bg-white/10 backdrop-blur-sm p-2 rounded-lg hover:bg-white/20 transition-all"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Service List */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              {services.length === 0 ? (
                <div className="col-span-full text-center py-12 sm:py-16">
                  <ClipboardDocumentListIcon className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base mb-4">No services created yet</p>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Create Your First Service
                  </button>
                </div>
              ) : (
                services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Status Badge */}
                    <span
                      className={`absolute top-3 right-3 px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${
                        service.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {service.status || "Active"}
                    </span>

                    <h2 className="font-semibold text-sm sm:text-base text-gray-900 pr-16 line-clamp-1">{service.title}</h2>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{service.description}</p>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div>
                        <p className="font-semibold text-blue-600 text-xs sm:text-sm">SC {service.price}</p>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">
                          {service.availability}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="flex-1 flex items-center justify-center gap-1 p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="flex-1 flex items-center justify-center gap-1 p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom spacing */}
            <div className="h-2 sm:h-3"></div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showServiceModal && renderServiceForm()}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          isLoading={toast.isLoading}
          showProgress={toast.showProgress}
          duration={toast.duration}
        />
      )}
    </div>
  );
}

