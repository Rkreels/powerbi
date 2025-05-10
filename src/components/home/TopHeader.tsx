
import React from 'react';
import { Search, Settings, Download } from 'lucide-react';

const TopHeader: React.FC = () => {
  return (
    <header className="h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-lg font-semibold text-powerbi-primary mr-4">Power BI</span>
        <span className="mr-4 text-gray-700">Home</span>
      </div>
      
      <div className="flex items-center">
        <div className="relative mr-4 w-64">
          <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-8 pr-4 py-1.5 border rounded-md text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-600">
            <div>Trial:</div>
            <div>59 days left</div>
          </div>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
            <Settings size={20} />
          </button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
            <Download size={20} />
          </button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
