// RegisterForm.jsx
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic (API call)
    // You can use formData here
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 px-4 py-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4">
        {/* Back Button */}
        <div className="flex items-center space-x-2">
          <FaArrowLeft className="text-gray-600" />
          <h2 className="text-xl font-semibold">Create Account</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <label className="block text-sm font-medium mb-1">Enter your full name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border rounded-md px-4 py-2 text-sm"
          />

          {/* Email Address */}
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@school.edu"
            className="w-full border rounded-md px-4 py-2 text-sm"
          />

          {/* Password */}
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            className="w-full border rounded-md px-4 py-2 text-sm"
          />

          {/* Confirm Password */}
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full border rounded-md px-4 py-2 text-sm"
          />

          {/* Course and Year */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Course</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Course"
                className="w-full border rounded-md px-4 py-2 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Year Level</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Year"
                className="w-full border rounded-md px-4 py-2 text-sm"
              />
            </div>
          </div>

          {/* School ID Upload */}
          <div className="border border-dashed rounded-md p-4 text-center space-y-2">
            <p className="text-sm text-gray-500">Upload your student ID</p>
            <input
              type="file"
              name="studentIdFile"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="block mx-auto"
            />
          </div>

          {/* Study Load Upload */}
          <div className="border border-dashed rounded-md p-4 text-center space-y-2">
            <p className="text-sm text-gray-500">Upload your study load</p>
            <input
              type="file"
              name="studyLoadFile"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="block mx-auto"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Select Your Role</p>
            { [
              {
                value: 'Learner',
                label: 'Learner',
                desc: 'I need help learning a craft-based skill',
              },
              {
                value: 'Tutor',
                label: 'Tutor',
                desc: 'I can tutor others in craft-based skills',
              },
              {
                value: 'Both',
                label: 'Both',
                desc: 'I can help others and need help too',
              },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-start border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                  formData.role === option.value
                    ? 'border-black'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={formData.role === option.value}
                  onChange={() => handleRoleChange(option.value)}
                  className="mt-1 mr-3"
                />
                <div>
                  <span className="block font-semibold">{option.label}</span>
                  <span className="block text-xs text-gray-500">{option.desc}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Create Account */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-medium"
          >
            Create Account
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span
            className="text-black font-semibold cursor-pointer hover:underline"
            onClick={() => navigate('/')}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
