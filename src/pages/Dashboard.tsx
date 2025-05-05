
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { BarChart2, Grid2X2, List, Plus, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      description: "You are now editing your new report.",
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

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="mb-6">
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
        
        {/* Dashboard tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DashboardTile 
            title="Sales Overview" 
            description="Monthly sales performance" 
            icon={<BarChart2 size={18} />}
            color="bg-blue-500"
            onClick={() => {
              toast({
                title: "Sales Overview",
                description: "Opening Sales Overview dashboard...",
                duration: 2000,
              });
            }}
          />
          <DashboardTile 
            title="Product Analysis" 
            description="Top products by region" 
            icon={<Grid2X2 size={18} />}
            color="bg-green-500"
            onClick={() => {
              toast({
                title: "Product Analysis",
                description: "Opening Product Analysis dashboard...",
                duration: 2000,
              });
            }}
          />
          <DashboardTile 
            title="Customer Insights" 
            description="Customer segmentation and behavior" 
            icon={<List size={18} />}
            color="bg-purple-500"
            onClick={() => {
              toast({
                title: "Customer Insights",
                description: "Opening Customer Insights dashboard...",
                duration: 2000,
              });
            }}
          />
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
                  defaultValue="New Sales Report"
                />
              </div>
              <div>
                <label htmlFor="report-dataset" className="text-sm font-medium block mb-1">Dataset</label>
                <select
                  id="report-dataset"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="sales">Sales Dataset</option>
                  <option value="marketing">Marketing Dataset</option>
                  <option value="finance">Finance Dataset</option>
                </select>
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

export default Dashboard;
