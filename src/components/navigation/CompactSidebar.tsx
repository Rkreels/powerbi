
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
    <div className={`bg-powerbi-nav-bg min-h-screen w-16 flex flex-col items-center py-4 ${className}`}>
      {/* Logo */}
      <div className="mb-8 p-2">
        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
          <span className="text-powerbi-primary text-lg font-bold">PB</span>
        </div>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex flex-col items-center space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-10 h-10 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors ${
              isActive(item.path) ? 'bg-gray-700 text-white' : 'text-gray-300'
            }`}
            title={item.label}
            aria-label={item.label}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CompactSidebar;
