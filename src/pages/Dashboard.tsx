
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, TrendingUp, Users, DollarSign, Filter, RefreshCw, Download, Share2, MoreHorizontal, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { toast } from "@/hooks/use-toast";
import { dataService } from '@/services/dataService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [visibleCharts, setVisibleCharts] = useState({ sales: true, region: true, performance: true, area: true });

  const salesData = [
    { month: 'Jan', sales: 4000, target: 3800, profit: 1200 },
    { month: 'Feb', sales: 3000, target: 3200, profit: 900 },
    { month: 'Mar', sales: 5000, target: 4500, profit: 1600 },
    { month: 'Apr', sales: 4500, target: 4200, profit: 1400 },
    { month: 'May', sales: 6000, target: 5500, profit: 2100 },
    { month: 'Jun', sales: 5500, target: 5800, profit: 1800 },
    { month: 'Jul', sales: 7200, target: 6000, profit: 2500 },
    { month: 'Aug', sales: 6800, target: 6500, profit: 2300 },
    { month: 'Sep', sales: 7500, target: 7000, profit: 2700 },
    { month: 'Oct', sales: 8200, target: 7500, profit: 3000 },
    { month: 'Nov', sales: 9100, target: 8000, profit: 3400 },
    { month: 'Dec', sales: 10500, target: 9000, profit: 3900 }
  ];

  const regionData = [
    { name: 'North America', value: 4200000, color: '#0088FE' },
    { name: 'Europe', value: 3100000, color: '#00C49F' },
    { name: 'Asia Pacific', value: 2800000, color: '#FFBB28' },
    { name: 'Latin America', value: 1200000, color: '#FF8042' },
    { name: 'Middle East', value: 800000, color: '#8884d8' }
  ];

  const filteredSalesData = activeFilter
    ? salesData.filter((_, i) => {
        if (activeFilter === 'Q1') return i < 3;
        if (activeFilter === 'Q2') return i >= 3 && i < 6;
        if (activeFilter === 'Q3') return i >= 6 && i < 9;
        if (activeFilter === 'Q4') return i >= 9;
        return true;
      })
    : salesData;

  const kpiCards = [
    { title: 'Total Revenue', value: '$12.2M', change: '+12.5%', trend: 'up', icon: <DollarSign size={24} className="text-green-600" /> },
    { title: 'Active Users', value: '14.2K', change: '+8.1%', trend: 'up', icon: <Users size={24} className="text-blue-600" /> },
    { title: 'Conversion Rate', value: '3.2%', change: '-2.4%', trend: 'down', icon: <TrendingUp size={24} className="text-orange-600" /> },
    { title: 'Avg Order Value', value: '$156', change: '+5.7%', trend: 'up', icon: <BarChart2 size={24} className="text-purple-600" /> }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: "Dashboard refreshed", description: "All data updated.", duration: 2000 });
    }, 1500);
  };

  const handleExport = (format: string) => {
    let content = '';
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'csv') {
      content = `Month,Sales,Target,Profit\n${salesData.map(item => `${item.month},${item.sales},${item.target},${item.profit}`).join('\n')}`;
      mimeType = 'text/csv';
      extension = 'csv';
    } else if (format === 'json') {
      content = JSON.stringify({ kpis: kpiCards.map(k => ({ title: k.title, value: k.value, change: k.change })), salesData, regionData, exportedAt: new Date().toISOString() }, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.${extension}`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "Export completed", description: `Dashboard exported as ${format.toUpperCase()}.`, duration: 2000 });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Sales Dashboard', text: 'Check out this sales dashboard', url: shareUrl }).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copied", description: "Dashboard link copied to clipboard.", duration: 2000 });
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copied", description: "Dashboard link copied to clipboard.", duration: 2000 });
    }
  };

  const toggleChart = (chart: string) => {
    setVisibleCharts(prev => ({ ...prev, [chart]: !prev[chart as keyof typeof prev] }));
  };

  return (
    <div className="w-full h-full p-4 md:p-6 bg-gray-50 overflow-auto">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">Sales Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor your key business metrics and performance</p>
        </div>
        
        <div className="flex items-center flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilterDialog(true)}>
            <Filter size={16} className="mr-1" />
            {activeFilter || 'Filter'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Download size={16} className="mr-1" />Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 size={16} className="mr-1" />Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><MoreHorizontal size={16} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => toggleChart('sales')}>
                {visibleCharts.sales ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                {visibleCharts.sales ? 'Hide' : 'Show'} Sales Trend
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleChart('region')}>
                {visibleCharts.region ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                {visibleCharts.region ? 'Hide' : 'Show'} Region Chart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleChart('performance')}>
                {visibleCharts.performance ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                {visibleCharts.performance ? 'Hide' : 'Show'} Performance Chart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/report')}>Open in Report Editor</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>Dashboard Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg border shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">{kpi.title}</p>
                <p className="text-lg md:text-2xl font-bold mt-1">{kpi.value}</p>
                <p className={`text-xs md:text-sm mt-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} from last month
                </p>
              </div>
              <div className="p-2 md:p-3 bg-gray-50 rounded-lg hidden sm:block">{kpi.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {visibleCharts.sales && (
          <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Sales vs Target {activeFilter ? `(${activeFilter})` : ''}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Sales" />
                <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                <Line type="monotone" dataKey="profit" stroke="#ffc658" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {visibleCharts.region && (
          <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue by Region</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={regionData} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80} fill="#8884d8" dataKey="value">
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {visibleCharts.performance && (
        <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Performance {activeFilter ? `(${activeFilter})` : ''}</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={filteredSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales" />
              <Bar dataKey="target" fill="#82ca9d" name="Target" />
              <Bar dataKey="profit" fill="#ffc658" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Filter Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-gray-500">Select a time period to filter the data:</p>
            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
              <Button
                key={q}
                variant={activeFilter === q ? 'default' : 'outline'}
                className="mr-2"
                onClick={() => { setActiveFilter(activeFilter === q ? null : q); setShowFilterDialog(false); }}
              >
                {q} {q === 'Q1' ? '(Jan-Mar)' : q === 'Q2' ? '(Apr-Jun)' : q === 'Q3' ? '(Jul-Sep)' : '(Oct-Dec)'}
              </Button>
            ))}
            {activeFilter && (
              <Button variant="ghost" onClick={() => { setActiveFilter(null); setShowFilterDialog(false); }}>
                Clear Filter
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
