
import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Download, 
  HelpCircle, 
  Settings, 
  User, 
  ChevronDown,
  Plus,
  Upload,
  Share2,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PowerBITopBar = () => {
  const navigate = useNavigate();
  const [notifications] = useState(3);
  
  return (
    <header className="h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
      {/* Left section */}
      <div className="flex items-center">
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-sm text-gray-700 hover:text-blue-600 font-medium">
            <span className="mr-1">Home</span>
          </button>
          <span className="text-gray-300">|</span>
          <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
            <span className="mr-1">My workspace</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
      
      {/* Center - Search */}
      <div className="flex items-center flex-1 justify-center max-w-lg">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search dashboards, reports, and more..." 
            className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          />
        </div>
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Action buttons */}
        <button 
          className="flex items-center bg-yellow-500 text-white text-xs rounded px-3 py-1.5 hover:bg-yellow-600 transition-colors"
          onClick={() => navigate('/report')}
        >
          <Plus size={14} className="mr-1" />
          <span>Create</span>
        </button>
        
        <button className="flex items-center text-gray-600 text-xs rounded px-2 py-1.5 hover:bg-gray-100 transition-colors">
          <Upload size={14} className="mr-1" />
          <span>Upload</span>
        </button>
        
        <button className="flex items-center text-gray-600 text-xs rounded px-2 py-1.5 hover:bg-gray-100 transition-colors">
          <Share2 size={14} className="mr-1" />
          <span>Share</span>
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        {/* Utility buttons */}
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Filter size={16} />
        </button>
        
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={16} />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
        
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Settings size={16} />
        </button>
        
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Download size={16} />
        </button>
        
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <HelpCircle size={16} />
        </button>
        
        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        {/* User section */}
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-600 text-right">
            <div className="font-medium">Free trial</div>
            <div className="text-gray-500">59 days left</div>
          </div>
          
          <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            <User size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default PowerBITopBar;
