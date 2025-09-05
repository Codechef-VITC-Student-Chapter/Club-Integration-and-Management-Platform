import { Inbox, Gift, Users, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white p-4 flex items-center justify-between border-b">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-gray-800">CodeChef VIT-C - Admin</h1>
        <nav className="hidden md:flex items-center gap-4">
          <a href="#" className="bg-gray-100 text-gray-900 px-3 py-1.5 rounded-md text-sm font-semibold">Dashboard</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium">Points</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium">Members</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium">Requests</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-900">
          <Inbox size={20} />
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium">
          <Gift size={16} /> Points <ChevronDown size={16} />
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium">
          <Users size={16} /> Members <ChevronDown size={16} />
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </header>
  );
};

export default Header;