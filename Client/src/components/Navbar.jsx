import React, { useState, useEffect } from 'react';
import { startTransition } from 'react';
import { useRunningContext } from '../contexts/RunningContext';
import logo from '../assets/logo.png';
import defPic from '../assets/NavbarVectors/user.png';
import userP from '../assets/NavbarVectors/ph_user-circle.png'; 

function Navbar() {
  const { setToken } = useRunningContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(() => {
    return localStorage.getItem('selectedMenuItem') || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('selectedMenuItem', selectedMenuItem);
  }, [selectedMenuItem]);

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const signOut = () => {
    localStorage.removeItem('token');
    startTransition(() => {
      setToken(null);
    });
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Requests', path: '/upload' },
    { name: 'Settings', path: '/settings' }, // Added Settings for consistency
  ];

  return (
    <nav className="bg-gray-800 text-white p-3 rounded-lg mx-auto my-2 w-11/12 lg:w-full lg:my-0 lg:py-0 lg:pt-2 lg:font-lato lg:rounded-none">
      <div className="container mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="flex items-center justify-start lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Logo and Title */}
        <div className="flex items-center justify-evenly lg:justify-normal lg:mx-16">
          <img src={logo} alt="CodeChef-VITC" className="w-12 h-12 mx-1 lg:mx-2" />
          <a href="/dashboard" className="text-2xl font-mooli lg:font-lato lg:font-extralight" onClick={() => handleMenuItemClick('dashboard')}>
            <span className='lg:hidden'>CodeChef</span>
            <span className='hidden lg:inline'>CodeChef VIT-C</span>
          </a>
        </div>
        <div></div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:w-auto">
          <ul className="flex flex-col lg:flex-row lg:space-x-4">
            {menuItems.map(item => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className={`block py-3 px-4 ${selectedMenuItem === item.name.toLowerCase() ? 'border-b-4 border-orange-500' : ''}`}
                  onClick={() => handleMenuItemClick(item.name.toLowerCase())}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <button onClick={signOut} className="mt-2 lg:mt-0 text-white px-4 py-3 rounded">
                Sign out
              </button>
            </li>
            <li>
              <img src={userP} alt="Profile" className="w-10 h-10 rounded-full mb-3" />
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-5" onClick={() => setIsMenuOpen(false)}></div>
          <div className={`fixed inset-y-0 left-0 w-4/5 bg-gray-800 text-white p-6 font-semibold z-10 transform transition-transform duration-500 ease-in-out overflow-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="block items-center justify-start mb-6">
              <svg className="w-8 h-8 mr-2" onClick={() => setIsMenuOpen(false)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>

            {/* Profile Picture and Name */}
            <div className="flex flex-col items-center mb-6">
              <img src={defPic} alt="Profile" className="w-28 h-28 rounded-full mb-2" />
              <span className="text-xl font-medium font-lato">22BCE1111</span>
              <hr className="w-4/5 border-t border-gray-600 mt-4 mb-4" />
            </div>

            {/* Navigation Links */}
            <ul className="flex flex-col items-start space-y-4">
              {menuItems.map(item => (
                <li key={item.name}>
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
              <li>
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
