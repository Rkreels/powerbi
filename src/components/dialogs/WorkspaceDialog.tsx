import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Users, Lock } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { dataService } from '@/services/dataService';

interface WorkspaceDialogProps {
  trigger?: React.ReactNode;
  onWorkspaceCreated?: () => void;
}

export const WorkspaceDialog: React.FC<WorkspaceDialogProps> = ({ trigger, onWorkspaceCreated }) => {
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!workspaceName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a workspace name.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const workspace = dataService.createWorkspace({
        name: workspaceName,
        description: description,
        members: 1,
        isDefault: false,
      });

      toast({
        title: "Workspace Created",
        description: `${workspace.name} has been created successfully.`,
        duration: 3000,
      });

      setWorkspaceName('');
      setDescription('');
      setVisibility('private');
      setOpen(false);
      
      if (onWorkspaceCreated) {
        onWorkspaceCreated();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workspace. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Briefcase size={16} className="mr-2" />
            New Workspace
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase size={20} />
            Create Workspace
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="workspace-name">Workspace Name *</Label>
            <Input
              id="workspace-name"
              placeholder="Enter workspace name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="workspace-description">Description</Label>
            <Textarea
              id="workspace-description"
              placeholder="Describe the purpose of this workspace"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="workspace-visibility">Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock size={14} />
                    <span>Private - Only invited members</span>
                  </div>
                </SelectItem>
                <SelectItem value="organization">
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>Organization - All company members</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Organize workspaces by team, project, or department for better collaboration.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Workspace'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};