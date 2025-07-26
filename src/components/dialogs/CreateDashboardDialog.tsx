import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface CreateDashboardDialogProps {
  trigger?: React.ReactNode;
}

export const CreateDashboardDialog: React.FC<CreateDashboardDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspace: 'My Workspace'
  });
  const navigate = useNavigate();

  const workspaces = dataService.getWorkspaces();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Dashboard name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const newDashboard = dataService.createDashboard({
        name: formData.name,
        description: formData.description,
        owner: 'Current User',
        workspace: formData.workspace,
        reports: []
      });

      toast({
        title: "Success",
        description: `Dashboard "${newDashboard.name}" created successfully`,
      });

      setOpen(false);
      setFormData({ name: '', description: '', workspace: 'My Workspace' });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create dashboard",
        variant: "destructive"
      });
    }
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Plus size={16} className="mr-2" />
      Create Dashboard
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Dashboard</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Dashboard Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter dashboard name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter dashboard description (optional)"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="workspace">Workspace</Label>
            <Select value={formData.workspace} onValueChange={(value) => setFormData(prev => ({ ...prev, workspace: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.name}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Dashboard
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};