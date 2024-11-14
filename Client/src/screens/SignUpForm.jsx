import React, { useState } from "react";
import Logo from "../assets/logo.png";
import {
  PiUserCircle,
  PiLockLight,
  PiIdentificationCardLight,
} from "react-icons/pi";
import { MdOutlineMail } from "react-icons/md";
import { useRunningContext } from "../contexts/RunningContext";
import loginImage from "../assets/loginScreen_Background.png";
import mobileLoginImage from "../assets/mobileLoginScreen_Background.png";

import SHA256 from "crypto-js/sha256";
function hashPassword(password) {
  return SHA256(password).toString();
}

const validatePassword = (password) => {
  const errors = [];

  // Check for lowercase letters
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("a lowercase letter");
  }

  // Check for uppercase letters
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("an uppercase letter");
  }

  // Check for numbers
  if (!/(?=.*\d)/.test(password)) {
    errors.push("a number");
  }

  // Check for special characters
  if (!/(?=.*[@$!%*?&#])/.test(password)) {
    errors.push("a special character");
  }

  return errors;
};

function SignUpForm() {
  const { baseURL, setCurrentUser, setIsAdmin, setToken } = useRunningContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    registrationNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    registrationNumber: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.registrationNumber) {
      newErrors.registrationNumber = "Register Number is required";
      isValid = false;
    } else if (
      !/^[0-9]{2}[A-Z]{3}[0-9]{4,5}$/.test(
        formData.registrationNumber.toUpperCase()
      )
    ) {
      newErrors.registrationNumber =
        "Register Number is not in the format required";
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else {
      const passwordErrors = validatePassword(formData.password);

      if (passwordErrors.length > 0) {
        newErrors.password =
          "Password must include the following: \n" + passwordErrors.join("\n");
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await fetch(`${baseURL}/authApi/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNumber: formData.registrationNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: hashPassword(formData.password),
        }),
      });
      console.log(response);
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        var payload = JSON.parse(window.atob(data.token.split(".")[1]));
        setCurrentUser(payload.user_id);
        // setIsAdmin(payload.is_admin);
        setToken(data.token);
      }
    } catch (error) {
      console.log("Error in signup! ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate();
  };

  return (
    <div className="bg-[#E9F1FE] relative h-screen overflow-hidden">
      <img
        src={mobileLoginImage}
        alt="LoginImage"
        className="absolute top-0 left-0 md:hidden"
      />
      <img
        src={mobileLoginImage}
        alt="LoginImage"
        className="absolute -bottom-16 -right-32 md:hidden"
      />
      <div className="w-full absolute h-screen flex justify-center items-center">
        <img
          src={loginImage}
          alt="LoginImage"
          className="p-24 max-w-full max-h-full object-contain hidden md:inline-block"
        />
      </div>
      <div className="min-h-screen flex items-center justify-center md:justify-end">
        <div className="bg-white rounded-[40px] md:rounded-[67px] w-[90%] shadow-lg p-6 md:p-12 md:max-w-md md:w-[561px] mx-4 md:relative absolute md:bottom-auto flex flex-col justify-center border md:mr-16 px-8">
          <div className="w-full md:max-w-96 m-auto">
            <div className="flex justify-center mb-1 md:mb-2">
              <img
                src={Logo}
                alt="CodeChef VIT Chennai Chapter"
                className="h-24 md:h-32"
              />
            </div>
            <h2 className="text-[16px] md:text-2xl text-custom-blue text-center mb-6">
              SIGN UP
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mb-2">
                <div className="w-full sm:w-1/2 mb-2 sm:mb-0">
                  <label className="block text-sm text-black mb-1">
                    FIRST NAME
                  </label>
                  <div
                    className={`flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm ${
                      errors.firstName ? "border-red-500" : "border-black"
                    }`}
                  >
                    <div className="p-2">
                      <PiUserCircle className="h-5 w-5 text-black" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
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
                  <label className="block text-sm text-black mb-1">
                    LAST NAME
                  </label>
                  <div
                    className={`flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm ${
                      errors.lastName ? "border-red-500" : "border-black"
                    }`}
                  >
                    <div className="p-2">
                      <PiUserCircle className="h-5 w-5 text-black" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
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
              <div className="mb-2">
                <label className="block text-sm text-black mb-1">
                  EMAIL ID
                </label>
                <div
                  className={`flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm  ${
                    errors.email ? "border-red-500" : "border-black"
                  }`}
                >
                  <div className="p-2">
                    <MdOutlineMail className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                    placeholder="some.mail@university.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-sm text-black mb-1">
                  REGISTRATION NUMBER
                </label>
                <div
                  className={`flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm ${
                    errors.registrationNumber
                      ? "border-red-500"
                      : "border-black"
                  }`}
                >
                  <div className="p-2">
                    <PiIdentificationCardLight className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className={`appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md `}
                    placeholder="Registration Number"
                  />
                </div>
                {errors.registrationNumber && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.registrationNumber}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-sm text-black mb-1">
                  PASSWORD
                </label>
                <div
                  className={`flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm ${
                    errors.password ? "border-red-500" : "border-black"
                  }`}
                >
                  <div className="p-2">
                    <PiLockLight className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md `}
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
                <label className="block text-sm text-black mb-1">
                  CONFIRM PASSWORD
                </label>
                <div
                  className={`flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm ${
                    errors.confirmPassword ? "border-red-500" : "border-black"
                  }`}
                >
                  <div className="p-2">
                    <PiLockLight className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md `}
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
                  className="w-full flex justify-center py-1 md:py-2 border border-transparent rounded-md shadow-sm  text-white hover:bg-[#74baec] bg-[#4079DA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Up
                </button>
              </div>
              <div className="flex font-semibold justify-end items-center mt-3">
                <p className="text-[12px] md:text-sm text-black">
                  Already have an account?
                  <a href="/login" className=" ml-1 text-[#4079DA]">
                    Log In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
