import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, UserPlus, Trash2 } from "lucide-react";
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";

interface WorkspaceSettingsDialogProps {
  trigger?: React.ReactNode;
  workspaceName: string;
}

export const WorkspaceSettingsDialog: React.FC<WorkspaceSettingsDialogProps> = ({ trigger, workspaceName }) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    name: workspaceName,
    description: 'Workspace for collaborative analytics',
    allowExternalSharing: true,
    autoRefresh: false,
    memberCanEdit: true,
    publicVisibility: false
  });

  const members = [
    { name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@company.com', role: 'Contributor', status: 'Active' },
    { name: 'Mike Johnson', email: 'mike@company.com', role: 'Viewer', status: 'Pending' },
  ];

  const handleSave = () => {
    toast({
      title: "Settings Updated",
      description: "Workspace settings have been saved successfully",
    });
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Settings size={16} className="mr-2" />
      Workspace Settings
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Workspace Settings - {workspaceName}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 flex-1">
            <div className="space-y-4">
              <div>
                <Label htmlFor="workspaceName">Workspace Name</Label>
                <Input
                  id="workspaceName"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-refresh datasets</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh datasets daily</p>
                  </div>
                  <Switch
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRefresh: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow external sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow content to be shared outside organization</p>
                  </div>
                  <Switch
                    checked={settings.allowExternalSharing}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowExternalSharing: checked }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Workspace Members</h3>
              <Button size="sm">
                <UserPlus size={16} className="mr-2" />
                Invite Members
              </Button>
            </div>
            
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                    <Badge variant="outline">{member.role}</Badge>
                    <Button variant="ghost" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4 flex-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Members can edit content</Label>
                  <p className="text-sm text-muted-foreground">Allow members to create and edit reports</p>
                </div>
                <Switch
                  checked={settings.memberCanEdit}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, memberCanEdit: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public workspace visibility</Label>
                  <p className="text-sm text-muted-foreground">Make workspace visible to all organization members</p>
                </div>
                <Switch
                  checked={settings.publicVisibility}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, publicVisibility: checked }))}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};