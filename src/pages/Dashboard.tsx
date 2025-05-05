
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { BarChart2, Grid2X2, List, Plus, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Sales Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Last updated: Today at 9:45 AM</span>
            <button className="ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded">
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
          />
          <DashboardTile 
            title="Product Analysis" 
            description="Top products by region" 
            icon={<Grid2X2 size={18} />}
            color="bg-green-500"
          />
          <DashboardTile 
            title="Customer Insights" 
            description="Customer segmentation and behavior" 
            icon={<List size={18} />}
            color="bg-purple-500"
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
              />
            ))}
            
            <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Plus size={18} />
              </div>
              <span className="text-sm font-medium">Create new report</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

interface DashboardTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardTile = ({ title, description, icon, color }: DashboardTileProps) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow transition-shadow cursor-pointer">
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
}

const RecentReport = ({ title, date }: RecentReportProps) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow cursor-pointer">
      <div className="h-24 bg-gradient-to-r from-powerbi-primary to-powerbi-secondary"></div>
      <div className="p-3">
        <h3 className="font-medium mb-1 truncate">{title}</h3>
        <p className="text-xs text-gray-500">Modified {date}</p>
      </div>
    </div>
  );
};

export default Dashboard;
