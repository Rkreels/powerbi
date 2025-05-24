
import React from 'react';
import { Search, Bell, Download, HelpCircle, Settings, User, ChevronDown } from 'lucide-react';

const TopHeader: React.FC = () => {
  return (
    <header className="h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-lg font-semibold text-blue-600 mr-6">Power BI</span>
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-sm text-gray-700 hover:text-blue-600">
            <span className="mr-1">Home</span>
          </button>
          <span className="text-gray-300">|</span>
          <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
            <span className="mr-1">My workspace</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center flex-1 justify-center max-w-lg">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search dashboards, reports, and more..." 
            className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="text-xs text-gray-600 flex flex-col items-end">
          <div className="font-medium">Free trial</div>
          <div>59 days left</div>
        </div>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell size={18} />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Settings size={18} />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Download size={18} />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <HelpCircle size={18} />
        </button>
        <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
          <User size={16} />
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
