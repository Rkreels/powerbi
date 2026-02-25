import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Users, LayoutGrid, MoreVertical, Edit, Trash2, Share2, Copy, BarChart2, Layout } from 'lucide-react';
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
  recentItems, activeTab, setActiveTab, searchQuery, onItemsChange
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
      toast({ title: "Deleted", description: `${item.title} has been deleted` });
    }
  };

  const handleEdit = (item: RecentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'report') navigate(`/report/${item.id}`);
    else navigate('/dashboard');
  };

  const handleShare = (item: RecentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/${item.type}/${item.id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied", description: `Link to "${item.title}" copied to clipboard` });
  };

  const handleDuplicate = (item: RecentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'report') {
      const original = dataService.getReports().find(r => r.id === item.id);
      if (original) {
        dataService.createReport({ ...original, name: `${original.name} (Copy)`, isPublished: false });
        onItemsChange();
        toast({ title: "Duplicated", description: `Copy of "${item.title}" created` });
      }
    } else {
      const original = dataService.getDashboards().find(d => d.id === item.id);
      if (original) {
        dataService.createDashboard({ ...original, name: `${original.name} (Copy)` });
        onItemsChange();
        toast({ title: "Duplicated", description: `Copy of "${item.title}" created` });
      }
    }
  };

  // Get favorites (reports that are published)
  const favoriteItems = dataService.getReports()
    .filter(r => r.isPublished)
    .map(r => ({ id: r.id, title: r.name, lastModified: r.modified, owner: r.owner, type: 'report' as const }));

  // Get shared items
  const sharedItems = dataService.getDashboards()
    .map(d => ({ id: d.id, title: d.name, lastModified: d.modified, owner: d.owner, type: 'dashboard' as const }));

  const getActiveItems = () => {
    switch (activeTab) {
      case 'recent': return recentItems;
      case 'favorites': return favoriteItems;
      case 'apps': return sharedItems;
      case 'external': return [];
      default: return recentItems;
    }
  };

  const activeItems = getActiveItems();

  const filteredItems = activeItems.filter(item =>
    item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.owner.toLowerCase().includes(filterQuery.toLowerCase())
  );
  
  const tabs = [
    { key: 'recent', label: 'Recent', icon: Clock },
    { key: 'favorites', label: 'Favorites', icon: Star },
    { key: 'apps', label: 'Dashboards', icon: LayoutGrid },
    { key: 'external', label: 'Shared', icon: Users },
  ];

  return (
    <>
      <div className="mb-4 border-b">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map(tab => (
            <button 
              key={tab.key}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon size={14} className="inline mr-1" />
              {tab.label}
              {tab.key === 'recent' && recentItems.length > 0 && (
                <span className="ml-1 text-xs text-gray-400">({recentItems.length})</span>
              )}
              {tab.key === 'favorites' && favoriteItems.length > 0 && (
                <span className="ml-1 text-xs text-gray-400">({favoriteItems.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter by keyword" 
            className="w-full pl-8 pr-4 py-1.5 border rounded-md text-sm"
          />
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 mx-auto w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            {activeTab === 'favorites' ? <Star size={36} className="text-yellow-400" /> : 
             activeTab === 'external' ? <Users size={36} className="text-yellow-400" /> :
             <Clock size={36} className="text-yellow-400" />}
          </div>
          <h2 className="text-lg font-semibold mb-2">
            {activeTab === 'recent' ? 'No recent content' :
             activeTab === 'favorites' ? 'No favorites yet' :
             activeTab === 'apps' ? 'No dashboards' :
             'No shared content'}
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            {activeTab === 'recent' ? 'Open a report or dashboard to see it here.' :
             activeTab === 'favorites' ? 'Publish reports to mark them as favorites.' :
             activeTab === 'apps' ? 'Create a dashboard to see it here.' :
             'No externally shared content available.'}
          </p>
          {activeTab === 'recent' && (
            <Button className="mt-4" onClick={() => navigate('/report')}>Create a Report</Button>
          )}
        </div>
      ) : (
        <div>
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="border-b py-3 flex items-center hover:bg-gray-50 px-3 cursor-pointer group transition-colors"
              onClick={() => {
                if (item.type === 'report') navigate(`/report/${item.id}`);
                else navigate('/dashboard');
              }}
            >
              <div className={`w-10 h-10 mr-4 rounded flex items-center justify-center text-white ${
                item.type === 'report' ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                {item.type === 'report' ? <BarChart2 size={18} /> : <Layout size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.title}</h3>
                <div className="text-xs text-gray-600">
                  {new Date(item.lastModified).toLocaleDateString()} • {item.owner}
                </div>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={(e) => handleShare(item, e)} className="p-1.5 h-auto text-gray-400 hover:text-blue-600">
                  <Share2 size={16} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()} className="p-1.5 h-auto text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => handleEdit(item, e)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleDuplicate(item, e)}>
                      <Copy size={16} className="mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleShare(item, e)}>
                      <Share2 size={16} className="mr-2" /> Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleDelete(item, e)} className="text-red-600">
                      <Trash2 size={16} className="mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RecentContent;
