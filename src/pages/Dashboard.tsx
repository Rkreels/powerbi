
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { BarChart2, Grid2X2, List, Plus, RefreshCw, Search, Filter, Calendar, MessageSquare as Chat } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState('last30Days');
  const [reportName, setReportName] = useState("New Sales Report");
  const [datasetSelection, setDatasetSelection] = useState("sales");

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard refreshed",
        description: "All data has been updated to the latest version.",
        duration: 2000,
      });
    }, 1000);
  };

  const handleCreateReport = () => {
    setIsCreateDialogOpen(false);
    navigate('/report');
    toast({
      title: "New report created",
      description: `You are now editing ${reportName}.`,
      duration: 3000,
    });
  };

  const handleOpenReport = (reportId: number) => {
    navigate('/report');
    toast({
      title: "Report opened",
      description: `You are now viewing Sales Report ${reportId}.`,
      duration: 2000,
    });
  };

  const filterDashboards = [
    {
      title: "Sales Overview",
      description: "Monthly sales performance",
      icon: <BarChart2 size={18} />,
      color: "bg-blue-500"
    },
    {
      title: "Product Analysis",
      description: "Top products by region",
      icon: <Grid2X2 size={18} />,
      color: "bg-green-500"
    },
    {
      title: "Customer Insights",
      description: "Customer segmentation and behavior",
      icon: <List size={18} />,
      color: "bg-purple-500"
    },
    {
      title: "Marketing Performance",
      description: "Campaign metrics and ROI analysis",
      icon: <BarChart2 size={18} />,
      color: "bg-orange-500"
    },
    {
      title: "Inventory Management",
      description: "Stock levels and projections",
      icon: <Grid2X2 size={18} />,
      color: "bg-teal-500"
    }
  ].filter(dashboard => 
    dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Sales Dashboard</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Last updated: Today at 9:45 AM</span>
              <button 
                className={`ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded flex items-center ${isRefreshing ? 'animate-spin' : ''}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search dashboards" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-powerbi-primary"
              />
            </div>
            <button 
              className={`p-2 rounded border ${filterOpen ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} />
            </button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus size={16} className="mr-1" />
              Create Report
            </Button>
          </div>
        </div>
        
        {filterOpen && (
          <div className="mb-6 p-4 bg-white rounded-md shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Filter Dashboards</h3>
              <button 
                className="text-xs text-powerbi-primary font-medium hover:underline"
                onClick={() => setFilterOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <select 
                  className="w-full border rounded-md p-2"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="last7Days">Last 7 days</option>
                  <option value="last30Days">Last 30 days</option>
                  <option value="last3Months">Last 3 months</option>
                  <option value="lastYear">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categories</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                    Sales
                    <button className="ml-1">×</button>
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                    Marketing
                    <button className="ml-1">×</button>
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner</label>
                <select className="w-full border rounded-md p-2">
                  <option value="all">All users</option>
                  <option value="me">My dashboards</option>
                  <option value="team">Team dashboards</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => {
                  setDateRange('last30Days');
                  toast({
                    title: "Filters reset",
                    description: "All filters have been reset to default values.",
                    duration: 2000,
                  });
                }}
              >
                Reset
              </Button>
              <Button onClick={() => {
                setFilterOpen(false);
                toast({
                  title: "Filters applied",
                  description: "The dashboard list has been filtered based on your criteria.",
                  duration: 2000,
                });
              }}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Dashboard tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filterDashboards.map((dashboard, index) => (
            <DashboardTile 
              key={index}
              title={dashboard.title} 
              description={dashboard.description} 
              icon={dashboard.icon}
              color={dashboard.color}
              onClick={() => {
                toast({
                  title: dashboard.title,
                  description: `Opening ${dashboard.title} dashboard...`,
                  duration: 2000,
                });
              }}
            />
          ))}
        </div>
        
        {/* Recent reports */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent reports</h2>
            <button className="text-sm text-powerbi-primary hover:underline">View all</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(3)].map((_, index) => (
              <RecentReport 
                key={index} 
                title={`Sales Report ${index + 1}`}
                date={`${index + 1} day${index > 0 ? 's' : ''} ago`}
                onClick={() => handleOpenReport(index + 1)}
              />
            ))}
            
            <div 
              className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Plus size={18} />
              </div>
              <span className="text-sm font-medium">Create new report</span>
            </div>
          </div>
        </div>
        
        {/* Activity feed */}
        <div>
          <h2 className="text-lg font-medium mb-4">Recent activity</h2>
          <div className="bg-white rounded-lg border p-4">
            <div className="divide-y">
              <ActivityItem 
                title="Sales Report 1" 
                action="edited" 
                user="You" 
                time="Just now" 
                icon={<Calendar size={16} />} 
              />
              <ActivityItem 
                title="Product Analysis" 
                action="viewed" 
                user="Maria Chen" 
                time="2 hours ago" 
                icon={<BarChart2 size={16} />} 
              />
              <ActivityItem 
                title="Customer Insights" 
                action="shared with" 
                user="Dev Team" 
                time="Yesterday" 
                icon={<List size={16} />} 
              />
              <ActivityItem 
                title="Sales Overview" 
                action="commented on" 
                user="John Smith" 
                time="2 days ago" 
                icon={<Chat size={16} className="text-gray-500" />} 
              />
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new report</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="report-name" className="text-sm font-medium block mb-1">Report name</label>
                <input
                  id="report-name"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="report-dataset" className="text-sm font-medium block mb-1">Dataset</label>
                <select
                  id="report-dataset"
                  className="w-full p-2 border rounded-md"
                  value={datasetSelection}
                  onChange={(e) => setDatasetSelection(e.target.value)}
                >
                  <option value="sales">Sales Dataset</option>
                  <option value="marketing">Marketing Dataset</option>
                  <option value="finance">Finance Dataset</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Template</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                    <div className="text-xs font-medium">Sales Analysis</div>
                  </div>
                  <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded mb-2"></div>
                    <div className="text-xs font-medium">Marketing Dashboard</div>
                  </div>
                  <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 flex items-center justify-center">
                      <Plus size={24} className="text-gray-400" />
                    </div>
                    <div className="text-xs font-medium">Blank Report</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

interface DashboardTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const DashboardTile = ({ title, description, icon, color, onClick }: DashboardTileProps) => {
  return (
    <div 
      className="bg-white border rounded-lg shadow-sm p-4 hover:shadow transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <div className={`w-8 h-8 ${color} text-white rounded flex items-center justify-center mr-3`}>
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-500">
        <Calendar size={12} className="mr-1" />
        <span>Updated today</span>
      </div>
    </div>
  );
};

interface RecentReportProps {
  title: string;
  date: string;
  onClick?: () => void;
}

const RecentReport = ({ title, date, onClick }: RecentReportProps) => {
  return (
    <div 
      className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="h-24 bg-gradient-to-r from-powerbi-primary to-powerbi-secondary"></div>
      <div className="p-3">
        <h3 className="font-medium mb-1 truncate">{title}</h3>
        <p className="text-xs text-gray-500">Modified {date}</p>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  title: string;
  action: string;
  user: string;
  time: string;
  icon: React.ReactNode;
}

const ActivityItem = ({ title, action, user, time, icon }: ActivityItemProps) => {
  return (
    <div className="py-3 flex items-start">
      <div className="bg-gray-100 p-2 rounded mr-3">
        {icon}
      </div>
      <div>
        <div className="text-sm">
          <span className="font-medium">{user}</span> {action} <span className="font-medium text-powerbi-primary">{title}</span>
        </div>
        <div className="text-xs text-gray-500">{time}</div>
      </div>
    </div>
  );
};

export default Dashboard;
