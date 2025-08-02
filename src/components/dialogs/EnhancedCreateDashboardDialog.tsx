import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { dataService } from '@/services/dataService';
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Package,
  Calendar,
  Zap,
  Clock
} from 'lucide-react';

interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  features: string[];
  tiles: Array<{
    type: 'kpi' | 'chart' | 'table';
    title: string;
    description: string;
  }>;
}

const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'executive-overview',
    name: 'Executive Overview',
    description: 'High-level KPIs and metrics for executive decision making',
    category: 'Leadership',
    icon: <TrendingUp className="w-8 h-8" />,
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    features: ['Key Metrics', 'Revenue Trends', 'Performance Indicators', 'Executive Summary'],
    tiles: [
      { type: 'kpi', title: 'Total Revenue', description: 'Monthly recurring revenue' },
      { type: 'kpi', title: 'Customer Growth', description: 'Net new customers this month' },
      { type: 'chart', title: 'Revenue Trend', description: 'Monthly revenue over time' },
      { type: 'chart', title: 'Department Performance', description: 'Performance by department' }
    ]
  },
  {
    id: 'sales-performance',
    name: 'Sales Performance Dashboard',
    description: 'Comprehensive sales metrics, pipeline, and team performance',
    category: 'Sales',
    icon: <DollarSign className="w-8 h-8" />,
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    features: ['Sales Pipeline', 'Team Performance', 'Territory Analysis', 'Deal Tracking'],
    tiles: [
      { type: 'kpi', title: 'Monthly Sales', description: 'Current month sales total' },
      { type: 'kpi', title: 'Pipeline Value', description: 'Total value in pipeline' },
      { type: 'chart', title: 'Sales by Rep', description: 'Individual sales performance' },
      { type: 'chart', title: 'Pipeline by Stage', description: 'Deal progression analysis' },
      { type: 'table', title: 'Top Deals', description: 'Highest value opportunities' }
    ]
  },
  {
    id: 'customer-analytics',
    name: 'Customer Analytics',
    description: 'Customer behavior, satisfaction, and retention insights',
    category: 'Customer Success',
    icon: <Users className="w-8 h-8" />,
    difficulty: 'Advanced',
    estimatedTime: '40 mins',
    features: ['Customer Segmentation', 'Churn Analysis', 'Satisfaction Metrics', 'Lifetime Value'],
    tiles: [
      { type: 'kpi', title: 'Customer Satisfaction', description: 'Average CSAT score' },
      { type: 'kpi', title: 'Churn Rate', description: 'Monthly customer churn' },
      { type: 'chart', title: 'Customer Segments', description: 'Segmentation analysis' },
      { type: 'chart', title: 'Retention Cohorts', description: 'Customer retention by cohort' }
    ]
  },
  {
    id: 'operations-dashboard',
    name: 'Operations Dashboard',
    description: 'Operational efficiency, resource utilization, and process metrics',
    category: 'Operations',
    icon: <Activity className="w-8 h-8" />,
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    features: ['Resource Utilization', 'Process Efficiency', 'Quality Metrics', 'Capacity Planning'],
    tiles: [
      { type: 'kpi', title: 'Efficiency Rate', description: 'Overall operational efficiency' },
      { type: 'kpi', title: 'Resource Utilization', description: 'Current resource usage' },
      { type: 'chart', title: 'Process Performance', description: 'Key process metrics' },
      { type: 'table', title: 'Critical Issues', description: 'Current operational issues' }
    ]
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management',
    description: 'Stock levels, turnover, and supply chain optimization',
    category: 'Supply Chain',
    icon: <Package className="w-8 h-8" />,
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    features: ['Stock Levels', 'Turnover Analysis', 'Supplier Performance', 'Demand Forecasting'],
    tiles: [
      { type: 'kpi', title: 'Stock Turnover', description: 'Inventory turnover rate' },
      { type: 'kpi', title: 'Days of Inventory', description: 'Current inventory days' },
      { type: 'chart', title: 'Stock by Category', description: 'Inventory by product category' },
      { type: 'table', title: 'Low Stock Alerts', description: 'Items requiring attention' }
    ]
  }
];

interface EnhancedCreateDashboardDialogProps {
  trigger: React.ReactNode;
  onDashboardCreated?: (dashboard: any) => void;
}

export const EnhancedCreateDashboardDialog: React.FC<EnhancedCreateDashboardDialogProps> = ({ 
  trigger, 
  onDashboardCreated 
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [workspace, setWorkspace] = useState('My Workspace');
  const [refreshInterval, setRefreshInterval] = useState('hourly');
  
  const workspaces = dataService.getWorkspaces();

  const handleTemplateSelect = (template: DashboardTemplate) => {
    setSelectedTemplate(template);
    setDashboardName(template.name);
    setDashboardDescription(template.description);
    setStep(2);
  };

  const handleCreateDashboard = () => {
    if (!dashboardName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a dashboard name.",
        variant: "destructive",
      });
      return;
    }

    const newDashboard = {
      name: dashboardName,
      description: dashboardDescription,
      workspace: workspace,
      owner: 'Current User',
      reports: [],
      isPublished: false,
      tiles: selectedTemplate?.tiles || []
    };

    dataService.createDashboard(newDashboard);
    onDashboardCreated?.(newDashboard);

    toast({
      title: "Dashboard created",
      description: `"${dashboardName}" has been created successfully.`,
    });

    // Reset form
    setStep(1);
    setSelectedTemplate(null);
    setDashboardName('');
    setDashboardDescription('');
    setWorkspace('My Workspace');
    setRefreshInterval('hourly');
    setOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Create New Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs value={step === 1 ? "templates" : "configure"} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates" disabled={step !== 1}>Choose Template</TabsTrigger>
            <TabsTrigger value="configure" disabled={step !== 2}>Configure Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="flex-1 overflow-auto">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Choose a Dashboard Template</h3>
                <p className="text-sm text-muted-foreground">
                  Select from our collection of professional dashboard templates
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DASHBOARD_TEMPLATES.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {template.icon}
                          <div>
                            <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs mb-3 line-clamp-2">
                        {template.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.estimatedTime}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs font-medium mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Includes {template.tiles.length} tiles:</p>
                        <ul className="space-y-1">
                          {template.tiles.slice(0, 3).map((tile, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                              {tile.title}
                            </li>
                          ))}
                          {template.tiles.length > 3 && (
                            <li className="text-muted-foreground">
                              +{template.tiles.length - 3} more tiles
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="configure" className="flex-1 overflow-auto">
            {selectedTemplate && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Configure Your Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize the settings for your new dashboard
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Dashboard Name</label>
                      <Input
                        value={dashboardName}
                        onChange={(e) => setDashboardName(e.target.value)}
                        placeholder="Enter dashboard name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={dashboardDescription}
                        onChange={(e) => setDashboardDescription(e.target.value)}
                        placeholder="Enter dashboard description"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Workspace</label>
                      <Select value={workspace} onValueChange={setWorkspace}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select workspace" />
                        </SelectTrigger>
                        <SelectContent>
                          {workspaces.map((ws) => (
                            <SelectItem key={ws.id} value={ws.name}>
                              {ws.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Data Refresh Interval</label>
                      <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select refresh interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15min">Every 15 minutes</SelectItem>
                          <SelectItem value="30min">Every 30 minutes</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="manual">Manual only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Template Preview</h4>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          {selectedTemplate.icon}
                          <div>
                            <CardTitle className="text-sm">{selectedTemplate.name}</CardTitle>
                            <CardDescription className="text-xs">{selectedTemplate.category}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">
                          {selectedTemplate.description}
                        </p>
                        
                        <div className="space-y-2">
                          <p className="text-xs font-medium">Dashboard will include:</p>
                          {selectedTemplate.tiles.map((tile, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                              <div>
                                <p className="text-xs font-medium">{tile.title}</p>
                                <p className="text-xs text-muted-foreground">{tile.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {selectedTemplate.estimatedTime}
                            </span>
                            <Badge className={`text-xs ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                              {selectedTemplate.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back to Templates
                  </Button>
                  <Button onClick={handleCreateDashboard}>
                    <Zap className="w-4 h-4 mr-1" />
                    Create Dashboard
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCreateDashboardDialog;