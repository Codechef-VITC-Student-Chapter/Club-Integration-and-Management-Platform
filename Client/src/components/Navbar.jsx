import React, { useState, useEffect } from "react";
import { startTransition } from "react";
import { useRunningContext } from "../contexts/RunningContext";

import logo from "../assets/logo.png";
import defPic from "../assets/NavbarVectors/user.png";
import userP from "../assets/NavbarVectors/ph_user-circle.png";
import dash from "../assets/NavbarVectors/Dashboard.png";
import lead from "../assets/NavbarVectors/Leaderboard.png";
import req from "../assets/NavbarVectors/Request.png";
import set from "../assets/NavbarVectors/Setting.png";
import signout from "../assets/NavbarVectors/Signout.png";

function Navbar() {
  const { setToken, isAdmin, currentUser } = useRunningContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(() => {
    return localStorage.getItem("selectedMenuItem") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("selectedMenuItem", selectedMenuItem);
  }, [selectedMenuItem]);

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    startTransition(() => {
      setToken(null);
    });
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", logo: dash },
    { name: "Leaderboard", path: "/leaderboard", logo: lead },
    { name: "Request", path: "/upload", logo: req },
  ];
  if (isAdmin) {
    menuItems.push({
      name: "Member Requests",
      path: "/requests",
      logo: lead,
    });
  }

  return (
    <nav className="bg-gray-800 text-white p-3 rounded-lg mx-auto my-2 w-11/12 lg:w-full lg:my-0 lg:py-0 lg:pt-2 lg:font-lato lg:rounded-none h-[70px]">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center justify-start lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-evenly lg:justify-start lg:space-x-4">
          <img
            src={logo}
            alt="CodeChef-VITC"
            className="w-12 h-12 mx-1 lg:mx-2"
          />
          <a
            href="/dashboard"
            className="text-2xl font-mooli lg:font-lato lg:font-extralight"
            onClick={() => handleMenuItemClick("dashboard")}
          >
            <span className="lg:hidden">CodeChef</span>
            <span className="hidden lg:inline">CodeChef VIT-C</span>
          </a>
        </div>

        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          <ul className="flex flex-row space-x-6">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className={`block py-2 px-4 ${
                    selectedMenuItem === item.name.toLowerCase()
                      ? "border-b-4 border-orange-500"
                      : ""
                  }`}
                  onClick={() => handleMenuItemClick(item.name.toLowerCase())}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={signOut}
                className="mt-2 lg:mt-0 text-white px-4 py-3 text-lg rounded"
              >
                Sign out
              </button>
            </li>
            <li>
              <img
                src={signout}
                alt="Signout"
                className="w-8 h-8 rounded-full mb-3 flex items-center justify-start -translate-x-4 translate-y-2"
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
