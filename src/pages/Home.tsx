import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Clock, Star, Users, Settings, Download, LayoutGrid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import ModernSidebar from '../components/navigation/ModernSidebar';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recent');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportName, setReportName] = useState("New Sales Report");
  const [datasetSelection, setDatasetSelection] = useState("sales");

  const handleCreateReport = () => {
    setIsCreateDialogOpen(false);
    navigate('/report');
    toast({
      title: "New report created",
      description: `You are now editing ${reportName}.`,
      duration: 3000,
    });
  };

  const recommendedItems = [
    {
      id: 'rec-1',
      title: 'Explore basic Power BI concepts',
      subtitle: 'Getting started with Power BI',
      image: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png',
      type: 'tutorial'
    },
    {
      id: 'rec-2',
      title: 'Explore the 100 most useful productivity tips',
      subtitle: 'Explore this data story',
      image: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png',
      type: 'report'
    },
    {
      id: 'rec-3',
      title: 'Cancer statistics in the USA',
      subtitle: 'Explore this data story',
      image: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png',
      type: 'report'
    },
    {
      id: 'rec-4',
      title: 'Intro—What is Power BI?',
      subtitle: 'Getting started with Power BI',
      image: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png',
      type: 'tutorial'
    }
  ];

  const recentItems = [
    {
      id: 'recent-1',
      title: 'Sales Overview',
      lastModified: 'Today at 10:45 AM',
      owner: 'You',
      type: 'report'
    },
    {
      id: 'recent-2',
      title: 'Marketing Analytics',
      lastModified: 'Yesterday at 4:32 PM',
      owner: 'Maria Chen',
      type: 'dashboard'
    },
    {
      id: 'recent-3',
      title: 'Financial Dashboard',
      lastModified: '2 days ago',
      owner: 'You',
      type: 'report'
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-white">
        <ModernSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header bar */}
          <header className="h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-powerbi-primary mr-4">Power BI</span>
              <span className="mr-4 text-gray-700">Home</span>
            </div>
            
            <div className="flex items-center">
              <div className="relative mr-4 w-64">
                <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full pl-8 pr-4 py-1.5 border rounded-md text-sm"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-xs text-gray-600">
                  <div>Trial:</div>
                  <div>59 days left</div>
                </div>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Settings size={20} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Download size={20} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
              </div>
            </div>
          </header>
          
          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
              {/* Top area with new report button */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Button 
                    className="bg-green-700 hover:bg-green-800 text-white"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    New report
                  </Button>
                  <button className="ml-2 p-1.5 border rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 mr-2">New items saved to:</span>
                  <div className="flex items-center font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    My workspace
                  </div>
                </div>
              </div>
              
              {/* Recommended section */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recommended</h2>
                  <div className="flex">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedItems.map(item => (
                    <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md cursor-pointer">
                      <div className="h-40 bg-gray-100 flex items-center justify-center">
                        {item.type === 'tutorial' && (
                          <div className="flex items-center justify-center">
                            <div className="relative w-20 h-20">
                              {/* Power BI logo or tutorial icon */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="#6264A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M13 2v7h7M16 13H8M16 17H8M10 9H8" stroke="#6264A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {item.type === 'report' && (
                          <div className="w-full h-full bg-gradient-to-r from-powerbi-primary to-powerbi-secondary opacity-75"></div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.subtitle}</p>
                      </div>
                      <div className="px-4 py-2 border-t bg-gray-50">
                        <button className="w-full text-center py-1 text-sm font-medium">Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent content tabs */}
              <div className="mb-4 border-b">
                <div className="flex space-x-1">
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'recent' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('recent')}
                  >
                    <Clock size={14} className="inline mr-1" />
                    Recent
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'favorites' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    <Star size={14} className="inline mr-1" />
                    Favorites
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'apps' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('apps')}
                  >
                    <LayoutGrid size={14} className="inline mr-1" />
                    My apps
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'external' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('external')}
                  >
                    <Users size={14} className="inline mr-1" />
                    From external orgs
                  </button>
                </div>
              </div>
              
              {/* Filter bar */}
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Filter by keyword" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-4 py-1.5 border rounded-md text-sm"
                  />
                </div>
                
                <button className="flex items-center border rounded px-3 py-1.5 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
                  </svg>
                  Filter
                </button>
              </div>
              
              {/* No content message or list of items */}
              {activeTab === 'recent' && recentItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                      <path d="M21.5 12H16c-.7 2-2.8 4-5 4s-4.3-2-5-4H.5"></path>
                      <path d="M3 9l2 6h14l2-6"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Find recently opened content here</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Once you've opened some Power BI content, come back to Recents to find it again easily.
                  </p>
                </div>
              ) : activeTab === 'recent' && (
                <div>
                  {recentItems.map(item => (
                    <div 
                      key={item.id} 
                      className="border-b py-3 flex items-center hover:bg-gray-50 px-3 cursor-pointer"
                      onClick={() => navigate('/dashboard')}
                    >
                      <div className="w-10 h-10 mr-4 rounded bg-powerbi-primary flex items-center justify-center text-white">
                        {item.type === 'report' ? 'R' : 'D'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="text-xs text-gray-600">
                          Modified {item.lastModified} • {item.owner}
                        </div>
                      </div>
                      <div>
                        <button className="p-2 hover:bg-gray-200 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {(activeTab !== 'recent' || (activeTab === 'recent' && recentItems.length === 0 && searchQuery)) && (
                <div className="text-center py-16">
                  <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                      <path d="M21.5 12H16c-.7 2-2.8 4-5 4s-4.3-2-5-4H.5"></path>
                      <path d="M3 9l2 6h14l2-6"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No content found</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    There's no content to show in this section right now.
                  </p>
                </div>
              )}
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
      </div>
    </SidebarProvider>
  );
};

export default Home;
