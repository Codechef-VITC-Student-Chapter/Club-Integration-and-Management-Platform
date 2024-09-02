import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import {
  UserCircleIcon,
  LockClosedIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

function SignUpForm({ setToken }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone Number is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    localStorage.setItem('token', formData.email + formData.password);
    setToken(formData.email + '' + formData.password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-cover bg-center bg-mobile-login md:bg-desktop-login">
      <div className="min-h-screen flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-tl-[100px] md:rounded-[67px] shadow-lg p-4 sm:p-8 w-full md:max-w-md lg:max-w-lg mx-auto md:mx-4 my-5 relative flex flex-col justify-center">
          <div className="max-w-md m-auto">
            <div className="flex justify-center mb-6">
              <img
                src={Logo}
                alt="CodeChef VIT Chennai Chapter"
                className="h-24 md:h-32"
              />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-custom-blue font-bold text-center mb-6">
              SIGN UP
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
                <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                  <label className="block text-xs sm:text-sm font-bold text-black">
                    First Name
                  </label>
                  <div className="flex items-center border-2 rounded-md shadow-sm mt-1">
                    <div className="p-2">
                      <UserCircleIcon className="h-5 w-5 text-black" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-2 pr-3 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.firstName ? 'border-red-500' : 'border-black'
                      }`}
                      placeholder="First Name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs sm:text-sm font-bold text-black">
                    Last Name
                  </label>
                  <div className="flex items-center border-2 rounded-md shadow-sm mt-1">
                    <div className="p-2">
                      <UserCircleIcon className="h-5 w-5 text-black" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`appearance-none block w-full pl-2 pr-3 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.lastName ? 'border-red-500' : 'border-black'
                      }`}
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-bold text-black">
                  Email ID
                </label>
                <div className="flex items-center border-2 rounded-md shadow-sm mt-1">
                  <div className="p-2">
                    <UserCircleIcon className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-2 pr-3 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.email ? 'border-red-500' : 'border-black'
                    }`}
                    placeholder="some.mail@university.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-bold text-black">
                  Phone Number
                </label>
                <div className="flex items-center border-2 rounded-md shadow-sm mt-1">
                  <div className="p-2">
                    <PhoneIcon className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-2 pr-3 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.phone ? 'border-red-500' : 'border-black'
                    }`}
                    placeholder="Phone Number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-bold text-black">
                  Password
                </label>
                <div className="flex items-center border-2 rounded-md shadow-sm mt-1">
                  <div className="p-2">
                    <LockClosedIcon className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-2 pr-3 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.password ? 'border-red-500' : 'border-black'
                    }`}
                    placeholder="Password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-bold text-black">
                  Confirm Password
                </label>
                <div className="flex items-center border-2 rounded-md shadow-sm mt-1">
                  <div className="p-2">
                    <LockClosedIcon className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full pl-2 pr-3 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.confirmPassword ? 'border-red-500' : 'border-black'
                    }`}
                    placeholder="Confirm Password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-lg sm:text-xl md:text-2xl font-medium text-white bg-[#74baec] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Up
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs sm:text-sm text-black">
                  Already have an account?
                </p>
                <a
                  href="/login"
                  className="font-medium text-custom-blue-darker hover:text-blue-500 text-xs sm:text-sm"
                >
                  Log In
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
