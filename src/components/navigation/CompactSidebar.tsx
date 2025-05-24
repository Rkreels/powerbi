
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart2,
  Settings,
  Database,
  LayoutDashboard,
  BookOpen,
} from 'lucide-react';

interface CompactSidebarProps {
  className?: string;
}

const CompactSidebar: React.FC<CompactSidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart2, label: 'Reports', path: '/report' },
    { icon: BookOpen, label: 'Demo', path: '/demo' },
    { icon: Database, label: 'Datasets', path: '/datasets' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  
  return (
    <div className={`bg-gray-50 min-h-screen w-12 flex flex-col items-center py-2 border-r border-gray-200 ${className}`}>
      {/* Navigation Items */}
      <nav className="flex flex-col items-center space-y-1 mt-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-10 h-10 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors group relative ${
              isActive(item.path) ? 'bg-blue-100 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
            }`}
            title={item.label}
            aria-label={item.label}
          >
            <item.icon size={18} />
            
            {/* Tooltip */}
            <div className="absolute left-12 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CompactSidebar;
