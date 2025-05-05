
import React from 'react';
import { Search, ChevronDown, Bell, User, Plus } from 'lucide-react';

const TopNavbar = () => {
  return (
    <div className="flex h-12 bg-white border-b border-gray-200 px-4 items-center justify-between">
      {/* Left side */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold mr-4">My workspace</h1>
        <button className="flex items-center text-sm text-gray-600 hover:bg-gray-100 rounded py-1 px-2">
          <span>Recent</span>
          <ChevronDown size={16} className="ml-1" />
        </button>
      </div>
      
      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-gray-100 rounded-md pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-powerbi-primary"
          />
        </div>
      </div>
      
      {/* Right side */}
      <div className="flex items-center space-x-3">
        <button className="flex items-center bg-powerbi-primary text-white text-sm rounded py-1.5 px-3 hover:bg-powerbi-primary/90">
          <Plus size={16} className="mr-1.5" />
          <span>New</span>
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-full">
          <Bell size={18} />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-full">
          <User size={18} />
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;
