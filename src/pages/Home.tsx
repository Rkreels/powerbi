
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart2, FileSearch, Layout, Users, Clock, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  const recentItems = [
    {
      title: 'Sales Dashboard',
      type: 'dashboard',
      lastModified: '2 hours ago',
      icon: <Layout size={20} className="text-blue-600" />
    },
    {
      title: 'Monthly Report',
      type: 'report',
      lastModified: '1 day ago',
      icon: <BarChart2 size={20} className="text-green-600" />
    },
    {
      title: 'Customer Data',
      type: 'dataset',
      lastModified: '3 days ago',
      icon: <FileSearch size={20} className="text-orange-600" />
    }
  ];

  const quickActions = [
    {
      title: 'Create Report',
      description: 'Build a new report from your data',
      icon: <BarChart2 size={24} />,
      color: 'bg-green-500',
      action: () => navigate('/report')
    },
    {
      title: 'Upload Data',
      description: 'Connect to new data sources',
      icon: <Plus size={24} />,
      color: 'bg-blue-500',
      action: () => navigate('/datasets')
    },
    {
      title: 'Browse Dashboards',
      description: 'View existing dashboards',
      icon: <Layout size={24} />,
      color: 'bg-purple-500',
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Power BI</h1>
        <p className="text-gray-600">Create, share, and collaborate on data insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={action.action}
          >
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4`}>
              {action.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Items</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer">
                  {item.icon}
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.type} • {item.lastModified}</div>
                  </div>
                  <Star size={16} className="text-gray-400 hover:text-yellow-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Getting Started</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                <div>
                  <div className="font-medium">Connect your data</div>
                  <div className="text-sm text-gray-500">Upload files or connect to databases</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                <div>
                  <div className="font-medium">Create visualizations</div>
                  <div className="text-sm text-gray-500">Build charts and graphs from your data</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                <div>
                  <div className="font-medium">Share insights</div>
                  <div className="text-sm text-gray-500">Collaborate with your team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
