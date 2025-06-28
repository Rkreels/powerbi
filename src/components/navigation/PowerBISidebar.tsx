import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Plus,
  FileSearch,
  Layout,
  BarChart2,
  User,
  Grid3X3,
  ChevronDown,
  Star,
  Users,
  Clock,
  Settings,
  HelpCircle,
  Search,
  Filter,
  MoreHorizontal,
  Menu,
  X,
  FolderOpen,
  Building2,
  UserPlus,
  Shield,
  Share2
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem = ({ icon: Icon, label, isActive = false, onClick, badge }: NavItemProps) => {
  return (
    <button 
      className={`w-full py-3 flex flex-col items-center justify-center text-xs group relative ${
        isActive 
          ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Icon size={20} className="mb-1" />
        {badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] leading-tight">{label}</span>
      
      {/* Tooltip */}
      <div className="absolute left-16 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
};

interface WorkspaceItemProps {
  name: string;
  isActive?: boolean;
  hasUpdates?: boolean;
  onClick: () => void;
}

const WorkspaceItem = ({ name, isActive = false, hasUpdates = false, onClick }: WorkspaceItemProps) => (
  <div 
    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
      isActive ? 'bg-blue-50 border-r-2 border-blue-600' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <Layout size={16} className="mr-2 text-gray-500" />
      <span className="text-sm truncate">{name}</span>
    </div>
    {hasUpdates && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
  </div>
);

interface ContentItemProps {
  title: string;
  type: 'report' | 'dashboard' | 'dataset' | 'dataflow';
  lastModified: string;
  owner: string;
  isShared?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const ContentItem = ({ title, type, lastModified, owner, isShared, isFavorite, onToggleFavorite }: ContentItemProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'report': return <BarChart2 size={16} className="text-green-600" />;
      case 'dashboard': return <Layout size={16} className="text-blue-600" />;
      case 'dataset': return <FileSearch size={16} className="text-orange-600" />;
      case 'dataflow': return <Filter size={16} className="text-purple-600" />;
    }
  };

  return (
    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          {getTypeIcon()}
          <div className="ml-2 flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{title}</div>
            <div className="text-xs text-gray-500">
              {lastModified} • {owner}
              {isShared && <Users size={12} className="inline ml-1" />}
            </div>
          </div>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onToggleFavorite}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Star size={14} className={isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'} />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded ml-1">
            <MoreHorizontal size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PowerBISidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWorkspace, setSelectedWorkspace] = useState('My workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isExtendedMenuOpen, setIsExtendedMenuOpen] = useState(false);
  const [isBrowseSidebarOpen, setIsBrowseSidebarOpen] = useState(false);
  const [isWorkspaceSidebarOpen, setIsWorkspaceSidebarOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const extendedMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Layout, label: 'Workspaces', path: '/dashboard' },
    { icon: BarChart2, label: 'Reports', path: '/report' },
    { icon: FileSearch, label: 'Datasets', path: '/datasets' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/demo' },
  ];

  const workspaces = [
    { name: 'My workspace', hasUpdates: true },
    { name: 'Sales Team', hasUpdates: false },
    { name: 'Marketing Analytics', hasUpdates: true },
    { name: 'Finance Reports', hasUpdates: false },
  ];

  const recentContent = [
    {
      title: 'Sales Overview Dashboard',
      type: 'dashboard' as const,
      lastModified: '2 hours ago',
      owner: 'You',
      isFavorite: true
    },
    {
      title: 'Monthly Revenue Report',
      type: 'report' as const,
      lastModified: '1 day ago',
      owner: 'John Smith',
      isShared: true,
      isFavorite: false
    },
    {
      title: 'Customer Analytics',
      type: 'dataset' as const,
      lastModified: '3 days ago',
      owner: 'You',
      isFavorite: true
    }
  ];

  const toggleExtendedMenu = () => {
    setIsExtendedMenuOpen(!isExtendedMenuOpen);
  };

  const handleExtendedMenuItemClick = (path: string) => {
    navigate(path);
    setIsExtendedMenuOpen(false);
  };

  const toggleBrowseSidebar = () => {
    setIsBrowseSidebarOpen(!isBrowseSidebarOpen);
    setIsWorkspaceSidebarOpen(false); // Close workspace sidebar
  };

  const toggleWorkspaceSidebar = () => {
    setIsWorkspaceSidebarOpen(!isWorkspaceSidebarOpen);
    setIsBrowseSidebarOpen(false); // Close browse sidebar
  };

  return (
    <div className="flex h-screen">
      {/* Left Navigation Bar */}
      <div className="bg-white border-r border-gray-200 w-16 min-h-screen flex flex-col items-center shadow-sm relative">
        {/* Logo with Extended Menu Toggle */}
        <div className="p-3 flex justify-center relative">
          <button 
            onClick={toggleExtendedMenu}
            className="w-9 h-9 bg-yellow-500 rounded-sm flex items-center justify-center hover:bg-yellow-600 transition-colors"
          >
            {isExtendedMenuOpen ? (
              <X size={20} className="text-white" />
            ) : (
              <Grid3X3 size={20} className="text-white" />
            )}
          </button>

          {/* Extended Menu Popup */}
          {isExtendedMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Quick Navigation</h3>
              </div>
              <div className="py-2">
                {extendedMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleExtendedMenuItemClick(item.path)}
                    className={`w-full flex items-center px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${
                      isActive(item.path) ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <item.icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Power BI Service</span>
                  <span>v2.0</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Nav items */}
        <nav className="flex flex-col items-center w-full">
          <NavItem 
            icon={Home} 
            label="Home" 
            isActive={activeSection === 'home'} 
            onClick={() => {
              setActiveSection('home');
              navigate('/');
            }} 
          />
          <NavItem 
            icon={Plus} 
            label="Create" 
            onClick={() => navigate('/report')} 
          />
          <NavItem 
            icon={FileSearch} 
            label="Browse" 
            isActive={isBrowseSidebarOpen}
            onClick={() => {
              setActiveSection('browse');
              toggleBrowseSidebar();
            }} 
          />
          <NavItem 
            icon={Layout} 
            label="Workspaces" 
            isActive={isWorkspaceSidebarOpen}
            onClick={() => {
              setActiveSection('workspaces');
              toggleWorkspaceSidebar();
            }} 
            badge={2}
          />
          <NavItem 
            icon={BarChart2} 
            label="Learn" 
            onClick={() => navigate('/demo')} 
          />
        </nav>
        
        {/* Bottom section */}
        <div className="mt-auto mb-4 flex flex-col items-center w-full">
          <NavItem 
            icon={Settings} 
            label="Settings" 
            onClick={() => navigate('/settings')} 
          />
          <NavItem 
            icon={HelpCircle} 
            label="Help" 
            onClick={() => {}} 
          />
          <div className="mt-2">
            <NavItem 
              icon={User} 
              label="Profile" 
              onClick={() => {}} 
            />
          </div>
        </div>

        {/* Overlay to close extended menu when clicking outside */}
        {isExtendedMenuOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsExtendedMenuOpen(false)}
          />
        )}
      </div>

      {/* Browse Content Sidebar */}
      {isBrowseSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50" 
            onClick={() => setIsBrowseSidebarOpen(false)}
          />
          
          <div className="fixed left-16 top-0 w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col z-50 animate-slide-in-right shadow-lg">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Browse Content</h2>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => setIsBrowseSidebarOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search all content..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {/* Content Type Filters */}
              <div className="border-b border-gray-200">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Content Types
                </div>
                <div className="pb-2">
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart2 size={16} className="mr-2 text-green-600" />
                      <span className="text-sm">All Reports</span>
                    </div>
                    <span className="text-xs text-gray-400">12</span>
                  </div>
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <Layout size={16} className="mr-2 text-blue-600" />
                      <span className="text-sm">All Dashboards</span>
                    </div>
                    <span className="text-xs text-gray-400">8</span>
                  </div>
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileSearch size={16} className="mr-2 text-orange-600" />
                      <span className="text-sm">All Datasets</span>
                    </div>
                    <span className="text-xs text-gray-400">15</span>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="border-b border-gray-200">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Quick Filters
                </div>
                <div className="pb-2">
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center">
                    <Star size={16} className="mr-2 text-yellow-500" />
                    <span className="text-sm">Favorited Items</span>
                  </div>
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center">
                    <Clock size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm">Recently Modified</span>
                  </div>
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center">
                    <Users size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm">Shared Content</span>
                  </div>
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center">
                    <FolderOpen size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm">My Content</span>
                  </div>
                </div>
              </div>

              {/* Search Results / All Content */}
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  All Content
                </div>
                <div className="pb-2">
                  {recentContent.map((item, index) => (
                    <ContentItem key={index} {...item} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="text-xs text-gray-500 text-center">
                Showing content from all workspaces
              </div>
            </div>
          </div>
        </>
      )}

      {/* Workspace Management Sidebar */}
      {isWorkspaceSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50" 
            onClick={() => setIsWorkspaceSidebarOpen(false)}
          />
          
          <div className="fixed left-16 top-0 w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col z-50 animate-slide-in-right shadow-lg">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Workspaces</h2>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => setIsWorkspaceSidebarOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded border">
                <div className="flex items-center">
                  <Building2 size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm font-medium">{selectedWorkspace}</span>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {/* Workspace Actions */}
              <div className="border-b border-gray-200">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Workspace Actions
                </div>
                <div className="pb-2">
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center">
                    <Plus size={16} className="mr-2 text-green-600" />
                    <span className="text-sm">Create Workspace</span>
                  </div>
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center">
                    <UserPlus size={16} className="mr-2 text-blue-600" />
                    <span className="text-sm">Invite Members</span>
                  </div>
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center">
                    <Settings size={16} className="mr-2 text-gray-600" />
                    <span className="text-sm">Workspace Settings</span>
                  </div>
                </div>
              </div>

              {/* Current Workspace Info */}
              <div className="border-b border-gray-200">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Current Workspace
                </div>
                <div className="pb-2">
                  <div className="px-3 py-2 hover:bg-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{selectedWorkspace}</span>
                      <Shield size={14} className="text-green-600" />
                    </div>
                    <div className="text-xs text-gray-500">Admin • 5 members</div>
                  </div>
                  <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <Share2 size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm">Manage Access</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Workspaces */}
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Switch Workspace
                </div>
                <div className="pb-2">
                  {workspaces.map((workspace, index) => (
                    <WorkspaceItem 
                      key={index}
                      name={workspace.name}
                      isActive={workspace.name === selectedWorkspace}
                      hasUpdates={workspace.hasUpdates}
                      onClick={() => setSelectedWorkspace(workspace.name)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="text-xs text-gray-500">
                <div className="flex justify-between items-center mb-1">
                  <span>Workspace Storage</span>
                  <span>2.1 GB / 10 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full" style={{ width: '21%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PowerBISidebar;
