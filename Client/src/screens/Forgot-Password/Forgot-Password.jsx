import { useState } from "react";
import Logo from "../../assets/logo.png";
import { PiUserCircle, PiLockLight } from "react-icons/pi";
import { useRunningContext } from "../../contexts/RunningContext";
import loginImage from "./assets/loginScreen_Background.png";
import mobileLoginImage from "./assets/mobileLoginScreen_Background.png";
import SHA256 from "crypto-js/sha256";

function hashPassword(password) {
  return SHA256(password).toString();
}

function ForgotPassword() {
  const { baseURL } = useRunningContext();
  const [step, setStep] = useState(1); // 1: reg, 2: otp+newpass
  const [regNo, setRegNo] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!regNo) {
      setError("Registration Number is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/auth/send/otp/${regNo}`);
      const data = await res.json();
      if (res.ok) {
        // Mask email: show first 5 and last 5 chars, rest as *
        let email = data.message?.match(/([\w.-]+@[\w.-]+)/)?.[1] || "";
        if (email.length > 10) {
          const start = email.slice(0, 5);
          const end = email.slice(-5);
          const masked = start + "*".repeat(email.length - 10) + end;
          setMaskedEmail(masked);
        } else {
          setMaskedEmail(email);
        }
        setSuccess("");
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Try again later.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!otp || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/auth/set/pass`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reg_no: regNo,
          otp: otp,
          password: hashPassword(newPassword),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || "Password reset successful");
        setStep(3);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error. Try again later.");
    }
    setLoading(false);
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
              FORGOT PASSWORD
            </h2>
            {error && (
              <p className="text-red-500 text-center mb-2 text-sm">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-center mb-2 text-sm">
                {success}
              </p>
            )}
            {step === 1 && (
              <form onSubmit={handleSendOTP}>
                <div className="mb-4">
                  <label className="block text-sm text-black mb-1">
                    REGISTRATION NUMBER
                  </label>
                  <div className="flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm">
                    <div className="p-2">
                      <PiUserCircle className="h-5 w-5 text-black" />
                    </div>
                    <input
                      type="text"
                      name="regNo"
                      className="appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      placeholder="23ABC1234"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-1 md:py-2 border border-transparent rounded-md shadow-sm  text-white hover:bg-[#74baec] bg-[#4079DA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
                <div className="flex font-semibold justify-end items-center mt-3">
                  <p className="text-[12px] md:text-sm text-black">
                    Remembered your password?
                    <a href="/login" className=" ml-1 text-[#4079DA]">
                      Log In
                    </a>
                  </p>
                </div>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  {maskedEmail && (
                    <p className="text-blue-700 text-center mb-2 text-sm">
                      OTP sent to:{" "}
                      <span className="font-mono">{maskedEmail}</span>
                    </p>
                  )}
                  <label className="block text-sm text-black mb-1">OTP</label>
                  <div className="flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm">
                    <div className="p-2">
                      <PiLockLight className="h-5 w-5 text-black" />
                    </div>
                    <input
                      type="text"
                      name="otp"
                      className="appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-black mb-1">
                    New Password
                  </label>
                  <div className="flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm">
                    <div className="p-2">
                      <PiLockLight className="h-5 w-5 text-black" />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      className="appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-black mb-1">
                    Confirm Password
                  </label>
                  <div className="flex items-center border-[1px] md:border-2 border-black rounded-md shadow-sm">
                    <div className="p-2">
                      <PiLockLight className="h-5 w-5 text-black" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="appearance-none block w-full pr-3 py-1 md:py-2 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-1 md:py-2 border border-transparent rounded-md shadow-sm  text-white hover:bg-[#74baec] bg-[#4079DA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
            {step === 3 && (
              <div className="text-center mt-6">
                <p className="text-green-600 text-lg font-semibold mb-2">
                  Password reset successful!
                </p>
                <a href="/login">
                  <button className="w-full mt-6 py-2 px-4 rounded-md bg-[#4079DA] text-white text-lg font-semibold hover:bg-[#74baec] transition">
                    Go to Login
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
