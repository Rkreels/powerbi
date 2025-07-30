
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart2, FileSearch, Layout, Users, Clock, Star, Search, Filter, TrendingUp, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateReportDialog } from "@/components/dialogs/CreateReportDialog";
import { CreateDashboardDialog } from "@/components/dialogs/CreateDashboardDialog";
import { CreateDatasetDialog } from "@/components/dialogs/CreateDatasetDialog";
import RecentContent from "@/components/home/RecentContent";
import RecommendedItems from "@/components/home/RecommendedItems";
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ reports: 0, dashboards: 0, datasets: 0 });

  useEffect(() => {
    loadRecentItems();
    loadStats();
  }, []);

  const loadRecentItems = () => {
    const items = dataService.getRecentItems();
    setRecentItems(items);
  };

  const loadStats = () => {
    const reports = dataService.getReports().length;
    const dashboards = dataService.getDashboards().length;
    const datasets = dataService.getDatasets().length;
    setStats({ reports, dashboards, datasets });
  };

  const handleItemsChange = () => {
    loadRecentItems();
    loadStats();
  };

  const recommendedItems = [
    {
      id: '1',
      title: 'Getting Started with Power BI',
      subtitle: 'Learn the basics of creating reports',
      image: '',
      type: 'tutorial' as const
    },
    {
      id: '2',
      title: 'Sales Analytics Template',
      subtitle: 'Pre-built dashboard for sales tracking',
      image: '',
      type: 'report' as const
    },
    {
      id: '3',
      title: 'Financial Dashboard Template',
      subtitle: 'Monitor key financial metrics',
      image: '',
      type: 'report' as const
    },
    {
      id: '4',
      title: 'Customer Analysis Guide',
      subtitle: 'Advanced customer segmentation techniques',
      image: '',
      type: 'tutorial' as const
    }
  ];

  const quickActions = [
    {
      title: 'Create Report',
      description: 'Build interactive reports from your data',
      icon: <BarChart2 size={24} />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      component: CreateReportDialog
    },
    {
      title: 'Create Dashboard',
      description: 'Combine multiple reports in one view',
      icon: <Layout size={24} />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      component: CreateDashboardDialog
    },
    {
      title: 'Connect Data',
      description: 'Import data from various sources',
      icon: <Plus size={24} />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      component: CreateDatasetDialog
    },
    {
      title: 'Browse Content',
      description: 'Explore existing reports and dashboards',
      icon: <FileSearch size={24} />,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Power BI
            </h1>
            <p className="text-gray-600">Create, share, and collaborate on data insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search content..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reports}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dashboards</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dashboards}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.datasets}</div>
            <p className="text-xs text-muted-foreground">
              All sources active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const DialogComponent = action.component;
            
            return (
              <div key={index}>
                {DialogComponent ? (
                  <DialogComponent 
                    trigger={
                      <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group">
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                    }
                  />
                ) : (
                  <div 
                    className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group"
                    onClick={action.action}
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Content Section */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
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
            <RecentContent 
              recentItems={recentItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              onItemsChange={handleItemsChange}
            />
          </div>
        </div>

        {/* Quick Stats & Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">1</div>
                <div>
                  <div className="font-medium">Connect your data</div>
                  <div className="text-sm text-gray-500">Upload files or connect to databases</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">2</div>
                <div>
                  <div className="font-medium">Create visualizations</div>
                  <div className="text-sm text-gray-500">Build charts and graphs from your data</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">3</div>
                <div>
                  <div className="font-medium">Share insights</div>
                  <div className="text-sm text-gray-500">Collaborate with your team</div>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={() => navigate('/demo')}
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <TrendingUp size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use filters to focus on specific data segments</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Users size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Share dashboards with your team for collaboration</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Set up automatic data refresh for real-time insights</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Items */}
      <RecommendedItems items={recommendedItems} />
    </div>
  );
};

export default Home;
