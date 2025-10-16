import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Plus, FileSearch, Layout, BarChart2, User, Grid3X3, ChevronDown,
  Star, Users, Clock, Settings, HelpCircle, Search, Filter, MoreHorizontal,
  Menu, X, FolderOpen, Building2, UserPlus, Shield, Share2, Edit, Trash2,
  Database, Download, Upload, Bell, Globe, TrendingUp, Zap, BookOpen
} from 'lucide-react';
import { CreateWorkspaceDialog } from '@/components/dialogs/CreateWorkspaceDialog';
import { CreateDatasetDialog } from '@/components/dialogs/CreateDatasetDialog';
import { WorkspaceSettingsDialog } from '@/components/dialogs/WorkspaceSettingsDialog';
import { dataService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const EnhancedPowerBISidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWorkspace, setSelectedWorkspace] = useState('My workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isExtendedMenuOpen, setIsExtendedMenuOpen] = useState(false);
  const [isBrowseSidebarOpen, setIsBrowseSidebarOpen] = useState(false);
  const [isWorkspaceSidebarOpen, setIsWorkspaceSidebarOpen] = useState(false);
  const [contentFilter, setContentFilter] = useState('all');
  const [workspaces, setWorkspaces] = useState(dataService.getWorkspaces());
  const [allContent, setAllContent] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  
  const isActive = (path: string) => location.pathname === path;

  // Load all content and initialize data
  useEffect(() => {
    loadAllContent();
    loadRecentItems();
    loadFavoriteItems();
  }, []);

  const loadAllContent = () => {
    const reports = dataService.getReports().map(r => ({
      id: r.id,
      title: r.name,
      type: 'report' as const,
      workspace: r.workspace,
      lastModified: new Date(r.modified).toLocaleDateString(),
      owner: r.owner,
      isShared: Math.random() > 0.5,
      isFavorite: favoriteItems.some(f => f.id === r.id)
    }));

    const dashboards = dataService.getDashboards().map(d => ({
      id: d.id,
      title: d.name,
      type: 'dashboard' as const,
      workspace: d.workspace,
      lastModified: new Date(d.modified).toLocaleDateString(),
      owner: d.owner,
      isShared: Math.random() > 0.5,
      isFavorite: favoriteItems.some(f => f.id === d.id)
    }));

    const datasets = dataService.getDatasets().map(d => ({
      id: d.id,
      title: d.name,
      type: 'dataset' as const,
      workspace: 'My Workspace', // datasets don't have workspace in schema
      lastModified: new Date(d.modified).toLocaleDateString(),
      owner: d.owner,
      isShared: Math.random() > 0.5,
      isFavorite: favoriteItems.some(f => f.id === d.id)
    }));

    setAllContent([...reports, ...dashboards, ...datasets]);
  };

  const loadRecentItems = () => {
    // Simulate recent items from local storage or service
    const recent = allContent.slice(0, 5);
    setRecentItems(recent);
  };

  const loadFavoriteItems = () => {
    // Load favorites from service or local storage
    const favorites = allContent.filter(item => item.isFavorite);
    setFavoriteItems(favorites);
  };

  // Enhanced search functionality
  const performGlobalSearch = (query: string) => {
    if (!query.trim()) return;
    
    const results = allContent.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.owner.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    );

    toast({
      title: "Search Results",
      description: `Found ${results.length} items matching "${query}"`,
    });
    
    // In real app, this would show search results page
    setIsBrowseSidebarOpen(true);
    setSearchQuery(query);
  };

  // Filter content with advanced options
  const filteredContent = allContent.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = contentFilter === 'all' || item.type === contentFilter;
    const matchesWorkspace = selectedWorkspace === 'My workspace' || item.workspace === selectedWorkspace;
    return matchesSearch && matchesFilter && matchesWorkspace;
  });

  // Advanced workspace management
  const handleWorkspaceSwitch = (workspaceName: string) => {
    setSelectedWorkspace(workspaceName);
    loadAllContent(); // Reload content for new workspace
    toast({
      title: "Workspace Switched",
      description: `Now viewing ${workspaceName}`,
    });
  };

  const handleContentAction = (item: any, action: string) => {
    switch (action) {
      case 'open':
        if (item.type === 'report') navigate(`/report/${item.id}`);
        else if (item.type === 'dashboard') navigate('/dashboard');
        else if (item.type === 'dataset') navigate('/datasets');
        break;
      case 'edit':
        if (item.type === 'report') navigate(`/report/${item.id}`);
        else if (item.type === 'dashboard') navigate('/dashboard');
        break;
      case 'share':
        const shareUrl = `${window.location.origin}/${item.type}/${item.id}`;
        if (navigator.share) {
          navigator.share({
            title: item.title,
            text: `Check out this ${item.type}: ${item.title}`,
            url: shareUrl
          }).catch(() => {
            navigator.clipboard.writeText(shareUrl);
            toast({
              title: "Share Link Copied",
              description: `Link to ${item.title} copied to clipboard`,
            });
          });
        } else {
          navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Share Link Copied",
            description: `Link to ${item.title} copied to clipboard`,
          });
        }
        break;
      case 'favorite':
        const newFavorites = item.isFavorite 
          ? favoriteItems.filter(f => f.id !== item.id)
          : [...favoriteItems, item];
        setFavoriteItems(newFavorites);
        item.isFavorite = !item.isFavorite;
        toast({
          title: item.isFavorite ? "Added to Favorites" : "Removed from Favorites",
          description: item.title,
        });
        break;
      case 'delete':
        if (item.type === 'report') dataService.deleteReport(item.id);
        else if (item.type === 'dashboard') dataService.deleteDashboard(item.id);
        else if (item.type === 'dataset') dataService.deleteDataset(item.id);
        
        setAllContent(prev => prev.filter(c => c.id !== item.id));
        toast({
          title: "Deleted",
          description: `${item.title} has been deleted`,
        });
        break;
      case 'duplicate':
        if (item.type === 'report') {
          const original = dataService.getReports().find(r => r.id === item.id);
          if (original) {
            dataService.createReport({
              ...original,
              name: `${original.name} (Copy)`,
              isPublished: false
            });
          }
        } else if (item.type === 'dashboard') {
          const original = dataService.getDashboards().find(d => d.id === item.id);
          if (original) {
            dataService.createDashboard({
              ...original,
              name: `${original.name} (Copy)`
            });
          }
        }
        
        toast({
          title: "Duplicated",
          description: `Created copy of ${item.title}`,
        });
        loadAllContent();
        break;
    }
  };

  const handleQuickActions = (action: string) => {
    switch (action) {
      case 'create-report':
        navigate('/report');
        break;
      case 'create-dashboard':
        navigate('/dashboard');
        break;
      case 'upload-data':
        // Trigger file upload
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv,.json,.pbix';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            toast({
              title: "File Upload Started",
              description: `Uploading ${file.name}...`,
            });
            // Simulate upload progress
            setTimeout(() => {
              dataService.createDataset({
                name: file.name.replace(/\.[^/.]+$/, ""),
                description: `Uploaded from ${file.name}`,
                source: 'File Upload',
                owner: 'Current User',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                status: 'active'
              });
              toast({
                title: "Upload Complete",
                description: `${file.name} uploaded successfully`,
              });
              loadAllContent();
            }, 2000);
          }
        };
        input.click();
        break;
      case 'browse-gallery':
        window.open('https://community.powerbi.com/t5/Data-Stories-Gallery/bd-p/DataStoriesGallery', '_blank');
        break;
      case 'learning-path':
        navigate('/demo');
        break;
    }
  };

  // Content type counts for badges
  const contentCounts = {
    all: allContent.length,
    reports: allContent.filter(item => item.type === 'report').length,
    dashboards: allContent.filter(item => item.type === 'dashboard').length,
    datasets: allContent.filter(item => item.type === 'dataset').length
  };

  return (
    <div className="flex h-screen">
      {/* Left Navigation Bar */}
      <div className="bg-white border-r border-gray-200 w-16 min-h-screen flex flex-col items-center shadow-sm relative">
        {/* Logo with Extended Menu Toggle */}
        <div className="p-3 flex justify-center relative">
          <Button 
            onClick={() => setIsExtendedMenuOpen(!isExtendedMenuOpen)}
            className="w-9 h-9 bg-yellow-500 rounded-sm hover:bg-yellow-600 p-0"
          >
            {isExtendedMenuOpen ? <X size={20} /> : <Grid3X3 size={20} />}
          </Button>

          {/* Extended Menu Popup */}
          {isExtendedMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Zap className="mr-2 text-yellow-600" size={18} />
                  Power BI Service
                </h3>
                <p className="text-sm text-gray-600 mt-1">Quick access to all features</p>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-3 flex flex-col items-start"
                    onClick={() => handleQuickActions('create-report')}
                  >
                    <BarChart2 size={20} className="mb-2 text-green-600" />
                    <span className="text-sm font-medium">Create Report</span>
                    <span className="text-xs text-gray-500">Build new report</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-3 flex flex-col items-start"
                    onClick={() => handleQuickActions('create-dashboard')}
                  >
                    <Layout size={20} className="mb-2 text-blue-600" />
                    <span className="text-sm font-medium">Create Dashboard</span>
                    <span className="text-xs text-gray-500">New dashboard</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-3 flex flex-col items-start"
                    onClick={() => handleQuickActions('upload-data')}
                  >
                    <Upload size={20} className="mb-2 text-purple-600" />
                    <span className="text-sm font-medium">Upload Data</span>
                    <span className="text-xs text-gray-500">Import files</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-3 flex flex-col items-start"
                    onClick={() => handleQuickActions('browse-gallery')}
                  >
                    <Globe size={20} className="mb-2 text-orange-600" />
                    <span className="text-sm font-medium">Browse Gallery</span>
                    <span className="text-xs text-gray-500">Community content</span>
                  </Button>
                </div>
                
                <Separator className="my-3" />
                
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => { navigate('/'); setIsExtendedMenuOpen(false); }}
                  >
                    <Home size={16} className="mr-3" />
                    Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => { navigate('/demo'); setIsExtendedMenuOpen(false); }}
                  >
                    <BookOpen size={16} className="mr-3" />
                    Learning Center
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => { navigate('/settings'); setIsExtendedMenuOpen(false); }}
                  >
                    <Settings size={16} className="mr-3" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Nav items with enhanced functionality */}
        <nav className="flex flex-col items-center w-full">
          <NavItem 
            icon={Home} 
            label="Home" 
            isActive={isActive('/')} 
            onClick={() => navigate('/')} 
          />
          <NavItem 
            icon={Plus} 
            label="Create" 
            onClick={() => navigate('/report')} 
            badge={workspaces.filter(w => w.members > 1).length}
          />
          <NavItem 
            icon={FileSearch} 
            label="Browse" 
            isActive={isBrowseSidebarOpen}
            onClick={() => {
              setIsBrowseSidebarOpen(!isBrowseSidebarOpen);
              setIsWorkspaceSidebarOpen(false);
            }} 
            badge={contentCounts.all}
          />
          <NavItem 
            icon={Layout} 
            label="Workspaces" 
            isActive={isWorkspaceSidebarOpen}
            onClick={() => {
              setIsWorkspaceSidebarOpen(!isWorkspaceSidebarOpen);
              setIsBrowseSidebarOpen(false);
            }} 
            badge={workspaces.length}
          />
          <NavItem 
            icon={TrendingUp} 
            label="Learn" 
            onClick={() => navigate('/demo')} 
          />
        </nav>
        
        {/* Bottom section */}
        <div className="mt-auto mb-4 flex flex-col items-center w-full">
          <NavItem 
            icon={Bell} 
            label="Notifications" 
            onClick={() => toast({ title: "Notifications", description: "No new notifications" })} 
            badge={3}
          />
          <NavItem 
            icon={Settings} 
            label="Settings" 
            isActive={isActive('/settings')}
            onClick={() => navigate('/settings')} 
          />
          <NavItem 
            icon={HelpCircle} 
            label="Help" 
            onClick={() => navigate('/demo')} 
          />
          <div className="mt-2">
            <NavItem 
              icon={User} 
              label="Profile" 
              onClick={() => toast({ title: "Profile", description: "User profile coming soon" })} 
            />
          </div>
        </div>

        {/* Overlay to close extended menu */}
        {isExtendedMenuOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsExtendedMenuOpen(false)}
          />
        )}
      </div>

      {/* Enhanced Browse Content Sidebar */}
      {isBrowseSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50" 
            onClick={() => setIsBrowseSidebarOpen(false)}
          />
          
          <div className="fixed left-16 top-0 w-80 h-full bg-white border-r border-gray-200 flex flex-col z-50 shadow-xl">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <FileSearch className="mr-2 text-blue-600" size={20} />
                  Browse Content
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsBrowseSidebarOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search all content..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && performGlobalSearch(searchQuery)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {/* Content filters with counts */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium mb-3 text-gray-700">Content Types</h3>
                <div className="space-y-2">
                  {[
                    { key: 'all', label: 'All Content', icon: Grid3X3, count: contentCounts.all },
                    { key: 'report', label: 'Reports', icon: BarChart2, count: contentCounts.reports },
                    { key: 'dashboard', label: 'Dashboards', icon: Layout, count: contentCounts.dashboards },
                    { key: 'dataset', label: 'Datasets', icon: Database, count: contentCounts.datasets }
                  ].map(({ key, label, icon: Icon, count }) => (
                    <Button
                      key={key}
                      variant={contentFilter === key ? "secondary" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setContentFilter(key)}
                    >
                      <span className="flex items-center">
                        <Icon size={16} className="mr-2" />
                        {label}
                      </span>
                      <Badge variant="outline">{count}</Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content list */}
              <div className="p-4">
                {filteredContent.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileSearch size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No content found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredContent.map((item) => (
                      <ContentItem
                        key={item.id}
                        item={item}
                        onAction={(action) => handleContentAction(item, action)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {/* Enhanced Workspace Sidebar */}
      {isWorkspaceSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50" 
            onClick={() => setIsWorkspaceSidebarOpen(false)}
          />
          
          <div className="fixed left-16 top-0 w-80 h-full bg-white border-r border-gray-200 flex flex-col z-50 shadow-xl">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <Building2 className="mr-2 text-green-600" size={20} />
                  Workspaces
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsWorkspaceSidebarOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              
              <CreateWorkspaceDialog 
                trigger={
                  <Button className="w-full">
                    <Plus size={16} className="mr-2" />
                    Create Workspace
                  </Button>
                }
              />
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4">
                <div className="space-y-2">
                  {workspaces.map((workspace) => (
                    <WorkspaceItem
                      key={workspace.id}
                      workspace={workspace}
                      isActive={selectedWorkspace === workspace.name}
                      onClick={() => handleWorkspaceSwitch(workspace.name)}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};

// Enhanced NavItem component
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false, onClick, badge }) => {
  return (
    <Button
      variant="ghost"
      className={`w-full h-16 flex flex-col items-center justify-center text-xs group relative p-2 ${
        isActive 
          ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Icon size={20} className="mb-1" />
        {badge && badge > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[8px] bg-red-500 text-white rounded-full flex items-center justify-center">
            {badge > 99 ? '99+' : badge}
          </Badge>
        )}
      </div>
      <span className="text-[10px] leading-tight">{label}</span>
      
      {/* Enhanced Tooltip */}
      <div className="absolute left-16 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </Button>
  );
};

// Enhanced ContentItem component
interface ContentItemProps {
  item: any;
  onAction: (action: string) => void;
}

const ContentItem: React.FC<ContentItemProps> = ({ item, onAction }) => {
  const getTypeIcon = () => {
    switch (item.type) {
      case 'report': return <BarChart2 size={16} className="text-green-600" />;
      case 'dashboard': return <Layout size={16} className="text-blue-600" />;
      case 'dataset': return <Database size={16} className="text-orange-600" />;
    }
  };

  return (
    <div className="p-3 hover:bg-gray-50 cursor-pointer group border rounded-lg">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center flex-1 min-w-0"
          onClick={() => onAction('open')}
        >
          {getTypeIcon()}
          <div className="ml-3 flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{item.title}</div>
            <div className="text-xs text-gray-500 flex items-center">
              <span>{item.lastModified} • {item.owner}</span>
              {item.isShared && <Users size={12} className="ml-2" />}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('favorite')}
            className="p-1.5 h-auto"
          >
            <Star size={14} className={item.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('share')}
            className="p-1.5 h-auto"
          >
            <Share2 size={14} className="text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction('edit')}
            className="p-1.5 h-auto"
          >
            <Edit size={14} className="text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Enhanced WorkspaceItem component
interface WorkspaceItemProps {
  workspace: any;
  isActive: boolean;
  onClick: () => void;
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({ workspace, isActive, onClick }) => (
  <div 
    className={`p-3 cursor-pointer hover:bg-gray-50 border rounded-lg flex items-center justify-between ${
      isActive ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center flex-1">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-sm font-medium mr-3">
        {workspace.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{workspace.name}</div>
        <div className="text-xs text-gray-500">{workspace.role} • {workspace.members} members</div>
      </div>
    </div>
    
    <div className="flex items-center space-x-1">
      {workspace.hasUpdates && (
        <Badge variant="secondary" className="h-2 w-2 p-0 bg-blue-500" />
      )}
      <WorkspaceSettingsDialog
        workspaceName={workspace.name}
        trigger={
          <Button variant="ghost" size="sm" className="p-1.5 h-auto opacity-0 group-hover:opacity-100">
            <Settings size={14} />
          </Button>
        }
      />
    </div>
  </div>
);

export default EnhancedPowerBISidebar;