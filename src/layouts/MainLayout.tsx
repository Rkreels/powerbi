
import React from 'react';
import ModernSidebar from '../components/navigation/ModernSidebar';
import TopNavbar from '../components/navigation/TopNavbar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCollapsibleSidebar } from '../hooks/useCollapsibleSidebar';
import SidebarToggle from '../components/navigation/SidebarToggle';
import CompactSidebar from '../components/navigation/CompactSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isCollapsed, toggleSidebar } = useCollapsibleSidebar(false);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {isCollapsed ? (
          <CompactSidebar className="relative" />
        ) : (
          <div className="relative">
            <ModernSidebar />
          </div>
        )}
        
        {!isMobile && (
          <SidebarToggle isCollapsed={isCollapsed} onClick={toggleSidebar} />
        )}
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center h-12 bg-white border-b border-gray-200 px-4">
            {isMobile && <SidebarTrigger className="mr-2" />}
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
