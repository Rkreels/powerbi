
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, FileSearch, Layout, BarChart2, User } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, isActive = false, onClick }: NavItemProps) => {
  return (
    <button 
      className={`w-full py-2.5 flex flex-col items-center justify-center text-xs ${
        isActive ? 'text-powerbi-primary border-l-4 border-powerbi-primary' : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <Icon size={20} className="mb-1" />
      <span>{label}</span>
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
      <div className="p-4 flex justify-center">
        <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center">
          <span className="text-white font-bold text-sm">PB</span>
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
        <NavItem icon={User} label="My workspace" onClick={() => {}} />
      </div>
    </div>
  );
};

export default VerticalSidebar;
