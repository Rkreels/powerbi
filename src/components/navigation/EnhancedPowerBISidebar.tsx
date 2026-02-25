import React, { useState, useEffect, useCallback } from 'react';
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
import { NotificationsDialog } from '@/components/dialogs/NotificationsDialog';
import { dataService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const EnhancedPowerBISidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWorkspace, setSelectedWorkspace] = useState('My Workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isExtendedMenuOpen, setIsExtendedMenuOpen] = useState(false);
  const [isBrowseSidebarOpen, setIsBrowseSidebarOpen] = useState(false);
  const [isWorkspaceSidebarOpen, setIsWorkspaceSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [contentFilter, setContentFilter] = useState('all');
  const [workspaces, setWorkspaces] = useState(() => dataService.getWorkspaces());
  const [allContent, setAllContent] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [notificationCount, setNotificationCount] = useState(0);
  
  const isActive = (path: string) => location.pathname === path;

  const loadAllContent = useCallback(() => {
    const reports = dataService.getReports().map(r => ({
      id: r.id,
      title: r.name,
      type: 'report' as const,
      workspace: r.workspace,
      lastModified: new Date(r.modified).toLocaleDateString(),
      owner: r.owner,
      isShared: r.isPublished,
      isFavorite: favoriteIds.has(r.id)
    }));

    const dashboards = dataService.getDashboards().map(d => ({
      id: d.id,
      title: d.name,
      type: 'dashboard' as const,
      workspace: d.workspace,
      lastModified: new Date(d.modified).toLocaleDateString(),
      owner: d.owner,
      isShared: true,
      isFavorite: favoriteIds.has(d.id)
    }));

    const datasets = dataService.getDatasets().map(d => ({
      id: d.id,
      title: d.name,
      type: 'dataset' as const,
      workspace: 'My Workspace',
      lastModified: new Date(d.modified).toLocaleDateString(),
      owner: d.owner,
      isShared: false,
      isFavorite: favoriteIds.has(d.id)
    }));

    setAllContent([...reports, ...dashboards, ...datasets]);
  }, [favoriteIds]);

  useEffect(() => {
    loadAllContent();
    setNotificationCount(dataService.getUnreadNotificationCount());
    setWorkspaces(dataService.getWorkspaces());
  }, [loadAllContent]);

  // Refresh content when navigating
  useEffect(() => {
    loadAllContent();
    setWorkspaces(dataService.getWorkspaces());
  }, [location.pathname, loadAllContent]);

  const filteredContent = allContent.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = contentFilter === 'all' || item.type === contentFilter;
    const matchesWorkspace = selectedWorkspace === 'My Workspace' || item.workspace === selectedWorkspace;
    return matchesSearch && matchesFilter && matchesWorkspace;
  });

  const handleWorkspaceSwitch = (workspaceName: string) => {
    setSelectedWorkspace(workspaceName);
    // Content will auto-filter via filteredContent
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
        setIsBrowseSidebarOpen(false);
        break;
      case 'edit':
        if (item.type === 'report') navigate(`/report/${item.id}`);
        else if (item.type === 'dashboard') navigate('/dashboard');
        setIsBrowseSidebarOpen(false);
        break;
      case 'share':
        const shareUrl = `${window.location.origin}/${item.type}/${item.id}`;
        navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link Copied", description: `Link to "${item.title}" copied to clipboard` });
        break;
      case 'favorite':
        setFavoriteIds(prev => {
          const next = new Set(prev);
          if (next.has(item.id)) next.delete(item.id);
          else next.add(item.id);
          return next;
        });
        toast({
          title: favoriteIds.has(item.id) ? "Removed from Favorites" : "Added to Favorites",
          description: item.title,
        });
        break;
      case 'delete':
        if (item.type === 'report') dataService.deleteReport(item.id);
        else if (item.type === 'dashboard') dataService.deleteDashboard(item.id);
        else if (item.type === 'dataset') dataService.deleteDataset(item.id);
        loadAllContent();
        toast({ title: "Deleted", description: `${item.title} has been deleted` });
        break;
      case 'duplicate':
        if (item.type === 'report') {
          const original = dataService.getReports().find(r => r.id === item.id);
          if (original) {
            dataService.createReport({ ...original, name: `${original.name} (Copy)`, isPublished: false });
          }
        } else if (item.type === 'dashboard') {
          const original = dataService.getDashboards().find(d => d.id === item.id);
          if (original) {
            dataService.createDashboard({ ...original, name: `${original.name} (Copy)` });
          }
        }
        loadAllContent();
        toast({ title: "Duplicated", description: `Created copy of ${item.title}` });
        break;
    }
  };

  const handleQuickActions = (action: string) => {
    setIsExtendedMenuOpen(false);
    switch (action) {
      case 'create-report': navigate('/report'); break;
      case 'create-dashboard': navigate('/dashboard'); break;
      case 'upload-data':
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv,.json,.pbix';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            dataService.createDataset({
              name: file.name.replace(/\.[^/.]+$/, ""),
              description: `Uploaded from ${file.name}`,
              source: 'File Upload',
              owner: 'Current User',
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              status: 'active'
            });
            loadAllContent();
            toast({ title: "Upload Complete", description: `${file.name} uploaded successfully` });
          }
        };
        input.click();
        break;
      case 'browse-gallery':
        navigate('/visualizations');
        break;
      case 'learning-path':
        navigate('/demo');
        break;
    }
  };

  const contentCounts = {
    all: allContent.filter(i => selectedWorkspace === 'My Workspace' || i.workspace === selectedWorkspace).length,
    reports: allContent.filter(i => i.type === 'report' && (selectedWorkspace === 'My Workspace' || i.workspace === selectedWorkspace)).length,
    dashboards: allContent.filter(i => i.type === 'dashboard' && (selectedWorkspace === 'My Workspace' || i.workspace === selectedWorkspace)).length,
    datasets: allContent.filter(i => i.type === 'dataset' && (selectedWorkspace === 'My Workspace' || i.workspace === selectedWorkspace)).length
  };

  return (
    <div className="flex h-screen">
      {/* Left Navigation Bar */}
      <div className="bg-white border-r border-gray-200 w-16 min-h-screen flex flex-col items-center shadow-sm relative">
        <div className="p-3 flex justify-center relative">
          <Button 
            onClick={() => setIsExtendedMenuOpen(!isExtendedMenuOpen)}
            className="w-9 h-9 bg-yellow-500 rounded-sm hover:bg-yellow-600 p-0"
          >
            {isExtendedMenuOpen ? <X size={20} /> : <Grid3X3 size={20} />}
          </Button>

          {isExtendedMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] animate-fade-in">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Zap className="mr-2 text-yellow-600" size={18} />
                  Power BI Service
                </h3>
                <p className="text-sm text-gray-600 mt-1">Quick access to all features</p>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button variant="outline" className="h-auto p-3 flex flex-col items-start" onClick={() => handleQuickActions('create-report')}>
                    <BarChart2 size={20} className="mb-2 text-green-600" />
                    <span className="text-sm font-medium">Create Report</span>
                    <span className="text-xs text-gray-500">Build new report</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-3 flex flex-col items-start" onClick={() => handleQuickActions('create-dashboard')}>
                    <Layout size={20} className="mb-2 text-blue-600" />
                    <span className="text-sm font-medium">Create Dashboard</span>
                    <span className="text-xs text-gray-500">New dashboard</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-3 flex flex-col items-start" onClick={() => handleQuickActions('upload-data')}>
                    <Upload size={20} className="mb-2 text-purple-600" />
                    <span className="text-sm font-medium">Upload Data</span>
                    <span className="text-xs text-gray-500">Import files</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-3 flex flex-col items-start" onClick={() => handleQuickActions('browse-gallery')}>
                    <Globe size={20} className="mb-2 text-orange-600" />
                    <span className="text-sm font-medium">Visualizations</span>
                    <span className="text-xs text-gray-500">Advanced charts</span>
                  </Button>
                </div>
                
                <Separator className="my-3" />
                
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/'); setIsExtendedMenuOpen(false); }}>
                    <Home size={16} className="mr-3" /> Home
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/power-query'); setIsExtendedMenuOpen(false); }}>
                    <Database size={16} className="mr-3" /> Power Query
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/ai-assistant'); setIsExtendedMenuOpen(false); }}>
                    <Zap size={16} className="mr-3" /> AI Assistant
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/demo'); setIsExtendedMenuOpen(false); }}>
                    <BookOpen size={16} className="mr-3" /> Learning Center
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/settings'); setIsExtendedMenuOpen(false); }}>
                    <Settings size={16} className="mr-3" /> Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <nav className="flex flex-col items-center w-full">
          <NavItem icon={Home} label="Home" isActive={isActive('/')} onClick={() => navigate('/')} />
          <NavItem icon={Plus} label="Create" onClick={() => navigate('/report')} />
          <NavItem 
            icon={FileSearch} label="Browse" isActive={isBrowseSidebarOpen}
            onClick={() => { setIsBrowseSidebarOpen(!isBrowseSidebarOpen); setIsWorkspaceSidebarOpen(false); }} 
            badge={contentCounts.all}
          />
          <NavItem 
            icon={Layout} label="Workspaces" isActive={isWorkspaceSidebarOpen}
            onClick={() => { setIsWorkspaceSidebarOpen(!isWorkspaceSidebarOpen); setIsBrowseSidebarOpen(false); }} 
            badge={workspaces.length}
          />
          <NavItem icon={Database} label="Datasets" isActive={isActive('/datasets')} onClick={() => navigate('/datasets')} />
          <NavItem icon={TrendingUp} label="Learn" onClick={() => navigate('/demo')} />
        </nav>
        
        <div className="mt-auto mb-4 flex flex-col items-center w-full">
          <NotificationsDialog 
            notificationCount={notificationCount}
            onCountChange={setNotificationCount}
          />
          <NavItem icon={Settings} label="Settings" isActive={isActive('/settings')} onClick={() => navigate('/settings')} />
          <NavItem icon={HelpCircle} label="Help" onClick={() => navigate('/demo')} />
          <div className="mt-2">
            <NavItem icon={User} label="Profile" onClick={() => setIsProfileOpen(true)} />
          </div>
        </div>

        {isExtendedMenuOpen && (
          <div className="fixed inset-0 z-[55]" onClick={() => setIsExtendedMenuOpen(false)} />
        )}
      </div>

      {/* Browse Content Sidebar */}
      {isBrowseSidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsBrowseSidebarOpen(false)} />
          <div className="fixed left-16 top-0 w-80 h-full bg-white border-r border-gray-200 flex flex-col z-50 shadow-xl">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <FileSearch className="mr-2 text-blue-600" size={20} />
                  Browse Content
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setIsBrowseSidebarOpen(false)}>
                  <X size={16} />
                </Button>
              </div>
              <Input 
                type="text" placeholder="Search all content..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3"
              />
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium mb-3 text-gray-700">Content Types</h3>
                <div className="space-y-1">
                  {[
                    { key: 'all', label: 'All Content', icon: Grid3X3, count: contentCounts.all },
                    { key: 'report', label: 'Reports', icon: BarChart2, count: contentCounts.reports },
                    { key: 'dashboard', label: 'Dashboards', icon: Layout, count: contentCounts.dashboards },
                    { key: 'dataset', label: 'Datasets', icon: Database, count: contentCounts.datasets }
                  ].map(({ key, label, icon: Icon, count }) => (
                    <Button
                      key={key}
                      variant={contentFilter === key ? "secondary" : "ghost"}
                      className="w-full justify-between h-9"
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
                      <ContentItem key={item.id} item={item} onAction={(action) => handleContentAction(item, action)} />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {/* Workspace Sidebar */}
      {isWorkspaceSidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsWorkspaceSidebarOpen(false)} />
          <div className="fixed left-16 top-0 w-80 h-full bg-white border-r border-gray-200 flex flex-col z-50 shadow-xl">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <Building2 className="mr-2 text-green-600" size={20} />
                  Workspaces
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setIsWorkspaceSidebarOpen(false)}>
                  <X size={16} />
                </Button>
              </div>
              <CreateWorkspaceDialog trigger={
                <Button className="w-full"><Plus size={16} className="mr-2" /> Create Workspace</Button>
              } />
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {workspaces.map((workspace) => (
                  <div 
                    key={workspace.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border rounded-lg flex items-center justify-between transition-colors ${
                      selectedWorkspace === workspace.name ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                    }`}
                    onClick={() => {
                      handleWorkspaceSwitch(workspace.name);
                      // Also filter browse content if open
                    }}
                  >
                    <div className="flex items-center flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-sm font-medium mr-3">
                        {workspace.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{workspace.name}</div>
                        <div className="text-xs text-gray-500">{workspace.members} members</div>
                      </div>
                    </div>
                    {selectedWorkspace === workspace.name && (
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Workspace content preview */}
            <div className="p-4 border-t bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Content in {selectedWorkspace}</h3>
              <div className="flex gap-3 text-xs text-gray-600">
                <span>{allContent.filter(c => c.workspace === selectedWorkspace && c.type === 'report').length} Reports</span>
                <span>{allContent.filter(c => c.workspace === selectedWorkspace && c.type === 'dashboard').length} Dashboards</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => {
                setIsBrowseSidebarOpen(true);
                setIsWorkspaceSidebarOpen(false);
              }}>
                Browse Workspace Content
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-600 text-white text-xl">JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-sm text-gray-500">john.doe@company.com</p>
                <Badge variant="secondary" className="mt-1">Pro Trial - 28 days left</Badge>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}>
                <Settings size={16} className="mr-3" /> Account Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { 
                setIsProfileOpen(false); 
                setIsBrowseSidebarOpen(true);
                setContentFilter('all');
                setFavoriteIds(prev => prev); // trigger re-render to show favorites
              }}>
                <Star size={16} className="mr-3" /> My Favorites ({favoriteIds.size})
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setIsProfileOpen(false); navigate('/'); }}>
                <Clock size={16} className="mr-3" /> Recent Activity
              </Button>
              <Separator />
              <Button variant="ghost" className="w-full justify-start text-red-600" onClick={() => {
                setIsProfileOpen(false);
                toast({ title: "Signed Out", description: "You have been signed out successfully" });
                navigate('/');
              }}>
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// NavItem component
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false, onClick, badge }) => (
  <Button
    variant="ghost"
    className={`w-full h-16 flex flex-col items-center justify-center text-xs group relative p-2 rounded-none ${
      isActive 
        ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
    }`}
    onClick={onClick}
  >
    <div className="relative">
      <Icon size={20} className="mb-1" />
      {badge != null && badge > 0 && (
        <Badge className="absolute -top-1 -right-2 h-4 min-w-[16px] p-0 text-[8px] bg-red-500 text-white rounded-full flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </Badge>
      )}
    </div>
    <span className="text-[10px] leading-tight">{label}</span>
    <div className="absolute left-16 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
      {label}
    </div>
  </Button>
);

// ContentItem component
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
    <div className="p-3 hover:bg-gray-50 cursor-pointer group border rounded-lg transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0" onClick={() => onAction('open')}>
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
          <Button variant="ghost" size="sm" onClick={() => onAction('favorite')} className="p-1.5 h-auto">
            <Star size={14} className={item.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction('share')} className="p-1.5 h-auto">
            <Share2 size={14} className="text-gray-400" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction('edit')} className="p-1.5 h-auto">
            <Edit size={14} className="text-gray-400" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction('delete')} className="p-1.5 h-auto">
            <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPowerBISidebar;
