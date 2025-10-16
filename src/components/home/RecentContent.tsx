
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Users, LayoutGrid, MoreVertical, Edit, Trash2, Share2 } from 'lucide-react';
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type RecentItem = {
  id: string;
  title: string;
  lastModified: string;
  owner: string;
  type: 'report' | 'dashboard';
};

interface RecentContentProps {
  recentItems: RecentItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  onItemsChange: () => void;
}

const RecentContent: React.FC<RecentContentProps> = ({ 
  recentItems, 
  activeTab, 
  setActiveTab, 
  searchQuery,
  onItemsChange
}) => {
  const navigate = useNavigate();
  const [filterQuery, setFilterQuery] = useState('');

  const handleDelete = (item: RecentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = item.type === 'report' 
      ? dataService.deleteReport(item.id)
      : dataService.deleteDashboard(item.id);
    
    if (success) {
      onItemsChange();
      toast({
        title: "Deleted",
        description: `${item.title} has been deleted`,
      });
    }
  };

  const handleEdit = (item: RecentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'report') {
      navigate(`/report/${item.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleShare = (item: RecentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this ${item.type}: ${item.title}`,
        url: window.location.href
      }).catch(() => {
        toast({
          title: "Shared",
          description: `${item.title} shared successfully`,
        });
      });
    } else {
      toast({
        title: "Shared",
        description: `${item.title} shared successfully`,
      });
    }
  };

  const filteredItems = recentItems.filter(item =>
    item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.owner.toLowerCase().includes(filterQuery.toLowerCase())
  );
  
  return (
    <>
      <div className="mb-4 border-b">
        <div className="flex space-x-1">
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'recent' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('recent')}
          >
            <Clock size={14} className="inline mr-1" />
            Recent
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'favorites' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Star size={14} className="inline mr-1" />
            Favorites
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'apps' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('apps')}
          >
            <LayoutGrid size={14} className="inline mr-1" />
            My apps
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'external' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('external')}
          >
            <Users size={14} className="inline mr-1" />
            From external orgs
          </button>
        </div>
      </div>
      
      {/* Filter bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter by keyword" 
            className="w-full pl-8 pr-4 py-1.5 border rounded-md text-sm"
          />
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={() => toast({ title: "Filter", description: "Advanced filters coming soon" })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
          </svg>
          Filter
        </Button>
      </div>
      
      {/* No content message or list of items */}
      {activeTab === 'recent' && filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
              <path d="M21.5 12H16c-.7 2-2.8 4-5 4s-4.3-2-5-4H.5"></path>
              <path d="M3 9l2 6h14l2-6"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Find recently opened content here</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Once you've opened some Power BI content, come back to Recents to find it again easily.
          </p>
        </div>
      ) : activeTab === 'recent' && (
        <div>
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="border-b py-3 flex items-center hover:bg-gray-50 px-3 cursor-pointer group"
              onClick={() => {
                if (item.type === 'report') {
                  navigate(`/report/${item.id}`);
                } else {
                  navigate('/dashboard');
                }
              }}
            >
              <div className="w-10 h-10 mr-4 rounded bg-powerbi-primary flex items-center justify-center text-white">
                {item.type === 'report' ? 'R' : 'D'}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <div className="text-xs text-gray-600">
                  Modified {new Date(item.lastModified).toLocaleDateString()} • {item.owner}
                </div>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleShare(item, e)}
                  className="p-1.5 h-auto text-gray-400 hover:text-blue-600"
                >
                  <Share2 size={16} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 h-auto text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => handleEdit(item, e)}>
                      <Edit size={16} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => handleDelete(item, e)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {(activeTab !== 'recent' || (activeTab === 'recent' && recentItems.length === 0 && searchQuery)) && (
        <div className="text-center py-16">
          <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
              <path d="M21.5 12H16c-.7 2-2.8 4-5 4s-4.3-2-5-4H.5"></path>
              <path d="M3 9l2 6h14l2-6"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No content found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            There's no content to show in this section right now.
          </p>
        </div>
      )}
    </>
  );
};

export default RecentContent;
