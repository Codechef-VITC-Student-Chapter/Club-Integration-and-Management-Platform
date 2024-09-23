import React, { useState } from 'react';
import { startTransition } from 'react';
import { useRunningContext } from '../contexts/RunningContext';

function Navbar() {
  const { setToken } = useRunningContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function signOut() {
    localStorage.removeItem('token');
    startTransition(() => {
      setToken(null);
    });
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/dashboard" className="text-xl font-bold">
          CodeChef-VITC
        </a>
        <div className="block lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:items-center lg:w-auto">
          <ul className="flex flex-col lg:flex-row lg:space-x-4">
            <li>
              <a href="/dashboard" className="block py-2 px-4 hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/leaderboard"
                className="block py-2 px-4 hover:underline"
              >
                Leaderboard
              </a>
            </li>
            <li>
              <a href="/upload" className="block py-2 px-4 hover:underline">
                Requests
              </a>
            </li>
          </ul>
          <button
            onClick={signOut}
            className="mt-2 lg:mt-0 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign out
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col items-end lg:hidden bg-gray-800 text-white p-4">
          <ul className="flex flex-col items-end space-y-2">
            <li>
              <a href="/dashboard" className="block py-2 px-4 hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/leaderboard"
                className="block py-2 px-4 hover:underline"
              >
                Leaderboard
              </a>
            </li>
            <li>
              <a href="/upload" className="block py-2 px-4 hover:underline">
                Requests
              </a>
            </li>
          </ul>
          <button
            onClick={signOut}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" 
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
