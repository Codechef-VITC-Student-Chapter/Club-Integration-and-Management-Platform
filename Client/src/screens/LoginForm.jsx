import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { PiUserCircle, PiLockLight } from "react-icons/pi";
import { useRunningContext } from "../contexts/RunningContext";
import loginImage from "../assets/loginScreen_Background.png";

import SHA256 from "crypto-js/sha256";
function hashPassword(password) {
  return SHA256(password).toString();
}

function LoginForm() {
  const { baseURL, setCurrentUser, currentUser, setToken } =
    useRunningContext();

  const [regno, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/authApi/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regno: regno,
          password: hashPassword(password),
        }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        var payload = JSON.parse(window.atob(data.token.split(".")[1]));
        setCurrentUser(payload.user_id);
        setToken(data.token);
      }
    } catch (error) {
      console.log("Error in logging in! " + error);
    }
  };

  return (
    <div className="bg-cover bg-center bg-[#E9F1FE] relative">
      <div className="w-full absolute h-screen flex justify-center">
        <img src={loginImage} alt="LoginImage" className="p-24 h-screen" />
      </div>
      <div className="min-h-screen flex items-center md:justify-end">
        <div className="bg-white rounded-tl-[180px] md:rounded-[67px] shadow-lg p-8 w-full md:max-w-md md:w-[561px] md:h-[555px] mx-0 md:mx-4 md:relative absolute bottom-0 left-0 right-0 md:bottom-auto flex flex-col justify-center h-[85vh] border md:mr-16 px-12">
          <div className="w-full max-w-96 m-auto">
            <div className="flex justify-center mb-2">
              <img
                src={Logo}
                alt="CodeChef VIT Chennai Chapter"
                className="h-32"
              />
            </div>
            <h2 className="text-2xl text-custom-blue text-center mb-8">
              LOGIN
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-black mb-1">
                  REGISTRATION NUMBER
                </label>
                <div className="flex items-center border-2 border-black rounded-md shadow-sm">
                  <div className="p-2">
                    <PiUserCircle className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="regno"
                    name="regno"
                    className="appearance-none block w-full pl-2 pr-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="23ABC1234"
                    value={regno}
                    onChange={(e) => setRegno(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-black mb-1">
                  PASSWORD
                </label>
                <div className="flex items-center border-2 border-black rounded-md shadow-sm">
                  <div className="p-2">
                    <PiLockLight className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    className="appearance-none block w-full pl-2 pr-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center font-semibold justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-custom-blue-darker">
                    Remember Me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-custom-blue-darker hover:text-blue-500"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center p-1 border border-transparent rounded-md shadow-sm  text-white hover:bg-[#74baec] bg-[#4079DA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log in
                </button>
              </div>
              <div className="flex font-semibold justify-end items-center mt-3">
                <p className="text-sm text-black">Don’t have an account?</p>
                <a href="/signup" className=" ml-1 text-sm text-[#4079DA]">
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
