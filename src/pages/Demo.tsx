
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, Table, ChevronDown, ChevronRight, BarChart2, PieChart, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  const navigate = useNavigate();
  const [expandedDataset, setExpandedDataset] = useState<string | null>(null);

  const toggleDataset = (id: string) => {
    if (expandedDataset === id) {
      setExpandedDataset(null);
    } else {
      setExpandedDataset(id);
    }
  };

  const handleUseDataset = (datasetId: string) => {
    // In a real app, this would load the dataset into the system
    toast({
      title: "Dataset selected",
      description: `${datasets.find(d => d.id === datasetId)?.name} has been loaded into your workspace.`,
      duration: 3000,
    });
    navigate('/report');
  };

  const datasets = [
    {
      id: 'retail-sales',
      name: 'Retail Sales Analysis',
      description: 'Comprehensive retail sales data including products, regions, customer segments, and time periods.',
      complexity: 'Advanced',
      size: '2.5MB',
      records: '125,000',
      tables: [
        { name: 'Sales', records: '85,000', fields: ['Date', 'ProductID', 'StoreID', 'Quantity', 'Revenue', 'Discount'] },
        { name: 'Products', records: '5,000', fields: ['ProductID', 'ProductName', 'Category', 'SubCategory', 'Brand', 'Cost', 'RetailPrice'] },
        { name: 'Stores', records: '250', fields: ['StoreID', 'StoreName', 'Region', 'City', 'Address', 'Size', 'OpenDate'] },
        { name: 'Customers', records: '35,000', fields: ['CustomerID', 'Segment', 'Age', 'Gender', 'Income', 'Education'] },
      ],
      visualizations: ['sales-by-category', 'regional-performance', 'customer-segmentation']
    },
    {
      id: 'financial-metrics',
      name: 'Financial Performance Dashboard',
      description: 'Enterprise financial data including income, expenses, profit margins, and forecasts.',
      complexity: 'Expert',
      size: '3.2MB',
      records: '180,000',
      tables: [
        { name: 'Revenue', records: '48,000', fields: ['Date', 'DepartmentID', 'ProductLine', 'Amount', 'Channel'] },
        { name: 'Expenses', records: '36,000', fields: ['Date', 'DepartmentID', 'Category', 'SubCategory', 'Amount'] },
        { name: 'Departments', records: '12', fields: ['DepartmentID', 'Name', 'Director', 'Budget', 'HeadCount'] },
        { name: 'ForecastModels', records: '96,000', fields: ['Date', 'ModelID', 'DepartmentID', 'PredictedRevenue', 'PredictedExpense', 'Confidence'] },
      ],
      visualizations: ['profit-loss', 'expense-breakdown', 'budget-variance']
    },
    {
      id: 'marketing-analytics',
      name: 'Marketing Campaign Analytics',
      description: 'Marketing performance data including campaigns, channels, conversions, and customer journey metrics.',
      complexity: 'Intermediate',
      size: '1.8MB',
      records: '95,000',
      tables: [
        { name: 'Campaigns', records: '120', fields: ['CampaignID', 'Name', 'StartDate', 'EndDate', 'Budget', 'TargetAudience', 'Objective'] },
        { name: 'Channels', records: '15', fields: ['ChannelID', 'Name', 'Type', 'CostModel'] },
        { name: 'CampaignMetrics', records: '48,000', fields: ['Date', 'CampaignID', 'ChannelID', 'Impressions', 'Clicks', 'Conversions', 'Spend'] },
        { name: 'CustomerJourney', records: '45,000', fields: ['CustomerID', 'Timestamp', 'TouchpointID', 'Action', 'ConversionValue'] },
      ],
      visualizations: ['channel-performance', 'campaign-roi', 'conversion-funnel']
    },
  ];

  const sampleVisualizations = [
    {
      id: 'sales-by-category',
      name: 'Sales by Product Category',
      type: 'bar',
      dataset: 'retail-sales',
      description: 'Analysis of sales performance across different product categories.',
      thumbnail: '/images/bar-chart.png'
    },
    {
      id: 'regional-performance',
      name: 'Regional Sales Performance',
      type: 'map',
      dataset: 'retail-sales',
      description: 'Geographical distribution of sales across regions with performance indicators.',
      thumbnail: '/images/map-chart.png'
    },
    {
      id: 'profit-loss',
      name: 'Profit & Loss Statement',
      type: 'line',
      dataset: 'financial-metrics',
      description: 'Monthly profit and loss trends with forecast projections.',
      thumbnail: '/images/line-chart.png'
    },
    {
      id: 'campaign-roi',
      name: 'Campaign ROI Analysis',
      type: 'scatter',
      dataset: 'marketing-analytics',
      description: 'Return on investment analysis for marketing campaigns by channel and audience segment.',
      thumbnail: '/images/scatter-chart.png'
    },
    {
      id: 'customer-segmentation',
      name: 'Customer Segmentation',
      type: 'pie',
      dataset: 'retail-sales',
      description: 'Distribution of customers across different segments with purchasing behavior.',
      thumbnail: '/images/pie-chart.png'
    },
    {
      id: 'conversion-funnel',
      name: 'Conversion Funnel',
      type: 'funnel',
      dataset: 'marketing-analytics',
      description: 'Customer journey stages from awareness to purchase with conversion rates.',
      thumbnail: '/images/funnel-chart.png'
    },
  ];

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Practice with Demo Data</h1>
          <p className="text-gray-600">
            Use these ready-made datasets to learn and practice Power BI techniques from basic to advanced analytics.
          </p>
        </div>

        <Tabs defaultValue="datasets" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="datasets">Sample Datasets</TabsTrigger>
            <TabsTrigger value="visualizations">Sample Visualizations</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials & Guides</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datasets" className="space-y-4">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Table className="mr-2 text-powerbi-primary" size={18} />
                        {dataset.name}
                        <span className="ml-3 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {dataset.complexity}
                        </span>
                      </CardTitle>
                      <CardDescription>{dataset.description}</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleDataset(dataset.id)}
                      className="gap-1"
                    >
                      {expandedDataset === dataset.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      Details
                    </Button>
                  </div>
                </CardHeader>
                
                {expandedDataset === dataset.id && (
                  <CardContent className="pt-4 bg-gray-50/50">
                    <div className="text-sm text-gray-600 mb-3">
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="font-medium">Size:</span> {dataset.size}
                        </div>
                        <div>
                          <span className="font-medium">Records:</span> {dataset.records}
                        </div>
                        <div>
                          <span className="font-medium">Tables:</span> {dataset.tables.length}
                        </div>
                      </div>
                      
                      <div className="border rounded-md overflow-hidden bg-white">
                        <table className="w-full text-left">
                          <thead className="bg-gray-100 text-xs uppercase">
                            <tr>
                              <th className="px-4 py-2">Table Name</th>
                              <th className="px-4 py-2">Records</th>
                              <th className="px-4 py-2">Fields</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {dataset.tables.map((table, i) => (
                              <tr key={i} className="text-xs">
                                <td className="px-4 py-2 font-medium">{table.name}</td>
                                <td className="px-4 py-2">{table.records}</td>
                                <td className="px-4 py-2">
                                  <div className="flex flex-wrap gap-1">
                                    {table.fields.map((field, j) => (
                                      <span key={j} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                        {field}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                )}
                
                <CardFooter className="flex justify-between p-4 bg-white">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{dataset.tables.length} tables</span> • 
                    <span className="ml-2">{dataset.records} records</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download size={14} />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleUseDataset(dataset.id)}
                    >
                      Use This Dataset
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="visualizations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleVisualizations.map((viz) => {
                const dataset = datasets.find(d => d.id === viz.dataset);
                
                return (
                  <Card key={viz.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-powerbi-primary/80 to-powerbi-secondary/80 flex items-center justify-center">
                      {viz.type === 'bar' && <BarChart2 size={48} className="text-white opacity-75" />}
                      {viz.type === 'pie' && <PieChart size={48} className="text-white opacity-75" />}
                      {viz.type === 'line' && <LineChart size={48} className="text-white opacity-75" />}
                      {!['bar', 'pie', 'line'].includes(viz.type) && <BarChart2 size={48} className="text-white opacity-75" />}
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{viz.name}</CardTitle>
                          <CardDescription className="text-xs">
                            From {dataset?.name || viz.dataset}
                          </CardDescription>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded uppercase">{viz.type}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600">{viz.description}</p>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Visualization template loaded",
                            description: `${viz.name} template has been added to your report.`,
                            duration: 2000,
                          });
                          navigate('/report');
                        }}
                      >
                        Use This Template
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="tutorials" className="space-y-4">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-medium mb-4">Getting Started with Power BI</h2>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Beginner's Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600">
                    Learn the basics of creating reports, connecting to data sources, and designing visualizations.
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Tutorial
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Data Modeling</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600">
                    Master the art of creating relationships between tables and optimizing your data model.
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Tutorial
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Advanced Visualizations</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600">
                    Create complex visualizations with custom formatting and interactive features.
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Tutorial
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <h3 className="font-medium mb-3">Video Tutorials</h3>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="bg-gray-100 rounded-lg p-4 flex gap-4">
                  <div className="w-24 h-16 bg-gray-300 rounded flex items-center justify-center">
                    <Play />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Creating Your First Dashboard</h4>
                    <p className="text-xs text-gray-600 mb-2">Learn how to build an interactive dashboard from scratch</p>
                    <span className="text-xs text-gray-500">12:34 • Beginner</span>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-4 flex gap-4">
                  <div className="w-24 h-16 bg-gray-300 rounded flex items-center justify-center">
                    <Play />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Working with DAX Formulas</h4>
                    <p className="text-xs text-gray-600 mb-2">Master data analysis expressions for powerful calculations</p>
                    <span className="text-xs text-gray-500">18:45 • Intermediate</span>
                  </div>
                </div>
              </div>
              
              <Button>Browse All Tutorials</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

const Play = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5V19L19 12L8 5Z" fill="#6264A7" />
  </svg>
);

export default Demo;
