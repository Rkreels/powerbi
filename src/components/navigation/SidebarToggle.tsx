
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onClick: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isCollapsed, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="absolute -right-3 top-12 z-20 bg-white border border-gray-200 rounded-full p-1 shadow-md"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <ChevronRight size={16} />
      ) : (
        <ChevronLeft size={16} />
      )}
    </button>
  );
};

export default SidebarToggle;
