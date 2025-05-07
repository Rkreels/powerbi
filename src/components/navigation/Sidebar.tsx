
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart2, FileText, Filter, Settings, Database, LayoutDashboard, BookOpen } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart2, label: 'Reports', path: '/report' },
    { icon: BookOpen, label: 'Demo Data', path: '/demo' },
    { icon: Database, label: 'Datasets', path: '/datasets' },
    { icon: Filter, label: 'Data Model', path: '/model' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  
  return (
    <div className="bg-powerbi-nav-bg min-h-screen w-56 text-white">
      <div className="p-4 border-b border-gray-700 mb-4">
        <div className="flex items-center">
          <span className="text-lg font-semibold">Power BI Clone</span>
        </div>
      </div>
      
      <div className="powerbi-scrollbar overflow-y-auto h-[calc(100vh-64px)] pb-20">
        <div className="px-3 mb-6">
          <div className="uppercase text-xs font-semibold text-gray-400 tracking-wider ml-3 mb-2">
            Navigation
          </div>
          <nav>
            {menuItems.map((item, index) => (
              <div 
                key={index}
                className={`powerbi-nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={18} className="mr-3" />
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="px-3">
          <div className="uppercase text-xs font-semibold text-gray-400 tracking-wider ml-3 mb-2">
            Recent
          </div>
          <div className="space-y-1">
            <div className="powerbi-nav-item">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
              <span>Sales Overview</span>
            </div>
            <div className="powerbi-nav-item">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
              <span>Marketing Analytics</span>
            </div>
            <div className="powerbi-nav-item">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></span>
              <span>Financial Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
