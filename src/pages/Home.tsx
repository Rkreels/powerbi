
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import ModernSidebar from '../components/navigation/ModernSidebar';
import TopHeader from '../components/home/TopHeader';
import NewReportButton from '../components/home/NewReportButton';
import RecommendedItems from '../components/home/RecommendedItems';
import RecentContent from '../components/home/RecentContent';
import CreateReportDialog from '../components/home/CreateReportDialog';
import CompactSidebar from '../components/navigation/CompactSidebar';
import { useCollapsibleSidebar } from '../hooks/useCollapsibleSidebar';
import SidebarToggle from '../components/navigation/SidebarToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import VerticalSidebar from '../components/navigation/VerticalSidebar';
import { RecommendedItem, RecentItem } from '../types/home';

const Home = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isCollapsed, toggleSidebar } = useCollapsibleSidebar(false);
  const isMobile = useIsMobile();

  const recommendedItems: RecommendedItem[] = [
    {
      id: 'rec-1',
      title: 'Explore basic Power BI concepts',
      subtitle: 'Getting started with Power BI',
      image: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png',
      type: 'tutorial'
    },
    {
      id: 'rec-2',
      title: 'Explore the 100 most useful productivity tips',
      subtitle: 'Explore this data story',
      image: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png',
      type: 'report'
    },
    {
      id: 'rec-3',
      title: 'Cancer statistics in the USA',
      subtitle: 'Explore this data story',
      image: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png',
      type: 'report'
    },
    {
      id: 'rec-4',
      title: 'Intro—What is Power BI?',
      subtitle: 'Getting started with Power BI',
      image: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png',
      type: 'tutorial'
    }
  ];

  const recentItems: RecentItem[] = [
    {
      id: 'recent-1',
      title: 'Sales Overview',
      lastModified: 'Today at 10:45 AM',
      owner: 'You',
      type: 'report'
    },
    {
      id: 'recent-2',
      title: 'Marketing Analytics',
      lastModified: 'Yesterday at 4:32 PM',
      owner: 'Maria Chen',
      type: 'dashboard'
    },
    {
      id: 'recent-3',
      title: 'Financial Dashboard',
      lastModified: '2 days ago',
      owner: 'You',
      type: 'report'
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-white">
        {/* Vertical sidebar (always visible) */}
        <VerticalSidebar />
        
        {/* Content sidebar and main area */}
        <div className="flex flex-1 overflow-hidden">
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
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopHeader />
            
            {/* Main content area */}
            <div className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <NewReportButton onClick={() => setIsCreateDialogOpen(true)} />
                
                {/* Recommended section */}
                <RecommendedItems items={recommendedItems} />
                
                {/* Recent content tabs */}
                <RecentContent 
                  recentItems={recentItems}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </div>
        </div>
        
        <CreateReportDialog 
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      </div>
    </SidebarProvider>
  );
};

export default Home;
