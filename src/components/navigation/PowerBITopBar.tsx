
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Download, 
  HelpCircle, 
  Settings, 
  User, 
  ChevronDown,
  Plus,
  Upload,
  Share2,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateReportDialog } from '@/components/dialogs/CreateReportDialog';
import { CreateDashboardDialog } from '@/components/dialogs/CreateDashboardDialog';
import { NotificationsDialog } from '@/components/dialogs/NotificationsDialog';
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const PowerBITopBar = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaces] = useState(() => dataService.getWorkspaces());
  const [currentWorkspace, setCurrentWorkspace] = useState('My Workspace');

  useEffect(() => {
    setNotificationCount(dataService.getUnreadNotificationCount());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
      // In a real app, this would perform actual search
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        dataService.createDataset({
          name: file.name.replace(/\.[^/.]+$/, ""),
          description: `Uploaded file: ${file.name}`,
          source: 'File Upload',
          owner: 'Current User',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'active'
        });
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully`,
        });
      }
    };
    input.click();
  };

  const handleShare = () => {
    if (navigator.share && navigator.canShare) {
      navigator.share({
        title: 'Power BI Dashboard',
        text: 'Check out this dashboard',
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
        description: "Dashboard link copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Share",
        description: "Unable to copy link",
        variant: "destructive"
      });
    });
  };

  const handleDownload = () => {
    // Simulate PDF export
    toast({
      title: "Export started",
      description: "Your report is being exported to PDF...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Report downloaded successfully",
      });
    }, 2000);
  };
  
  return (
    <header className="h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
      {/* Left section */}
      <div className="flex items-center">
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center text-sm text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => navigate('/')}
          >
            <span className="mr-1">Home</span>
          </button>
          <span className="text-gray-300">|</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                <span className="mr-1">{currentWorkspace}</span>
                <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {workspaces.map((workspace) => (
                <DropdownMenuItem 
                  key={workspace.id}
                  onClick={() => setCurrentWorkspace(workspace.name)}
                >
                  {workspace.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Center - Search */}
      <div className="flex items-center flex-1 justify-center max-w-lg">
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dashboards, reports, and more..." 
            className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          />
        </form>
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Action buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs h-8">
              <Plus size={14} className="mr-1" />
              Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <CreateReportDialog trigger={<span>Create Report</span>} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreateDashboardDialog trigger={<span>Create Dashboard</span>} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs h-8"
          onClick={handleUpload}
        >
          <Upload size={14} className="mr-1" />
          Upload
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs h-8"
          onClick={handleShare}
        >
          <Share2 size={14} className="mr-1" />
          Share
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        {/* Utility buttons */}
        <Button 
          variant="ghost" 
          size="sm"
          className="p-1.5 h-8 w-8"
          onClick={() => toast({ title: "Filter", description: "Filter functionality coming soon" })}
        >
          <Filter size={16} />
        </Button>
        
        <NotificationsDialog 
          notificationCount={notificationCount}
          onCountChange={setNotificationCount}
        />
        
        <Button 
          variant="ghost" 
          size="sm"
          className="p-1.5 h-8 w-8"
          onClick={() => navigate('/settings')}
        >
          <Settings size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="p-1.5 h-8 w-8"
          onClick={handleDownload}
        >
          <Download size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="p-1.5 h-8 w-8"
          onClick={() => navigate('/demo')}
        >
          <HelpCircle size={16} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/demo')}>
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: "Feedback", description: "Feedback form coming soon" })}>
              Send Feedback
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        {/* User section */}
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-600 text-right">
            <div className="font-medium">Free trial</div>
            <div className="text-gray-500">59 days left</div>
          </div>
          
          <button 
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/settings')}
          >
            <User size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default PowerBITopBar;
