
import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  BarChart2, 
  Settings, 
  Users, 
  HelpCircle, 
  MessageSquare 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="flex flex-col w-14 bg-powerbi-nav-bg border-r border-gray-700 overflow-hidden transition-all duration-300 hover:w-48 group">
      <div className="flex flex-col h-full">
        {/* Microsoft Power BI Logo */}
        <div className="flex items-center h-14 px-3 border-b border-gray-700">
          <div className="flex items-center justify-center w-8 h-8 bg-powerbi-primary rounded">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
              <path 
                fill="currentColor" 
                d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" 
              />
            </svg>
          </div>
          <span className="ml-3 font-semibold text-white opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
            Power BI
          </span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex flex-col py-2 flex-1 overflow-y-auto powerbi-scrollbar">
          <NavItem icon={<LayoutDashboard size={18} />} label="Home" active />
          <NavItem icon={<Database size={18} />} label="Data" />
          <NavItem icon={<BarChart2 size={18} />} label="Reports" />
          <NavItem icon={<Users size={18} />} label="Workspaces" />
        </nav>
        
        {/* Bottom Navigation Links */}
        <div className="mt-auto border-t border-gray-700 py-2">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<HelpCircle size={18} />} label="Help" />
          <NavItem icon={<MessageSquare size={18} />} label="Feedback" />
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active }: NavItemProps) => {
  return (
    <a 
      href="#" 
      className={`powerbi-nav-item ${active ? 'active' : ''}`}
    >
      <span className="w-6 h-6 flex items-center justify-center">
        {icon}
      </span>
      <span className="ml-3 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
        {label}
      </span>
    </a>
  );
};

export default Sidebar;
