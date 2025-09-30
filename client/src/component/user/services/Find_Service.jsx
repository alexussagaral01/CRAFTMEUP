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
  BookmarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getAllServices, createBooking } from "../../../services/api";

// Booking Confirmation Modal
function BookingModal({ service, onClose, onConfirm }) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-lg">{service.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="font-bold text-blue-600">SC {service.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider:</span>
                <span className="font-medium">{service.provider || 'Unknown Provider'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Availability:</span>
                <span className="font-medium">{service.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(service)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const FindServices = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

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

  const categories = [
    "All",
    "Origami",
    "Crocheting",
    "Embroidery",
    "Scrapbooking",
    "Resin Art",
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user')); // get current logged-in user
    const response = await getAllServices(filters);

    // Map services and include provider's full name
    const servicesWithProvider = response.data.map(service => ({
      ...service,
      provider: service.user_full_name, // make sure your backend sends this
    }));

    // Remove services created by the current user
    const otherServices = servicesWithProvider.filter(service => service.user_id !== user.id);

    setServices(otherServices);
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !filters.category ||
      filters.category === "All" ||
      service.category === filters.category;

    const matchesPrice =
      (!filters.minPrice || service.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || service.price <= parseFloat(filters.maxPrice));

    const matchesRating =
      !filters.minRating || service.rating >= parseFloat(filters.minRating);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const FilterPanel = () => (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-3 mt-3 mx-4">
      <div className="space-y-2">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full rounded-lg border-gray-200 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Min Price
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-200 text-sm"
              placeholder="Min SC"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full rounded-lg border-gray-200 text-sm"
              placeholder="Max SC"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Minimum Rating
          </label>
          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className="w-full rounded-lg border-gray-200 text-sm"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>
    </div>
  );

  const handleBookNow = (service) => {
    setSelectedService(service);
  };

  const handleConfirmBooking = async (service) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const bookingData = {
        userId: user.id,
        serviceId: service.id,
        providerId: service.user_id,
        type: 'booking',
        amount: service.price,
        status: 'pending'
      };

      console.log('Creating booking with data:', bookingData); // Debug log

      const response = await createBooking(bookingData);
      if (response.data) {
        setSelectedService(null);
        alert('Service booked successfully!');
        navigate('/transactions');
      }
    } catch (error) {
      console.error('Booking error:', error.response?.data || error);
      alert(error.response?.data?.message || 'Failed to book service. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
          <h2 className="font-semibold text-white">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.name} onClick={() => navigate(item.path)} className="flex items-center w-full p-3 text-gray-600 hover:text-blue-600 rounded-xl transition-all duration-200 group hover:bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200">{item.icon}</div>
              <span className="ml-3 font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)}><Bars3Icon className="h-6 w-6 text-white" /></button>
            <h1 className="text-lg font-semibold">Browse Services</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate("/notification")} className="relative">
              <BellIcon className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>
            <button onClick={() => setShowFilters((prev) => !prev)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-white/80" />
            <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search services..." className="bg-transparent outline-none ml-2 text-sm w-full text-white placeholder-white/70"/>
          </div>
        </div>
      </div>

      {showFilters && <FilterPanel />}

      {/* Service Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm">{service.title}</h2>
                <p className="text-gray-600 text-xs mt-1">{service.description}</p>
                <p className="text-xs text-gray-500 mt-1">by {service.provider}</p>
                <p className="font-semibold text-black mt-2">SC {service.price} <span className="text-sm text-gray-500">⭐ {service.rating}</span></p>
              </div>
              <BookmarkIcon className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer"/>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => handleBookNow(service)}
              >
                Book Now
              </button>
              <button className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 hover:bg-gray-50">Message</button>
            </div>
          </div>
        ))}
      </div>

      {selectedService && <BookingModal service={selectedService} onClose={() => setSelectedService(null)} onConfirm={handleConfirmBooking} />}
    </div>
  );
}

export default FindServices;
