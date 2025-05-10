
import React from 'react';
import { Search, Bell, Download, HelpCircle, Settings, User } from 'lucide-react';

const TopHeader: React.FC = () => {
  return (
    <header className="h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-lg font-semibold text-powerbi-primary mr-4">Power BI</span>
        <span className="mr-4 text-gray-700">Home</span>
      </div>
      
      <div className="flex items-center flex-1 justify-center max-w-lg">
        <div className="relative w-full">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-8 pr-4 py-1.5 border rounded-md text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-xs text-gray-600 flex flex-col items-end">
          <div>Trial:</div>
          <div>59 days left</div>
        </div>
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
        </button>
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
          <Settings size={20} />
        </button>
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
          <Download size={20} />
        </button>
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
          <HelpCircle size={20} />
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
          <User size={16} />
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
