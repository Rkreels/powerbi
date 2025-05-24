
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, FileSearch, Layout, BarChart2, User, Grid3X3 } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, isActive = false, onClick }: NavItemProps) => {
  return (
    <button 
      className={`w-full py-3 flex flex-col items-center justify-center text-xs group relative ${
        isActive 
          ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
      onClick={onClick}
    >
      <Icon size={20} className="mb-1" />
      <span className="text-[10px] leading-tight">{label}</span>
      
      {/* Tooltip for better UX */}
      <div className="absolute left-16 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
};

const VerticalSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="bg-white border-r border-gray-200 w-16 min-h-screen flex flex-col items-center shadow-sm">
      {/* Logo */}
      <div className="p-3 flex justify-center">
        <div className="w-9 h-9 bg-yellow-500 rounded-sm flex items-center justify-center">
          <Grid3X3 size={20} className="text-white" />
        </div>
      </div>
      
      {/* Nav items */}
      <nav className="flex flex-col items-center w-full">
        <NavItem icon={Home} label="Home" isActive={location.pathname === '/'} onClick={() => navigate('/')} />
        <NavItem icon={Plus} label="Create" onClick={() => navigate('/report')} />
        <NavItem icon={FileSearch} label="Browse" onClick={() => navigate('/datasets')} />
        <NavItem icon={Layout} label="Workspaces" onClick={() => navigate('/dashboard')} />
        <NavItem icon={BarChart2} label="Learn" onClick={() => navigate('/demo')} />
      </nav>
      
      {/* Bottom section */}
      <div className="mt-auto mb-4 flex flex-col items-center w-full">
        <NavItem icon={User} label="My workspace" onClick={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

export default VerticalSidebar;
