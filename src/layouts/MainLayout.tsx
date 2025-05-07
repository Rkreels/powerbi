
import React from 'react';
import ModernSidebar from '../components/navigation/ModernSidebar';
import TopNavbar from '../components/navigation/TopNavbar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ModernSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center h-12 bg-white border-b border-gray-200 px-4">
            <SidebarTrigger className="mr-2" />
            <TopNavbar />
          </div>
          <div className="flex flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
