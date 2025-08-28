import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, BarChart2, Layout, TrendingUp, Users, Calendar, DollarSign, 
  Target, Award, Activity, PieChart, LineChart, FileText
} from "lucide-react";
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  widgets: string[];
  color: string;
}

const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'executive',
    name: 'Executive Overview',
    description: 'High-level KPIs and business metrics for leadership',
    category: 'Business',
    icon: <Award size={24} />,
    widgets: ['Revenue Trend', 'Sales Target vs Actual', 'Top Products', 'Regional Performance'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'sales',
    name: 'Sales Performance',
    description: 'Detailed sales analytics and team performance',
    category: 'Sales',
    icon: <TrendingUp size={24} />,
    widgets: ['Sales Pipeline', 'Win Rate', 'Revenue by Source', 'Team Performance'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'marketing',
    name: 'Marketing Analytics',
    description: 'Campaign performance and customer acquisition',
    category: 'Marketing',
    icon: <Target size={24} />,
    widgets: ['Campaign ROI', 'Lead Generation', 'Customer Acquisition', 'Channel Performance'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'financial',
    name: 'Financial Dashboard',
    description: 'Financial metrics and budget tracking',
    category: 'Finance',
    icon: <DollarSign size={24} />,
    widgets: ['P&L Overview', 'Budget vs Actual', 'Cash Flow', 'Expense Breakdown'],
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'hr',
    name: 'HR Analytics',
    description: 'Employee metrics and workforce analytics',
    category: 'HR',
    icon: <Users size={24} />,
    widgets: ['Headcount', 'Turnover Rate', 'Employee Satisfaction', 'Recruitment Pipeline'],
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'operations',
    name: 'Operations Dashboard',
    description: 'Operational efficiency and process metrics',
    category: 'Operations',
    icon: <Activity size={24} />,
    widgets: ['Process Efficiency', 'Quality Metrics', 'Capacity Utilization', 'Downtime Analysis'],
    color: 'from-teal-500 to-teal-600'
  }
];

interface RealCreateDashboardDialogProps {
  trigger?: React.ReactNode;
}

export const RealCreateDashboardDialog: React.FC<RealCreateDashboardDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'method' | 'template' | 'custom'>('method');
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspace: 'My Workspace',
    template: ''
  });
  const navigate = useNavigate();

  const workspaces = dataService.getWorkspaces();
  const reports = dataService.getReports();

  const handleTemplateSelect = (template: DashboardTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({ 
      ...prev, 
      name: template.name,
      description: template.description,
      template: template.id 
    }));
    setStep('template');
  };

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
        reports: selectedTemplate ? selectedTemplate.widgets : []
      });

      toast({
        title: "Success",
        description: `Dashboard "${newDashboard.name}" created successfully`,
      });

      // Reset form
      setOpen(false);
      setStep('method');
      setSelectedTemplate(null);
      setFormData({ name: '', description: '', workspace: 'My Workspace', template: '' });
      
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
    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
      <Plus size={16} className="mr-2" />
      Create Dashboard
    </Button>
  );

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">How would you like to create your dashboard?</h3>
        <p className="text-gray-600">Choose the method that works best for your needs</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStep('template')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <Layout size={24} />
              </div>
              <div>
                <CardTitle className="text-lg">Use Template</CardTitle>
                <CardDescription>Start with pre-built dashboard templates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Choose from professionally designed templates for common business scenarios
            </p>
            <Badge variant="secondary" className="mt-2">Recommended</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStep('custom')}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
                <Plus size={24} />
              </div>
              <div>
                <CardTitle className="text-lg">Start from Scratch</CardTitle>
                <CardDescription>Create a custom dashboard from existing reports</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Build your own dashboard by selecting specific reports and visualizations
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Choose a Template</h3>
          <p className="text-gray-600">Select a template that matches your business needs</p>
        </div>
        <Button variant="outline" onClick={() => setStep('method')}>
          Back
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {DASHBOARD_TEMPLATES.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-white`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">{template.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-3">
                    {template.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1">
                    {template.widgets.slice(0, 3).map((widget, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {widget}
                      </Badge>
                    ))}
                    {template.widgets.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.widgets.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Other tab contents would filter templates by category */}
        <TabsContent value="business" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DASHBOARD_TEMPLATES.filter(t => ['Business', 'Finance'].includes(t.category)).map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-white`}>
                      {template.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">{template.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Template Preview: {selectedTemplate.name}</h4>
          <p className="text-blue-800 text-sm mb-3">{selectedTemplate.description}</p>
          <div className="flex flex-wrap gap-2">
            {selectedTemplate.widgets.map((widget, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {widget}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex space-x-2">
            <Button onClick={() => setStep('custom')} className="flex-1">
              Customize Template
            </Button>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Change Template
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCustomForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Dashboard Details</h3>
          <p className="text-gray-600">Configure your dashboard settings</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setStep(selectedTemplate ? 'template' : 'method')}>
          Back
        </Button>
      </div>

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

      {selectedTemplate && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Template: {selectedTemplate.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{selectedTemplate.description}</p>
          <div className="flex flex-wrap gap-1">
            {selectedTemplate.widgets.map((widget, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {widget}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          Create Dashboard
        </Button>
      </div>
    </form>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create New Dashboard</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[500px]">
          {step === 'method' && renderMethodSelection()}
          {step === 'template' && renderTemplateSelection()}
          {step === 'custom' && renderCustomForm()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
