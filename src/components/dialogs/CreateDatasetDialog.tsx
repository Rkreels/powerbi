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

interface CreateDatasetDialogProps {
  trigger?: React.ReactNode;
}

export const CreateDatasetDialog: React.FC<CreateDatasetDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    source: 'Excel'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Dataset name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const newDataset = dataService.createDataset({
        name: formData.name,
        description: formData.description,
        source: formData.source,
        owner: 'Current User',
        size: '0 MB',
        status: 'active'
      });

      toast({
        title: "Success",
        description: `Dataset "${newDataset.name}" created successfully`,
      });

      setOpen(false);
      setFormData({ name: '', description: '', source: 'Excel' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create dataset",
        variant: "destructive"
      });
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus size={16} className="mr-2" />
      Create Dataset
    </Button>
  );

  const sources = [
    'Excel',
    'SQL Server',
    'Azure SQL Database',
    'PostgreSQL',
    'MySQL',
    'Oracle',
    'Web',
    'JSON',
    'CSV'
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Dataset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Dataset Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter dataset name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter dataset description (optional)"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="source">Data Source</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
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
              Create Dataset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};