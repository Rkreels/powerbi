import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Treemap, FunnelChart, Funnel, LabelList,
  ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon,
  Activity, TrendingUp, MapPin, Zap, Target, Layers, Grid3x3,
  Calendar, Users, DollarSign, Package, ShoppingCart
} from 'lucide-react';

interface VisualizationProps {
  type: string;
  data: any[];
  config: any;
  width?: number;
  height?: number;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
];

const AdvancedVisualizations: React.FC = () => {
  const [selectedVizType, setSelectedVizType] = useState('overview');

  // Sample data for different visualization types
  const salesData = [
    { month: 'Jan', sales: 4000, target: 3800, profit: 2400, cost: 1600 },
    { month: 'Feb', sales: 3000, target: 3200, profit: 1398, cost: 1602 },
    { month: 'Mar', sales: 5000, target: 4500, profit: 3908, cost: 1092 },
    { month: 'Apr', sales: 4500, target: 4200, profit: 3800, cost: 700 },
    { month: 'May', sales: 6000, target: 5500, profit: 4300, cost: 1700 },
    { month: 'Jun', sales: 5500, target: 5800, profit: 4100, cost: 1400 }
  ];

  const geoData = [
    { country: 'USA', sales: 25000, customers: 1200 },
    { country: 'UK', sales: 18000, customers: 800 },
    { country: 'Germany', sales: 22000, customers: 950 },
    { country: 'France', sales: 16000, customers: 720 },
    { country: 'Japan', sales: 14000, customers: 650 },
    { country: 'Canada', sales: 12000, customers: 580 }
  ];

  const funnelData = [
    { name: 'Website Visitors', value: 10000, fill: '#8884d8' },
    { name: 'Product Views', value: 7500, fill: '#82ca9d' },
    { name: 'Add to Cart', value: 3200, fill: '#ffc658' },
    { name: 'Checkout', value: 1800, fill: '#ff7c7c' },
    { name: 'Purchase', value: 1200, fill: '#8dd1e1' }
  ];

  const scatterData = [
    { sales: 4000, profit: 2400, customers: 240 },
    { sales: 3000, profit: 1398, customers: 139 },
    { sales: 5000, profit: 3908, customers: 390 },
    { sales: 4500, profit: 3800, customers: 380 },
    { sales: 6000, profit: 4300, customers: 430 },
    { sales: 5500, profit: 4100, customers: 410 }
  ];

  const treemapData = [
    { name: 'Electronics', size: 120000, fill: '#8884d8' },
    { name: 'Clothing', size: 98000, fill: '#82ca9d' },
    { name: 'Home & Garden', size: 75000, fill: '#ffc658' },
    { name: 'Sports', size: 65000, fill: '#ff7c7c' },
    { name: 'Books', size: 45000, fill: '#8dd1e1' },
    { name: 'Toys', size: 35000, fill: '#d084d0' }
  ];

  const waterfallData = [
    { name: 'Starting Revenue', value: 100000, cumulative: 100000 },
    { name: 'Q1 Sales', value: 25000, cumulative: 125000 },
    { name: 'Q2 Sales', value: -15000, cumulative: 110000 },
    { name: 'Q3 Sales', value: 30000, cumulative: 140000 },
    { name: 'Q4 Sales', value: 20000, cumulative: 160000 },
    { name: 'Final Revenue', value: 160000, cumulative: 160000 }
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign size={24} className="text-green-600" />,
      sparkline: [20, 30, 45, 35, 50, 60, 55, 70]
    },
    {
      title: 'New Customers',
      value: '1,429',
      change: '+8.2%',
      trend: 'up',
      icon: <Users size={24} className="text-blue-600" />,
      sparkline: [10, 15, 12, 25, 18, 22, 30, 28]
    },
    {
      title: 'Orders',
      value: '3,284',
      change: '-2.1%',
      trend: 'down',
      icon: <ShoppingCart size={24} className="text-orange-600" />,
      sparkline: [40, 35, 42, 38, 30, 35, 32, 28]
    },
    {
      title: 'Inventory',
      value: '12,542',
      change: '+5.4%',
      trend: 'up',
      icon: <Package size={24} className="text-purple-600" />,
      sparkline: [25, 28, 22, 32, 35, 40, 38, 45]
    }
  ];

  const vizTypes = [
    { id: 'overview', label: 'Overview', icon: <Grid3x3 size={16} /> },
    { id: 'bar', label: 'Bar Charts', icon: <BarChart3 size={16} /> },
    { id: 'line', label: 'Line Charts', icon: <LineChartIcon size={16} /> },
    { id: 'pie', label: 'Pie Charts', icon: <PieChartIcon size={16} /> },
    { id: 'advanced', label: 'Advanced', icon: <Layers size={16} /> },
    { id: 'kpi', label: 'KPI Cards', icon: <Target size={16} /> },
    { id: 'geo', label: 'Geographic', icon: <MapPin size={16} /> },
    { id: 'funnel', label: 'Funnel', icon: <TrendingUp size={16} /> }
  ];

  const SparkLine: React.FC<{ data: number[] }> = ({ data }) => (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((value, index) => ({ value, index }))}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const WaterfallChart: React.FC<{ data: any[] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  const BulletChart: React.FC<{ actual: number; target: number; title: string }> = ({ 
    actual, target, title 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{title}</span>
        <span>{actual} / {target}</span>
      </div>
      <div className="relative h-6 bg-gray-200 rounded">
        <div 
          className="h-full bg-blue-500 rounded"
          style={{ width: `${(actual / target) * 100}%` }}
        />
        <div 
          className="absolute top-0 h-full w-1 bg-red-500"
          style={{ left: '75%' }}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-6 bg-white">
        <div className="flex items-center space-x-3">
          <BarChart3 size={20} className="text-blue-600" />
          <h1 className="text-lg font-semibold">Advanced Visualizations</h1>
          <Badge variant="outline" className="text-xs">
            Power BI Compatible
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select defaultValue="sales-data">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select dataset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales-data">Sales Data</SelectItem>
              <SelectItem value="customer-data">Customer Data</SelectItem>
              <SelectItem value="product-data">Product Data</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Customize
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Visualization Type Selector */}
        <div className="w-64 border-r bg-gray-50">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Visualization Types</h3>
            <div className="space-y-1">
              {vizTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedVizType(type.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors ${
                    selectedVizType === type.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualization Content */}
        <div className="flex-1 p-6 overflow-auto">
          {selectedVizType === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChartIcon size={18} />
                    <span>Sales Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Stacked Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 size={18} />
                    <span>Revenue Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="profit" stackId="a" fill="#8884d8" />
                        <Bar dataKey="cost" stackId="a" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Area Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity size={18} />
                    <span>Cumulative Sales</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.6} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Scatter Plot */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap size={18} />
                    <span>Sales vs Profit</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={scatterData}>
                        <CartesianGrid />
                        <XAxis dataKey="sales" name="Sales" />
                        <YAxis dataKey="profit" name="Profit" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Sales vs Profit" dataKey="profit" fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedVizType === 'kpi' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                          <p className="text-2xl font-bold">{kpi.value}</p>
                          <p className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {kpi.change} from last month
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {kpi.icon}
                          <SparkLine data={kpi.sparkline} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Bullet Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance vs Targets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <BulletChart actual={85} target={100} title="Sales Target" />
                    <BulletChart actual={92} target={100} title="Customer Satisfaction" />
                    <BulletChart actual={78} target={100} title="Market Share" />
                    <BulletChart actual={95} target={100} title="Quality Score" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedVizType === 'advanced' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* TreeMap */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category (TreeMap)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={treemapData}
                        dataKey="size"
                        ratio={4/3}
                        stroke="#fff"
                        content={({ name, size }: any) => (
                          <div className="p-2">
                            <div className="font-semibold text-white text-sm">{name}</div>
                            <div className="text-white text-xs">${size?.toLocaleString()}</div>
                          </div>
                        )}
                      />
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Waterfall Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Waterfall</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <WaterfallChart data={waterfallData} />
                  </div>
                </CardContent>
              </Card>

              {/* Radial Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Goal Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={[
                        { name: 'Q1', value: 85, fill: '#8884d8' },
                        { name: 'Q2', value: 92, fill: '#82ca9d' },
                        { name: 'Q3', value: 78, fill: '#ffc658' },
                        { name: 'Q4', value: 95, fill: '#ff7c7c' }
                      ]}>
                        <RadialBar 
                          label={{ position: 'insideStart', fill: '#fff' }} 
                          background 
                          dataKey="value" 
                        />
                        <Legend iconSize={18} layout="horizontal" verticalAlign="bottom" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Composed Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales & Profit Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" barSize={20} fill="#413ea0" />
                        <Line type="monotone" dataKey="profit" stroke="#ff7300" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedVizType === 'funnel' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <FunnelChart>
                        <Tooltip />
                        <Funnel 
                          dataKey="value" 
                          data={funnelData} 
                          isAnimationActive
                        >
                          <LabelList position="center" fill="#fff" stroke="none" />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {funnelData.map((step, index) => {
                      const nextStep = funnelData[index + 1];
                      const conversionRate = nextStep ? 
                        ((nextStep.value / step.value) * 100).toFixed(1) : 
                        '100.0';
                      
                      return (
                        <div key={step.name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{step.name}</div>
                            <div className="text-sm text-gray-600">{step.value.toLocaleString()} users</div>
                          </div>
                          {nextStep && (
                            <Badge variant="outline">
                              {conversionRate}% conversion
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedVisualizations;