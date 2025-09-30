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

export default function MyServices() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    availability: "",
    status: "Active",
  });
  const [editingService, setEditingService] = useState(null);

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
        alert("Service deleted successfully");
      } catch (error) {
        alert("Failed to delete service");
      }
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const serviceData = {
        userId: user.id,
        title: newService.title,
        description: newService.description,
        price: parseFloat(newService.price),
        availability: newService.availability,
        status: newService.status,
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
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
      alert(editingService ? "Service updated successfully!" : "Service created successfully!");
    } catch (error) {
      alert(editingService ? "Failed to update service" : "Failed to create service");
    }
  };

  const ServiceModal = (({ visible }) => {
    if (!visible) return null;

    return (
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        onClick={() => setShowServiceModal(false)}
      >
        <div
          className="bg-white rounded-2xl p-6 w-[90%] max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingService ? "Edit Service" : "Add New Service"}
          </h2>
          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={newService.title}
                onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price (SC)</label>
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Availability</label>
              <input
                type="text"
                value={newService.availability}
                onChange={(e) => setNewService(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g., Mon-Fri, Weekends only"
                required
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
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
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingService ? "Update Service" : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-lg font-semibold">My Services</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate("/notification")} className="relative">
              <BellIcon className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>
            <button
              onClick={() => setShowServiceModal(true)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-all"
            >
              <PlusIcon className="h-4 w-4" /> Add Service
            </button>
          </div>
        </div>
      </div>

      {/* Service List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform relative"
          >
            {/* Status Badge */}
            <span
              className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${
                service.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {service.status || "Active"}
            </span>
            <h2 className="font-semibold text-base">{service.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            <p className="font-semibold text-black mt-2">SC {service.price}</p>
            <p className="text-gray-500 text-sm mt-1">
              Available: {service.availability}
            </p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleEdit(service)}
                className="text-gray-600 hover:text-black"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-gray-600 hover:text-red-600"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ServiceModal visible={showServiceModal} />
    </div>
  );
}
