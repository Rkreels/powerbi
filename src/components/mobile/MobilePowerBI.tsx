import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, User, Home, BarChart3, Database, 
  Settings, Share2, Download, RefreshCw, Filter, Eye,
  ChevronLeft, ChevronRight, Grid, List, Heart, Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardCard {
  id: string;
  title: string;
  type: 'report' | 'dashboard';
  lastViewed: string;
  favorite: boolean;
  owner: string;
  workspace: string;
  thumbnail?: string;
}

const MobilePowerBI: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [dashboardCards] = useState<DashboardCard[]>([
    {
      id: '1',
      title: 'Sales Performance Dashboard',
      type: 'dashboard',
      lastViewed: '2 hours ago',
      favorite: true,
      owner: 'John Doe',
      workspace: 'Sales Team'
    },
    {
      id: '2',
      title: 'Customer Analytics Report',
      type: 'report',
      lastViewed: '1 day ago',
      favorite: false,
      owner: 'Jane Smith',
      workspace: 'Marketing'
    },
    {
      id: '3',
      title: 'Financial Overview',
      type: 'dashboard',
      lastViewed: '3 days ago',
      favorite: true,
      owner: 'Mike Johnson',
      workspace: 'Finance'
    },
    {
      id: '4',
      title: 'Product Performance Analysis',
      type: 'report',
      lastViewed: '1 week ago',
      favorite: false,
      owner: 'Sarah Wilson',
      workspace: 'Product Team'
    }
  ]);

  const kpiData = [
    { title: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up' },
    { title: 'Active Users', value: '14.2K', change: '+8.1%', trend: 'up' },
    { title: 'Conversion Rate', value: '3.2%', change: '-2.4%', trend: 'down' },
    { title: 'Customer Satisfaction', value: '4.8/5', change: '+0.3', trend: 'up' }
  ];

  const chartData = [
    { name: 'Jan', sales: 4000, users: 240 },
    { name: 'Feb', sales: 3000, users: 139 },
    { name: 'Mar', sales: 5000, users: 390 },
    { name: 'Apr', sales: 4500, users: 380 },
    { name: 'May', sales: 6000, users: 430 },
    { name: 'Jun', sales: 5500, users: 410 }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredCards = dashboardCards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.workspace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="grid grid-cols-4 gap-1">
        <button
          className={`flex flex-col items-center p-3 ${activeView === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
          onClick={() => setActiveView('home')}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          className={`flex flex-col items-center p-3 ${activeView === 'reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
          onClick={() => setActiveView('reports')}
        >
          <BarChart3 size={20} />
          <span className="text-xs mt-1">Reports</span>
        </button>
        <button
          className={`flex flex-col items-center p-3 ${activeView === 'data' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
          onClick={() => setActiveView('data')}
        >
          <Database size={20} />
          <span className="text-xs mt-1">Data</span>
        </button>
        <button
          className={`flex flex-col items-center p-3 ${activeView === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
          onClick={() => setActiveView('profile')}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );

  const MobileHeader = () => (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="py-6">
                <h2 className="text-lg font-semibold mb-4">Workspaces</h2>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium">My Workspace</div>
                    <div className="text-sm text-gray-600">Personal workspace</div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg border">
                    <div className="font-medium">Sales Team</div>
                    <div className="text-sm text-gray-600">8 members</div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg border">
                    <div className="font-medium">Marketing</div>
                    <div className="text-sm text-gray-600">12 members</div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">Power BI</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="sm">
            <Search size={20} />
          </Button>
        </div>
      </div>
    </div>
  );

  const DashboardCardComponent = ({ card }: { card: DashboardCard }) => (
    <Card className={`${viewMode === 'grid' ? 'h-48' : 'h-24'} cursor-pointer transition-all hover:shadow-md`}>
      <CardContent className="p-4 h-full flex flex-col justify-between">
        {viewMode === 'grid' ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant={card.type === 'dashboard' ? 'default' : 'secondary'} className="text-xs">
                {card.type}
              </Badge>
              <Button variant="ghost" size="sm" className="p-1">
                {card.favorite ? (
                  <Heart size={14} className="text-red-500 fill-current" />
                ) : (
                  <Heart size={14} className="text-gray-400" />
                )}
              </Button>
            </div>
            <div>
              <h3 className="font-semibold text-sm line-clamp-2">{card.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{card.workspace}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{card.owner}</span>
              <span>{card.lastViewed}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 h-full">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.type === 'dashboard' ? 'bg-blue-100' : 'bg-green-100'}`}>
              <BarChart3 size={20} className={card.type === 'dashboard' ? 'text-blue-600' : 'text-green-600'} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{card.title}</h3>
              <p className="text-xs text-gray-600">{card.workspace} • {card.lastViewed}</p>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              {card.favorite ? (
                <Heart size={14} className="text-red-500 fill-current" />
              ) : (
                <Heart size={14} className="text-gray-400" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!isMobile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={32} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Mobile View</h2>
          <p className="text-gray-600 mb-4">This is the mobile-optimized Power BI interface.</p>
          <p className="text-sm text-gray-500">Resize your browser window to less than 768px to see the mobile version.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-20">
      <MobileHeader />
      
      <div className="px-4">
        {activeView === 'home' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search dashboards and reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4">
              {kpiData.map((kpi, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">{kpi.title}</p>
                      <p className="text-lg font-bold">{kpi.value}</p>
                      <p className={`text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recent Items</h3>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
                  </Button>
                </div>
              </div>
              
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                {filteredCards.slice(0, 4).map((card) => (
                  <DashboardCardComponent key={card.id} card={card} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Reports & Dashboards</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
              </Button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                  {filteredCards.map((card) => (
                    <DashboardCardComponent key={card.id} card={card} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-4">
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                  {filteredCards.filter(card => card.favorite).map((card) => (
                    <DashboardCardComponent key={card.id} card={card} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeView === 'data' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Data Sources</h2>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Database size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Sales Database</h3>
                        <p className="text-xs text-gray-600">Last refresh: 2 hours ago</p>
                      </div>
                    </div>
                    <Badge variant="default" className="text-xs">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Database size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Customer Data</h3>
                        <p className="text-xs text-gray-600">Last refresh: 1 day ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">Refreshing</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'profile' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-gray-600">john.doe@company.com</p>
            </div>

            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Account Settings</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Notifications</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Privacy & Security</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Help & Support</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <MobileNavigation />
    </div>
  );
};

export default MobilePowerBI;