import React, { startTransition, useTransition } from 'react';

function Navbar({ setToken }) {
  function signOut() {
    localStorage.removeItem('token');
    startTransition(() => {
      setToken(null);
    });
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <a href="/dashboard">
        <div className="text-xl font-bold">CodeChef-VITC</div>
      </a>
      <ul className="flex space-x-4">
        <li>
          <a href="/dashboard" className="hover:underline">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/leaderboard" className="hover:underline">
            Leaderboard
          </a>
        </li>
        <li>
          <a href="/upload" className="hover:underline">
            Requests
          </a>
        </li>
      </ul>
      <button
        onClick={signOut}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sign out
      </button>
    </nav>
  );
}

export default Navbar;
