import { useState } from "react";
import Logo from "../../assets/logo.png";
import { PiUserCircle, PiLockLight } from "react-icons/pi";
import { useRunningContext } from "../../contexts/RunningContext";
import loginImage from "./assets/loginScreen_Background.png";
import mobileLoginImage from "./assets/mobileLoginScreen_Background.png";
import { useNavigate } from "react-router-dom";

import SHA256 from "crypto-js/sha256";
import { toast } from "react-toastify";
function hashPassword(password) {
  return SHA256(password).toString();
}

function LoginForm() {
  const { baseURL, setCurrentUser, setToken, setIsAdmin } = useRunningContext();
  const navigate = useNavigate();

  const [regNo, setregNo] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reg_number: regNo,
          password: hashPassword(password),
        }),
      });
      // console.log(response);

      const data = await response.json();
      // console.log(data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        var payload = JSON.parse(window.atob(data.token.split(".")[1]));
        // console.log(payload);
        setCurrentUser(payload.id);
        setIsAdmin(payload.is_lead);
        // console.log(currentUser);

        setToken(data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Error in logging in!");
      console.log("Error in logging in! " + error);
    }
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
        <div className="bg-white rounded-[40px] md:rounded-[67px] w-[90%] shadow-lg p-6 md:p-12 md:max-w-md md:w-[561px] md:h-[555px] mx-4 md:relative absolute md:bottom-auto flex flex-col justify-center border md:mr-16 px-8">
          <div className="w-full md:max-w-96 m-auto">
            <div className="flex justify-center mb-1 md:mb-2">
              <img
                src={Logo}
                alt="CodeChef VIT Chennai Chapter"
                className="h-24 md:h-32"
              />
            </div>
            <h2 className="text-[16px] md:text-2xl text-custom-blue text-center mb-6">
              LOGIN
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-black mb-1">
                  REGISTRATION NUMBER
                </label>
                <div className="flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm">
                  <div className="p-2">
                    <PiUserCircle className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="regNo"
                    name="regNo"
                    className="appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    placeholder="23ABC1234"
                    value={regNo}
                    onChange={(e) => setregNo(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2 md:mb-4">
                <label className="block text-sm text-black mb-1">
                  PASSWORD
                </label>
                <div className="flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm">
                  <div className="p-2">
                    <PiLockLight className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    className="appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                    className="h-4 md:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-1 block text-[10px] md:text-sm text-custom-blue-darker">
                    Remember Me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium  text-[10px] md:text-sm text-custom-blue-darker hover:text-blue-500"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-1 md:py-2 border border-transparent rounded-md shadow-sm  text-white hover:bg-[#74baec] bg-[#4079DA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log in
                </button>
              </div>
              <div className="flex font-semibold justify-end items-center mt-3">
                <p className="text-[12px] md:text-sm text-black">
                  Don’t have an account?
                  <a href="/signup" className=" ml-1 text-[#4079DA]">
                    Sign Up
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

export default LoginForm;
