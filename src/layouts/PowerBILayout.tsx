
import React from 'react';
import PowerBISidebar from '../components/navigation/PowerBISidebar';
import PowerBITopBar from '../components/navigation/PowerBITopBar';

interface PowerBILayoutProps {
  children: React.ReactNode;
}

const PowerBILayout = ({ children }: PowerBILayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <PowerBISidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PowerBITopBar />
        
        <div className="flex-1 overflow-auto bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PowerBILayout;
