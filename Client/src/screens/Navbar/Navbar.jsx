import { useState, useEffect } from "react";
import { startTransition } from "react";
import { useRunningContext } from "../../contexts/RunningContext";

import logo from "../../assets/logo.png";
import dash from "./assets/Dashboard.png";
import lead from "./assets/Leaderboard.png";
import req from "./assets/Request.png";
import signout from "./assets/Signout.png";
import defPic from "./assets/user.png";
import members from "./assets/members.png";
import coins from "./assets/Coins.png";
import { Menu, X } from "lucide-react";

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
    // { name: "Leaderboard", path: "/leaderboard", logo: lead },
    { name: "Request", path: "/upload", logo: req },
    { name: "Points", path: `/summary/${currentUser}`, logo: coins },
  ];
  if (isAdmin) {
    menuItems.push(
      ...[
        {
          name: "Inbox",
          path: "/adminview",
          logo: lead,
        },
        {
          name: "Members",
          path: "/memberview",
          logo: members,
        },
      ]
    );
  }

  return (
    <nav className="bg-gray-800  text-white p-2 rounded-lg mx-auto my-2 w-11/12 lg:w-full lg:my-0 lg:py-0 lg:pt-2 lg:font-lato lg:rounded-none h-[70px]">
      <div className="w-full flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="flex items-center justify-start lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <Menu />
          </button>
        </div>

        {/* Logo and Title */}
        <div className="flex items-center justify-evenly lg:justify-normal relative">
          <img
            src={logo}
            alt="CodeChef-VITC"
            className="w-12 h-12 mx-1 lg:mx-2"
          />
          <a
            href="/dashboard"
            className="text-xl font-mooli lg:font-lato lg:font-extralight"
            onClick={() => handleMenuItemClick("dashboard")}
          >
            <span className="lg:hidden">CodeChef</span>
            <span className="hidden lg:inline">CodeChef VIT-C</span>
          </a>
          {isAdmin && (
            <span className="-translate-x-1 sm:-translate-x-3 -translate-y-2 text-white font-semibold px-2 py-1 rounded-xl ml-1 sm:ml-3 text-sm ">
              Admin
            </span>
          )}
        </div>
        <div></div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:w-auto">
          <ul className="flex flex-col lg:flex-row lg:space-x-2">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={
                  selectedMenuItem === item.name.toLowerCase()
                    ? "border-b-4 border-orange-500"
                    : ""
                }
              >
                <a
                  href={item.path}
                  className="flex gap-1 py-3 px-4 items-center"
                  onClick={() => handleMenuItemClick(item.name.toLowerCase())}
                >
                  <img src={item.logo} className="size-5" />
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={signOut}
                className="mt-2 lg:mt-0 text-white px-4 py-3 rounded flex items-center justify-center gap-2"
              >
                <p>Sign out</p>
                <img
                  src={signout}
                  alt="Signout"
                  className="size-5 rounded-full flex items-center"
                />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-5"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div
            className={`fixed inset-y-0 left-0 w-4/5 bg-gray-800 text-white p-6 font-semibold z-10 transform transition-transform duration-500 ease-in-out overflow-auto ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div
              className="block items-center justify-start mb-6"
              onClick={() => setIsMenuOpen(false)}
            >
              <X />
            </div>

            {/* Profile Picture and Name */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={defPic}
                alt="Profile"
                className="w-28 h-28 rounded-full mb-2"
              />
              <span className="text-xl font-medium font-lato">
                {currentUser.substring(3)}
              </span>
              <hr className="w-11/12 border-t-2 border-white mt-4 mb-4" />
            </div>

            {/* Navigation Links */}
            <ul className="flex flex-col items-start space-y-4 font-lato font-medium mx-5">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-row items-center justify-center"
                >
                  <img
                    src={item.logo}
                    alt={item.name + " logo"}
                    className="w-6 h-6 mr-2"
                  ></img>
                  <a
                    href={item.path}
                    className="block py-2 px-4 hover:underline"
                    onClick={() => {
                      handleMenuItemClick(item.name.toLowerCase());
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li className="flex flex-row items-center justify-center">
                <img
                  src={signout}
                  alt={"SignOut logo"}
                  className="w-6 h-6 mr-2"
                />
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 px-4 hover:underline hover:text-red-700"
                >
                  Signout
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
