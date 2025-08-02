import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { dataService } from '@/services/dataService';
import {
  Building2,
  Users,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Share2,
  Download,
  Filter,
  Calendar,
  Activity,
  BarChart3,
  FileText,
  Database
} from 'lucide-react';

interface WorkspaceManagerProps {
  onWorkspaceSelect?: (workspace: any) => void;
}

export const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ onWorkspaceSelect }) => {
  const [workspaces, setWorkspaces] = useState(dataService.getWorkspaces());
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  // Get content counts for each workspace
  const getWorkspaceStats = (workspaceId: string) => {
    const reports = dataService.getReports().filter(r => r.workspace === workspaceId);
    const dashboards = dataService.getDashboards().filter(d => d.workspace === workspaceId);
    const datasets = dataService.getDatasets().filter(d => d.owner === 'Current User');
    
    return {
      reports: reports.length,
      dashboards: dashboards.length,
      datasets: datasets.length,
      total: reports.length + dashboards.length + datasets.length
    };
  };

  // Filter workspaces based on search
  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a workspace name.",
        variant: "destructive",
      });
      return;
    }

    const newWorkspace = {
      name: newWorkspaceName,
      description: newWorkspaceDescription,
      type: 'workspace',
      owner: 'Current User',
      members: 1,
      created: new Date().toISOString(),
      isDefault: false
    };

    const createdWorkspace = dataService.createWorkspace(newWorkspace);
    setWorkspaces([...workspaces, createdWorkspace]);

    toast({
      title: "Workspace created",
      description: `"${newWorkspaceName}" has been created successfully.`,
    });

    setNewWorkspaceName('');
    setNewWorkspaceDescription('');
    setShowCreateDialog(false);
  };

  const handleWorkspaceAction = (workspace: any, action: string) => {
    switch (action) {
      case 'edit':
        toast({
          title: "Edit Workspace",
          description: `Opening settings for ${workspace.name}`,
        });
        break;
      case 'delete':
        if (workspace.isDefault) {
          toast({
            title: "Cannot Delete",
            description: "Default workspace cannot be deleted.",
            variant: "destructive",
          });
          return;
        }
        setWorkspaces(workspaces.filter(w => w.id !== workspace.id));
        toast({
          title: "Workspace Deleted",
          description: `"${workspace.name}" has been deleted.`,
        });
        break;
      case 'invite':
        toast({
          title: "Invite Members",
          description: `Opening invite dialog for ${workspace.name}`,
        });
        break;
      case 'share':
        navigator.clipboard.writeText(`${window.location.origin}/workspace/${workspace.id}`);
        toast({
          title: "Link Copied",
          description: "Workspace link copied to clipboard.",
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Workspace Manager</h2>
          <p className="text-sm text-muted-foreground">
            Manage your workspaces and collaborate with your team
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Create Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Workspace Name</label>
                <Input
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="Enter workspace name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input
                  value={newWorkspaceDescription}
                  onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                  placeholder="Enter workspace description"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkspace}>
                  Create Workspace
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter size={16} />
          Filter
        </Button>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkspaces.map((workspace) => {
          const stats = getWorkspaceStats(workspace.id);
          
          return (
            <Card 
              key={workspace.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedWorkspace(workspace);
                onWorkspaceSelect?.(workspace);
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 size={20} className="text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {workspace.name}
                        {workspace.isDefault && (
                          <Crown size={14} className="text-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {workspace.description || 'No description'}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleWorkspaceAction(workspace, 'edit')}>
                        <Edit size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleWorkspaceAction(workspace, 'invite')}>
                        <UserPlus size={16} className="mr-2" />
                        Invite Members
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleWorkspaceAction(workspace, 'share')}>
                        <Share2 size={16} className="mr-2" />
                        Share
                      </DropdownMenuItem>
                      {!workspace.isDefault && (
                        <DropdownMenuItem 
                          onClick={() => handleWorkspaceAction(workspace, 'delete')}
                          className="text-red-600"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <Badge variant="secondary" className="gap-1">
                      <Users size={12} />
                      {workspace.members}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium">{stats.reports}</div>
                      <div className="text-muted-foreground">Reports</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{stats.dashboards}</div>
                      <div className="text-muted-foreground">Dashboards</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{stats.datasets}</div>
                      <div className="text-muted-foreground">Datasets</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last updated {new Date(workspace.created).toLocaleDateString()}</span>
                    <Badge variant="outline" className="text-xs">
                      Standard
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Workspace Details Dialog */}
      {selectedWorkspace && (
        <Dialog open={!!selectedWorkspace} onOpenChange={() => setSelectedWorkspace(null)}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 size={20} />
                {selectedWorkspace.name}
                {selectedWorkspace.isDefault && (
                  <Crown size={16} className="text-yellow-500" />
                )}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="flex-1 overflow-auto">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Workspace Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <BarChart3 size={24} className="text-green-600" />
                          </div>
                          <div className="text-2xl font-bold">{getWorkspaceStats(selectedWorkspace.id).reports}</div>
                          <div className="text-sm text-muted-foreground">Reports</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Activity size={24} className="text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold">{getWorkspaceStats(selectedWorkspace.id).dashboards}</div>
                          <div className="text-sm text-muted-foreground">Dashboards</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Database size={24} className="text-orange-600" />
                          </div>
                          <div className="text-2xl font-bold">{getWorkspaceStats(selectedWorkspace.id).datasets}</div>
                          <div className="text-sm text-muted-foreground">Datasets</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Users size={24} className="text-purple-600" />
                          </div>
                          <div className="text-2xl font-bold">{selectedWorkspace.members}</div>
                          <div className="text-sm text-muted-foreground">Members</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Plus size={16} className="text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">New report created</div>
                            <div className="text-xs text-muted-foreground">2 hours ago</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Edit size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Dashboard updated</div>
                            <div className="text-xs text-muted-foreground">5 hours ago</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserPlus size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">New member added</div>
                            <div className="text-xs text-muted-foreground">1 day ago</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="flex-1 overflow-auto">
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Content Management</h3>
                  <p className="text-muted-foreground">
                    Content management features will be implemented here
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="flex-1 overflow-auto">
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Member Management</h3>
                  <p className="text-muted-foreground">
                    Member management features will be implemented here
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="flex-1 overflow-auto">
                <div className="text-center py-8">
                  <Settings size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Workspace Settings</h3>
                  <p className="text-muted-foreground">
                    Workspace settings will be implemented here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WorkspaceManager;