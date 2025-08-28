import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Download, HelpCircle, Settings, User, ChevronDown, Plus, Upload, Share2, 
  Filter, MoreVertical, Globe, Bookmark, Clock, Star, Zap, Menu, BarChart2, Layout, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateReportDialog } from '@/components/dialogs/CreateReportDialog';
import { CreateDashboardDialog } from '@/components/dialogs/CreateDashboardDialog';
import { NotificationsDialog } from '@/components/dialogs/NotificationsDialog';
import { InviteMembersDialog } from '@/components/dialogs/InviteMembersDialog';
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const EnhancedPowerBITopBar = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [workspaces] = useState(() => dataService.getWorkspaces());
  const [currentWorkspace, setCurrentWorkspace] = useState('My Workspace');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setNotificationCount(dataService.getUnreadNotificationCount());
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    // Load from localStorage or service
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  };

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const allContent = [
      ...dataService.getReports().map(r => ({ ...r, type: 'report' })),
      ...dataService.getDashboards().map(d => ({ ...d, type: 'dashboard' })),
      ...dataService.getDatasets().map(d => ({ ...d, type: 'dataset' }))
    ];

    const results = allContent.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.owner.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    saveRecentSearch(query);
  };

  const handleSearchSelect = (item: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    
    if (item.type === 'report') navigate('/report');
    else if (item.type === 'dashboard') navigate('/dashboard');
    else if (item.type === 'dataset') navigate('/datasets');
    
    toast({
      title: "Opening item",
      description: `Opening ${item.name}`,
    });
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv,.json,.pbix';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length === 0) return;

      toast({
        title: "Upload started",
        description: `Uploading ${files.length} file(s)...`,
      });

      files.forEach((file, index) => {
        setTimeout(() => {
          dataService.createDataset({
            name: file.name.replace(/\.[^/.]+$/, ""),
            description: `Uploaded file: ${file.name}`,
            source: 'File Upload',
            owner: 'Current User',
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            status: 'active'
          });

          if (index === files.length - 1) {
            toast({
              title: "Upload complete",
              description: "All files uploaded successfully",
            });
          }
        }, (index + 1) * 1000);
      });
    };

    input.click();
  };

  const handleShare = () => {
    if (navigator.share && navigator.canShare) {
      navigator.share({
        title: 'Power BI Workspace',
        text: 'Check out my Power BI workspace',
        url: window.location.href
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied",
        description: "Workspace link copied to clipboard",
      });
    });
  };

  const handleExport = (format: 'pdf' | 'excel' | 'powerpoint') => {
    toast({
      title: "Export started",
      description: `Exporting current view to ${format.toUpperCase()}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: `File downloaded successfully as ${format.toUpperCase()}`,
      });
    }, 2000);
  };

  const handleWorkspaceSwitch = (workspaceName: string) => {
    setCurrentWorkspace(workspaceName);
    toast({
      title: "Workspace switched",
      description: `Now viewing ${workspaceName}`,
    });
  };

  const quickActions = [
    { 
      icon: <Plus size={16} />, 
      label: 'Create Report', 
      action: () => navigate('/report'),
      shortcut: 'Ctrl+N'
    },
    { 
      icon: <Plus size={16} />, 
      label: 'Create Dashboard', 
      action: () => navigate('/dashboard'),
      shortcut: 'Ctrl+D'
    },
    { 
      icon: <Upload size={16} />, 
      label: 'Upload Data', 
      action: handleUpload,
      shortcut: 'Ctrl+U'
    }
  ];

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm sticky top-0 z-40">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost"
            className="flex items-center text-sm text-gray-700 hover:text-blue-600 font-medium p-2"
            onClick={() => window.open('https://skillsim.vercel.app/dashboard', '_self')}
          >
            <div className="w-6 h-6 bg-yellow-500 rounded-sm flex items-center justify-center mr-2">
              <Zap size={14} className="text-white" />
            </div>
            <span>Master Dashboard</span>
          </Button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                <span className="mr-1">{currentWorkspace}</span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2">WORKSPACES</div>
                {workspaces.map((workspace) => (
                  <DropdownMenuItem 
                    key={workspace.id}
                    onClick={() => handleWorkspaceSwitch(workspace.name)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded text-white text-xs flex items-center justify-center mr-2">
                        {workspace.name.charAt(0)}
                      </div>
                      <span>{workspace.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {workspace.members} members
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus size={16} className="mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Center - Enhanced Search */}
        <div className="flex items-center flex-1 justify-center max-w-2xl mx-8">
          <div className="relative w-full">
            <Button
              variant="outline"
              className="w-full justify-start text-sm text-muted-foreground h-10"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={16} className="mr-3" />
              Search reports, dashboards, datasets...
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm h-10">
                <Plus size={16} className="mr-2" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2">QUICK ACTIONS</div>
                {quickActions.map((item, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    onClick={item.action}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </div>
                    <kbd className="text-xs text-gray-500">{item.shortcut}</kbd>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <CreateReportDialog trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Plus size={16} className="mr-2" />
                  Create Report (Advanced)
                </DropdownMenuItem>
              } />
              <CreateDashboardDialog trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Plus size={16} className="mr-2" />
                  Create Dashboard (Advanced)
                </DropdownMenuItem>
              } />
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleUpload}
            className="hidden md:flex"
          >
            <Upload size={16} className="mr-2" />
            Upload
          </Button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Tools */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Download size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('powerpoint')}>
                Export to PowerPoint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="p-2"
          >
            <Share2 size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => toast({ title: "Filter", description: "Advanced filters coming soon" })}
            className="p-2"
          >
            <Filter size={16} />
          </Button>
          
          <NotificationsDialog 
            notificationCount={notificationCount}
            onCountChange={setNotificationCount}
          />
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* More menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/demo')}>
                <HelpCircle size={16} className="mr-2" />
                Help & Support
              </DropdownMenuItem>
              <InviteMembersDialog trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <User size={16} className="mr-2" />
                  Invite Members
                </DropdownMenuItem>
              } />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.open('https://community.powerbi.com', '_blank')}>
                <Globe size={16} className="mr-2" />
                Community
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Feedback", description: "Feedback form coming soon" })}>
                Send Feedback
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* User section */}
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-600 text-right hidden md:block">
              <div className="font-medium">Pro Trial</div>
              <div className="text-gray-500">28 days left</div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="text-sm font-medium">John Doe</div>
                  <div className="text-xs text-gray-500">john.doe@company.com</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <User size={16} className="mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark size={16} className="mr-2" />
                  My Favorites
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock size={16} className="mr-2" />
                  Recent Activity
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Enhanced Search Dialog */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput 
          placeholder="Search reports, dashboards, datasets..." 
          value={searchQuery}
          onValueChange={(value) => {
            setSearchQuery(value);
            performSearch(value);
          }}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {searchQuery === '' && recentSearches.length > 0 && (
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setSearchQuery(search);
                    performSearch(search);
                  }}
                >
                  <Clock size={16} className="mr-2" />
                  {search}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {searchResults.length > 0 && (
            <CommandGroup heading="Results">
              {searchResults.slice(0, 10).map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSearchSelect(item)}
                >
                  <div className="flex items-center w-full">
                    {item.type === 'report' && <BarChart2 size={16} className="mr-2 text-green-600" />}
                    {item.type === 'dashboard' && <Layout size={16} className="mr-2 text-blue-600" />}
                    {item.type === 'dataset' && <Database size={16} className="mr-2 text-orange-600" />}
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.type} • {item.owner}</div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {searchQuery !== '' && (
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => {
                setIsSearchOpen(false);
                navigate('/report');
              }}>
                <Plus size={16} className="mr-2" />
                Create new report with "{searchQuery}"
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default EnhancedPowerBITopBar;