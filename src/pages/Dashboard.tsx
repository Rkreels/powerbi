
import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, DollarSign, Filter, RefreshCw, Download, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const salesData = [
    { month: 'Jan', sales: 4000, target: 3800 },
    { month: 'Feb', sales: 3000, target: 3200 },
    { month: 'Mar', sales: 5000, target: 4500 },
    { month: 'Apr', sales: 4500, target: 4200 },
    { month: 'May', sales: 6000, target: 5500 },
    { month: 'Jun', sales: 5500, target: 5800 }
  ];

  const regionData = [
    { name: 'North America', value: 400, color: '#0088FE' },
    { name: 'Europe', value: 300, color: '#00C49F' },
    { name: 'Asia Pacific', value: 200, color: '#FFBB28' },
    { name: 'Others', value: 100, color: '#FF8042' }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign size={24} className="text-green-600" />
    },
    {
      title: 'Active Users',
      value: '14.2K',
      change: '+8.1%',
      trend: 'up',
      icon: <Users size={24} className="text-blue-600" />
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-2.4%',
      trend: 'down',
      icon: <TrendingUp size={24} className="text-orange-600" />
    },
    {
      title: 'Avg Order Value',
      value: '$156',
      change: '+5.7%',
      trend: 'up',
      icon: <BarChart2 size={24} className="text-purple-600" />
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Sales Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor your key business metrics and performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert('Filter functionality would be implemented here')}
          >
            <Filter size={16} className="mr-1" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert('Export functionality would be implemented here')}
          >
            <Download size={16} className="mr-1" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              navigator.share?.({
                title: 'Power BI Dashboard',
                text: 'Check out this dashboard',
                url: window.location.href
              }) || alert('Sharing functionality would be implemented here');
            }}
          >
            <Share2 size={16} className="mr-1" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert('More options would be implemented here')}
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                <p className={`text-sm mt-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} from last month
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#8884d8" />
            <Bar dataKey="target" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
