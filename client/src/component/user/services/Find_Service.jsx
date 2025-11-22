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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Confirm Booking</h2>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold text-base sm:text-lg">{service.title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">{service.description}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price:</span>
                <span className="font-bold text-blue-600">SC {service.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Provider:</span>
                <span className="font-medium truncate">{service.provider || 'Unknown Provider'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Availability:</span>
                <span className="font-medium">{service.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm border"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(service)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// FilterPanel component
const FilterPanel = ({ filters, handleFilterChange, categories }) => (
  <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 mb-4 mx-4">
    <div className="space-y-3">
      <div>
        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
          Category
        </label>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="w-full rounded-lg border border-gray-200 text-sm p-2"
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-200 text-sm p-2"
            placeholder="Min SC"
          />
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-200 text-sm p-2"
            placeholder="Max SC"
          />
        </div>
      </div>

      <div>
        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
          Minimum Rating
        </label>
        <select
          name="minRating"
          value={filters.minRating}
          onChange={handleFilterChange}
          className="w-full rounded-lg border border-gray-200 text-sm p-2"
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


const FindServices = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleMessage = (service) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      console.log('Service object:', service);
      console.log('Current user:', currentUser);
      
      if (!service.user_id) {
        alert('Service provider information not available');
        return;
      }

      if (currentUser?.role?.toLowerCase() === service.provider_role?.toLowerCase()) {
        alert('You can only message users with different roles');
        return;
      }

      navigate(`/messages/chat/${service.user_id}`);
    } catch (error) {
      console.error('Error initiating message:', error);
      alert('Failed to open chat. Please try again.');
    }
  };

  const role = userData?.role?.toLowerCase() || '';

  const navItems = (() => {
    if (role === 'learner') {
      return [
        { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
        { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
        { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
        { name: "Find Services", icon: <MagnifyingGlassIcon className="h-5 w-5" />, path: "/find-services" },
        { name: "Saved", icon: <BookmarkIcon className="h-5 w-5" />, path: "/saved" },
        { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
        { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
        { name: "Past Feedbacks", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/view-past-feedback" },
        { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
      ];
    }

    if (role === 'tutor') {
      return [
        { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
        { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
        { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
        { name: "My Services", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/my-services" },
        { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
        { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
        { name: "Past Feedbacks", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/view-past-feedback" },
        { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
      ];
    }

    return [
      { name: "Home", icon: <HomeIcon className="h-5 w-5" />, path: "/dashboard" },
      { name: "Profile", icon: <UserIcon className="h-5 w-5" />, path: "/profile" },
      { name: "Messages", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, path: "/messages" },
      { name: "My Services", icon: <ClipboardDocumentListIcon className="h-5 w-5" />, path: "/my-services" },
      { name: "Find Services", icon: <MagnifyingGlassIcon className="h-5 w-5" />, path: "/find-services" },
      { name: "Saved", icon: <BookmarkIcon className="h-5 w-5" />, path: "/saved" },
      { name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, path: "/wallet" },
      { name: "Transactions", icon: <ReceiptRefundIcon className="h-5 w-5" />, path: "/transactions" },
      { name: "Past Feedbacks", icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />, path: "/view-past-feedback" },
      { name: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />, path: "/" },
    ];
  })();

  const categories = [
    "All",
    "Origami",
    "Crocheting",
    "Embroidery",
    "Scrapbooking",
    "Resin Art",
  ];
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserData(storedUser);
    if (storedUser?.role?.toLowerCase() === 'tutor') {
      navigate('/dashboard');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await getAllServices(filters);

    const servicesWithProvider = response.data.map(service => ({
      ...service,
      provider: service.user_full_name,
      provider_role: service.user_role,
      user_id: service.user_id // Add this from backend
    }));

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

      const response = await createBooking(bookingData);
      
      if (response.data) {
        setSelectedService(null);
        alert('Service booked successfully!');
        navigate('/transactions');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to book service. Please try again.');
    }
  };

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
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-40 lg:hidden flex flex-col shadow-xl border-r`}>
        {/* Header - Fixed at top */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
          <h2 className="font-semibold text-white">Menu</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
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
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex-shrink-0 hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold truncate">Browse Services</h1>
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
                onClick={() => setShowFilters((prev) => !prev)} 
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <AdjustmentsHorizontalIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-white/80 flex-shrink-0" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={handleSearch} 
              placeholder="Search services..." 
              className="bg-transparent outline-none ml-2 text-sm w-full text-white placeholder-white/70"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && <FilterPanel filters={filters} handleFilterChange={handleFilterChange} categories={categories} />}

        {/* Service Cards */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              {filteredServices.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p className="text-sm sm:text-base">No services found</p>
                </div>
              ) : (
                filteredServices.map((service) => (
                  <div 
                    key={service.id} 
                    className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{service.title}</h2>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{service.description}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">by {service.provider}</p>
                      </div>
                      <button className="flex-shrink-0 hover:text-blue-600 transition-colors">
                        <BookmarkIcon className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-blue-600">SC {service.price}</span>
                        <span className="text-xs text-gray-500">⭐ {service.rating}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                        onClick={() => handleBookNow(service)}
                      >
                        Book Now
                      </button>
                      <button 
                        onClick={() => handleMessage(service)}
                        className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Message
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

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
          onConfirm={handleConfirmBooking} 
        />
      )}
    </div>
  );
}

export default FindServices;