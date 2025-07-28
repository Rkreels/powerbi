
import React, { useState } from 'react';
import DataPane from '@/components/reportEditor/DataPane';
import VisualizationPane from '@/components/reportEditor/VisualizationPane';
import FilterPane from '@/components/reportEditor/FilterPane';
import ReportCanvas from '@/components/reportEditor/ReportCanvas';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Download, 
  Share2, 
  Undo, 
  Redo, 
  Eye, 
  Settings, 
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Map,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const REPORT_TEMPLATES = [
  {
    id: 'sales-dashboard',
    name: 'Sales Performance Dashboard',
    description: 'Comprehensive sales analytics with revenue, trends, and regional performance',
    category: 'Sales',
    icon: <DollarSign className="w-8 h-8" />,
    preview: '/api/placeholder/300/200',
    difficulty: 'Beginner',
    estimatedTime: '15 mins',
    features: ['Revenue Charts', 'Sales Trends', 'Regional Analysis', 'KPI Cards'],
    visualizations: [
      { type: 'card', title: 'Total Revenue', data: { value: 2500000, trend: 15.3, comparison: 'vs last month' } },
      { type: 'bar', title: 'Sales by Category', data: [
        { name: 'Electronics', value: 850000 },
        { name: 'Clothing', value: 620000 },
        { name: 'Home & Garden', value: 540000 },
        { name: 'Sports', value: 490000 }
      ]},
      { type: 'line', title: 'Monthly Revenue Trend', data: [
        { name: 'Jan', value: 180000 },
        { name: 'Feb', value: 195000 },
        { name: 'Mar', value: 210000 },
        { name: 'Apr', value: 225000 },
        { name: 'May', value: 240000 },
        { name: 'Jun', value: 250000 }
      ]},
      { type: 'pie', title: 'Sales by Region', data: [
        { name: 'North America', value: 45 },
        { name: 'Europe', value: 30 },
        { name: 'Asia Pacific', value: 20 },
        { name: 'Other', value: 5 }
      ]}
    ]
  },
  {
    id: 'hr-analytics',
    name: 'HR Analytics Dashboard',
    description: 'Employee metrics, performance tracking, and workforce analytics',
    category: 'Human Resources',
    icon: <Users className="w-8 h-8" />,
    preview: '/api/placeholder/300/200',
    difficulty: 'Intermediate',
    estimatedTime: '25 mins',
    features: ['Employee Metrics', 'Performance Tracking', 'Hiring Trends', 'Diversity Analytics'],
    visualizations: [
      { type: 'card', title: 'Total Employees', data: { value: 1247, trend: 8.2, comparison: 'vs last quarter' } },
      { type: 'bar', title: 'Employees by Department', data: [
        { name: 'Engineering', value: 320 },
        { name: 'Sales', value: 285 },
        { name: 'Marketing', value: 180 },
        { name: 'HR', value: 95 },
        { name: 'Finance', value: 87 }
      ]},
      { type: 'line', title: 'Hiring Trend', data: [
        { name: 'Q1', value: 45 },
        { name: 'Q2', value: 52 },
        { name: 'Q3', value: 48 },
        { name: 'Q4', value: 61 }
      ]},
      { type: 'pie', title: 'Employee Satisfaction', data: [
        { name: 'Very Satisfied', value: 35 },
        { name: 'Satisfied', value: 45 },
        { name: 'Neutral', value: 15 },
        { name: 'Dissatisfied', value: 5 }
      ]}
    ]
  },
  {
    id: 'marketing-roi',
    name: 'Marketing ROI Dashboard',
    description: 'Campaign performance, customer acquisition, and marketing spend analysis',
    category: 'Marketing',
    icon: <Target className="w-8 h-8" />,
    preview: '/api/placeholder/300/200',
    difficulty: 'Advanced',
    estimatedTime: '35 mins',
    features: ['Campaign Tracking', 'ROI Analysis', 'Customer Acquisition', 'Channel Performance'],
    visualizations: [
      { type: 'card', title: 'Marketing ROI', data: { value: 3.2, trend: 12.5, comparison: 'vs last campaign' } },
      { type: 'bar', title: 'Campaign Performance', data: [
        { name: 'Social Media', value: 45000 },
        { name: 'Email', value: 32000 },
        { name: 'PPC', value: 28000 },
        { name: 'Content', value: 21000 }
      ]},
      { type: 'line', title: 'Customer Acquisition Cost', data: [
        { name: 'Jan', value: 85 },
        { name: 'Feb', value: 78 },
        { name: 'Mar', value: 82 },
        { name: 'Apr', value: 75 },
        { name: 'May', value: 71 },
        { name: 'Jun', value: 68 }
      ]},
      { type: 'pie', title: 'Lead Sources', data: [
        { name: 'Organic Search', value: 40 },
        { name: 'Social Media', value: 25 },
        { name: 'Paid Ads', value: 20 },
        { name: 'Email', value: 10 },
        { name: 'Direct', value: 5 }
      ]}
    ]
  },
  {
    id: 'financial-overview',
    name: 'Financial Overview',
    description: 'Comprehensive financial analytics with P&L, cash flow, and budget tracking',
    category: 'Finance',
    icon: <TrendingUp className="w-8 h-8" />,
    preview: '/api/placeholder/300/200',
    difficulty: 'Advanced',
    estimatedTime: '40 mins',
    features: ['P&L Analysis', 'Cash Flow', 'Budget vs Actual', 'Financial Ratios'],
    visualizations: [
      { type: 'card', title: 'Net Profit Margin', data: { value: 15.8, trend: 2.3, comparison: 'vs last year' } },
      { type: 'bar', title: 'Revenue vs Expenses', data: [
        { name: 'Q1', value: 125000 },
        { name: 'Q2', value: 142000 },
        { name: 'Q3', value: 138000 },
        { name: 'Q4', value: 155000 }
      ]},
      { type: 'line', title: 'Cash Flow Trend', data: [
        { name: 'Jan', value: 45000 },
        { name: 'Feb', value: 52000 },
        { name: 'Mar', value: 48000 },
        { name: 'Apr', value: 61000 },
        { name: 'May', value: 58000 },
        { name: 'Jun', value: 65000 }
      ]},
      { type: 'pie', title: 'Expense Breakdown', data: [
        { name: 'Salaries', value: 45 },
        { name: 'Operations', value: 25 },
        { name: 'Marketing', value: 15 },
        { name: 'Technology', value: 10 },
        { name: 'Other', value: 5 }
      ]}
    ]
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management',
    description: 'Stock levels, turnover rates, and supply chain analytics',
    category: 'Operations',
    icon: <Package className="w-8 h-8" />,
    preview: '/api/placeholder/300/200',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    features: ['Stock Levels', 'Turnover Analysis', 'Supplier Performance', 'Demand Forecasting'],
    visualizations: [
      { type: 'card', title: 'Inventory Turnover', data: { value: 6.2, trend: 8.7, comparison: 'vs last period' } },
      { type: 'bar', title: 'Stock Levels by Category', data: [
        { name: 'Raw Materials', value: 850 },
        { name: 'Components', value: 620 },
        { name: 'Finished Goods', value: 340 },
        { name: 'Packaging', value: 180 }
      ]},
      { type: 'line', title: 'Inventory Value Trend', data: [
        { name: 'Jan', value: 125000 },
        { name: 'Feb', value: 132000 },
        { name: 'Mar', value: 128000 },
        { name: 'Apr', value: 145000 },
        { name: 'May', value: 138000 },
        { name: 'Jun', value: 152000 }
      ]},
      { type: 'table', title: 'Low Stock Alerts', data: [
        { product: 'Widget A', current: 15, minimum: 50, status: 'Critical' },
        { product: 'Component B', current: 25, minimum: 40, status: 'Low' },
        { product: 'Material C', current: 8, minimum: 30, status: 'Critical' }
      ]}
    ]
  }
];

const ReportEditor = () => {
  const [reportName, setReportName] = useState('Untitled Report');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSave = () => {
    toast({
      title: "Report saved",
      description: "Your report has been saved successfully.",
      duration: 2000,
    });
  };

  const handlePublish = () => {
    toast({
      title: "Report published",
      description: "Your report is now available to share.",
      duration: 2000,
    });
  };

  const handleUndo = () => {
    toast({
      title: "Undo",
      description: "Last action has been undone.",
      duration: 1000,
    });
  };

  const handleRedo = () => {
    toast({
      title: "Redo",
      description: "Action has been redone.",
      duration: 1000,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your report is being exported as PDF.",
      duration: 2000,
    });
  };

  const handleUseTemplate = (template: any) => {
    setReportName(template.name);
    setSelectedTemplate(template);
    setShowTemplates(false);
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied to your report.`,
      duration: 3000,
    });
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
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 min-w-0"
          />
          <Badge variant="secondary" className="text-xs">
            {isPreviewMode ? 'Preview' : 'Edit'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText size={16} className="mr-1" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Report Templates & Demos
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Choose from our collection of professional report templates to get started quickly.
                </p>
              </DialogHeader>
              
              <Tabs defaultValue="templates" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="practice">Practice Scenarios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="templates" className="flex-1 overflow-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                    {REPORT_TEMPLATES.map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
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
                              <Calendar className="w-3 h-3" />
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
                          
                          <Button 
                            onClick={() => handleUseTemplate(template)}
                            className="w-full text-xs"
                            size="sm"
                          >
                            Use Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="practice" className="flex-1 overflow-auto">
                  <div className="p-4 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Beginner Challenge: Sales Report
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create a simple sales report with basic charts and KPIs. Perfect for learning the fundamentals.
                        </p>
                        <div className="flex gap-2">
                          <Badge className="text-xs bg-green-100 text-green-800">30 mins</Badge>
                          <Badge variant="outline" className="text-xs">Guided</Badge>
                        </div>
                        <Button className="w-full mt-3" size="sm">Start Challenge</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Intermediate Challenge: Financial Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Build a comprehensive financial dashboard with advanced visualizations and calculations.
                        </p>
                        <div className="flex gap-2">
                          <Badge className="text-xs bg-yellow-100 text-yellow-800">60 mins</Badge>
                          <Badge variant="outline" className="text-xs">Self-paced</Badge>
                        </div>
                        <Button className="w-full mt-3" size="sm">Start Challenge</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Map className="w-4 h-4" />
                          Advanced Challenge: Geographic Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create an interactive geographic dashboard with maps, regional data, and complex filters.
                        </p>
                        <div className="flex gap-2">
                          <Badge className="text-xs bg-red-100 text-red-800">90 mins</Badge>
                          <Badge variant="outline" className="text-xs">Expert</Badge>
                        </div>
                        <Button className="w-full mt-3" size="sm">Start Challenge</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo size={16} className="mr-1" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={handleRedo}>
            <Redo size={16} className="mr-1" />
            Redo
          </Button>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye size={16} className="mr-1" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save size={16} className="mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} className="mr-1" />
            Export
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Share2 size={16} className="mr-1" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Data & Visualizations */}
        {!isPreviewMode && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <Tabs defaultValue="data" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
                <TabsTrigger value="visualizations" className="text-xs">Visuals</TabsTrigger>
                <TabsTrigger value="filters" className="text-xs">Filters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="data" className="flex-1 overflow-hidden">
                <DataPane />
              </TabsContent>
              
              <TabsContent value="visualizations" className="flex-1 overflow-hidden">
                <VisualizationPane />
              </TabsContent>
              
              <TabsContent value="filters" className="flex-1 overflow-hidden">
                <FilterPane />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Main Canvas */}
        <ReportCanvas selectedTemplate={selectedTemplate} />
      </div>
    </div>
  );
};

export default ReportEditor;
