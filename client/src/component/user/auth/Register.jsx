// RegisterForm.jsx
import React, { useState } from 'react';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { register } from '../../../services/api';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    year: '',
    role: '',
    studentIdFile: null,
    studyLoadFile: null,
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('course', formData.course);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('role', formData.role);
      
      if (formData.studentIdFile) {
        formDataToSend.append('studentId', formData.studentIdFile);
      }
      if (formData.studyLoadFile) {
        formDataToSend.append('studyLoad', formData.studyLoadFile);
      }

      const response = await register(formDataToSend);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-8 rounded-b-[40px] shadow-lg">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate('/'))}
          className="flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>{step > 1 ? 'Back' : 'Sign In'}</span>
        </button>
        <h1 className="text-2xl font-bold mt-4">Create Account</h1>
        <p className="text-white/80 mt-1">Step {step} of 3</p>

        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-white/20 rounded-full">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="px-6 py-8">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:border-blue-500 peer placeholder-transparent"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <label className="absolute left-4 -top-2.5 text-sm text-gray-600 bg-white px-2 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm">
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:border-blue-500 peer placeholder-transparent"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label className="absolute left-4 -top-2.5 text-sm text-gray-600 bg-white px-2 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm">
                  Email Address
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:border-blue-500 peer placeholder-transparent"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <label className="absolute left-4 -top-2.5 text-sm text-gray-600 bg-white px-2 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm">
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:border-blue-500 peer placeholder-transparent"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <label className="absolute left-4 -top-2.5 text-sm text-gray-600 bg-white px-2 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm">
                  Confirm Password
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Course and Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  name="course"
                  required
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:border-blue-500 peer placeholder-transparent"
                  placeholder="Course"
                  value={formData.course}
                  onChange={handleChange}
                />
                <label className="absolute left-4 -top-2.5 text-sm text-gray-600 bg-white px-2 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm">
                  Course
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="year"
                  required
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:border-blue-500 peer placeholder-transparent"
                  placeholder="Year Level"
                  value={formData.year}
                  onChange={handleChange}
                />
                <label className="absolute left-4 -top-2.5 text-sm text-gray-600 bg-white px-2 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm">
                  Year Level
                </label>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <label htmlFor="studentIdFile" className="block">
                <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer text-center">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUpload className="text-blue-500" />
                  </div>
                  <p className="text-sm font-medium">
                    {formData.studentIdFile ? formData.studentIdFile.name : 'Upload Student ID'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                  <input
                    id="studentIdFile"
                    type="file"
                    name="studentIdFile"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </label>

              <label htmlFor="studyLoadFile" className="block">
                <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer text-center">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUpload className="text-blue-500" />
                  </div>
                  <p className="text-sm font-medium">
                    {formData.studyLoadFile ? formData.studyLoadFile.name : 'Upload Study Load'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                  <input
                    id="studyLoadFile"
                    type="file"
                    name="studyLoadFile"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Role Selection */}
            <div className="space-y-3">
              { [
                {
                  value: 'Learner',
                  icon: '🎓',
                  label: 'Learner',
                  desc: 'I need help learning a craft-based skill',
                },
                {
                  value: 'Tutor',
                  icon: '👨‍🏫',
                  label: 'Tutor',
                  desc: 'I can tutor others in craft-based skills',
                },
                {
                  value: 'Both',
                  icon: '🤝',
                  label: 'Both',
                  desc: 'I can help others and need help too',
                },
              ].map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    formData.role === role.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{role.icon}</span>
                    <div className="text-left">
                      <p className="font-medium">{role.label}</p>
                      <p className="text-sm text-gray-500">{role.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8">
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium text-lg hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium text-lg hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200"
            >
              Create Account
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
