
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, PlusCircle, FileSearch, Layout, Calendar, BarChart, Settings } from 'lucide-react';

const HomeSidebar = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white border-r border-gray-200 w-16 flex flex-col items-center">
      {/* Menu button */}
      <button className="p-4 hover:bg-gray-100 w-full flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18M3 6h18M3 18h18"></path>
        </svg>
      </button>
      
      {/* Nav items */}
      <nav className="flex flex-col items-center w-full">
        <NavItem icon={Home} label="Home" isActive={true} onClick={() => navigate('/')} />
        <NavItem icon={PlusCircle} label="Create" onClick={() => navigate('/dashboard')} />
        <NavItem icon={FileSearch} label="Browse" onClick={() => navigate('/datasets')} />
        <NavItem icon={Layout} label="Workspaces" onClick={() => {}} />
        <NavItem icon={BarChart} label="Learning" onClick={() => navigate('/demo')} />
      </nav>
      
      {/* Bottom section */}
      <div className="mt-auto mb-4 flex flex-col items-center w-full">
        <NavItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
        
        <div className="pt-4 w-10 h-10 flex items-center justify-center">
          <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center text-white font-bold text-sm">
            PB
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, isActive = false, onClick }: NavItemProps) => {
  return (
    <button 
      className={`w-full py-3 flex flex-col items-center justify-center text-xs ${
        isActive ? 'text-powerbi-primary border-l-4 border-powerbi-primary' : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <Icon size={20} className="mb-1" />
      <span>{label}</span>
    </button>
  );
};

export default HomeSidebar;
