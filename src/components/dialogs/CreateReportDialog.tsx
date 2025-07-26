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

interface CreateReportDialogProps {
  trigger?: React.ReactNode;
}

export const CreateReportDialog: React.FC<CreateReportDialogProps> = ({ trigger }) => {
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
        description: "Report name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const newReport = dataService.createReport({
        name: formData.name,
        description: formData.description,
        owner: 'Current User',
        workspace: formData.workspace,
        isPublished: false,
        visualizations: []
      });

      toast({
        title: "Success",
        description: `Report "${newReport.name}" created successfully`,
      });

      setOpen(false);
      setFormData({ name: '', description: '', workspace: 'My Workspace' });
      navigate('/report');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive"
      });
    }
  };

  const defaultTrigger = (
    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
      <Plus size={16} className="mr-2" />
      Create Report
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Report Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter report name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter report description (optional)"
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
              Create Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};