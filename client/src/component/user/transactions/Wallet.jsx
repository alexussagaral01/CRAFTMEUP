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
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom'
import { getWalletBalance, getUserWalletHistory, createWalletRequest } from '../../../services/api';

export default function Wallet() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [requestType, setRequestType] = useState('top-up');
  const [amount, setAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add to all components
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


  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  setUserData(storedUser);
}, []);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const validateCashOutAmount = (requestAmount) => {
  const amountNum = parseFloat(requestAmount);
  const balanceNum = parseFloat(balance);
  
  if (isNaN(amountNum) || amountNum <= 0) {
    alert('Please enter a valid amount');
    return false;
  }

  if (balanceNum - amountNum < 10) {
    alert('You must maintain a minimum balance of 10 SC. Maximum cash-out amount: ' + (balanceNum - 10) + ' SC');
    return false;
  }

  return true;
};

  const fetchWalletData = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      console.error('No user data found in localStorage');
      return;
    }

    console.log('Fetching wallet data for user:', user.id);
    
    try {
      const balanceResponse = await getWalletBalance(user.id);
      console.log('Raw balance response:', balanceResponse);
      
      if (balanceResponse?.data?.balance !== undefined) {
        const newBalance = parseFloat(balanceResponse.data.balance);
        console.log('Setting balance to:', newBalance);
        setBalance(newBalance);
      } else {
        console.error('Invalid balance data:', balanceResponse);
        setBalance(0);
      }

      // Fetch transaction history
      const historyResponse = await getUserWalletHistory(user.id);
      console.log('Transaction history response:', historyResponse);
      
      if (historyResponse?.data) {
        setTransactions(historyResponse.data);
      } else {
        console.error('Invalid transaction history data:', historyResponse);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Data fetch error:', error);
      setTransactions([]);
    }
  } catch (error) {
    console.error('Main error:', error);
  }
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setProofFile(file);
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const handleSubmitRequest = async () => {
  if (!amount || !referenceNumber || (requestType === 'top-up' && !proofFile)) {
    alert('Please fill in all required fields');
    return;
  }
  if (requestType === 'cash-out' && !validateCashOutAmount(amount)) {
    return;
  }

  try {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      throw new Error('User data not found');
    }

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('type', requestType);
    formData.append('amount', amount);
    formData.append('referenceNumber', referenceNumber);
    
    if (proofFile) {
      formData.append('proofImage', proofFile);
    }

    // Log FormData for debugging
    for (let pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1]);
    }

    const response = await createWalletRequest(formData);
    console.log('Submit response:', response);

    if (response?.data?.success) {
      alert('Request submitted successfully!');
      setAmount('');
      setReferenceNumber('');
      setProofFile(null);
      await fetchWalletData();
    } else {
      throw new Error(response?.data?.message || 'Invalid response from server');
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert(error.response?.data?.message || 'Failed to submit request. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col w-full md:max-w-sm mx-auto relative">
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-b from-gray-50 to-white w-64 transition-transform duration-300 ease-in-out z-30 md:max-w-sm shadow-xl border-r flex flex-col`}>
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
          <h2 className="font-semibold text-white">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors">
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

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-lg font-semibold">Wallet</h1>
          </div>
          <button onClick={() => navigate('/notification')} className="relative">
            <BellIcon className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <p className="text-white/80 text-sm">Current Balance</p>
          <h2 className="text-3xl font-bold mt-1 text-white">{balance}</h2>
          <p className="text-white/80 text-sm">SkillCoins</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setRequestType('top-up')}
            className={`flex-1 py-2 rounded-xl ${requestType === 'top-up' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Top Up
          </button>
          <button 
            onClick={() => setRequestType('cash-out')}
            className={`flex-1 py-2 rounded-xl ${requestType === 'cash-out' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Cash Out
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-medium mb-2">Amount (SkillCoins)</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-medium mb-2">
            {requestType === 'top-up' ? 'GCash Reference Number' : 'GCash Number'}
          </p>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder={requestType === 'top-up' ? 'Enter reference number' : 'Enter GCash number'}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
          />
        </div>

        {requestType === 'top-up' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm font-medium mb-2">Upload Proof of Payment</p>
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <ArrowUpTrayIcon className="h-7 w-7 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {proofFile ? proofFile.name : 'Tap to upload image'}
              </p>
              <p className="text-xs text-gray-400 mt-1">(PNG, JPG up to 5MB)</p>
            </label>
          </div>
        )}

        <button 
          onClick={handleSubmitRequest}
          disabled={isLoading || !amount || !referenceNumber || (requestType === 'top-up' && !proofFile)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : `Submit ${requestType === 'top-up' ? 'Top-Up' : 'Cash-Out'} Request`}
        </button>


        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Transaction History</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-100 
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
            {transactions
              .filter(t => t.status !== 'pending')
              .map((t, i) => (
                <div key={i} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{t.type}</p>
                    <span className={`text-sm font-semibold ${
                      t.type === 'top-up' || t.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {t.type === 'top-up' || t.type === 'credit' ? '+' : '-'}{t.amount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">Ref: {t.reference_number}</p>
                  <p className={`text-xs mt-1 font-medium ${
                    t.status === 'approved' || t.status === 'completed' ? 'text-green-600' : 
                    t.status === 'rejected' ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </p>
                </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}