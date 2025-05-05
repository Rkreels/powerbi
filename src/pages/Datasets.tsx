
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Button } from "@/components/ui/button";
import { Plus, Database, Upload, RefreshCw, Filter, Search, MoreHorizontal, FileSpreadsheet, Table } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const Datasets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState('excel');
  const [fileName, setFileName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('all');

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Datasets refreshed",
        description: "All datasets have been updated to the latest version.",
        duration: 2000,
      });
    }, 1000);
  };

  const handleUpload = () => {
    setIsUploadDialogOpen(false);
    toast({
      title: "File uploaded",
      description: "Your file is being processed.",
      duration: 2000,
    });
  };

  const handleImport = () => {
    setIsImportDialogOpen(false);
    toast({
      title: "Data source connected",
      description: `Your ${selectedDataSource} data source is now connected.`,
      duration: 2000,
    });
  };

  const datasets = [
    { 
      name: "Sales Data", 
      type: "Excel", 
      tables: 4, 
      size: "2.4 MB", 
      lastRefresh: "1 hour ago",
      owner: "You"
    },
    { 
      name: "Marketing Analytics", 
      type: "CSV", 
      tables: 2, 
      size: "1.7 MB", 
      lastRefresh: "Today",
      owner: "Maria Chen"
    },
    { 
      name: "Customer Database", 
      type: "SQL", 
      tables: 7, 
      size: "5.8 MB", 
      lastRefresh: "Yesterday",
      owner: "You"
    },
    { 
      name: "Inventory Management", 
      type: "JSON", 
      tables: 3, 
      size: "3.2 MB", 
      lastRefresh: "3 days ago",
      owner: "John Smith"
    },
    { 
      name: "Financial Reports", 
      type: "Excel", 
      tables: 6, 
      size: "4.5 MB", 
      lastRefresh: "1 week ago",
      owner: "You"
    }
  ].filter(dataset => {
    if (searchQuery && !dataset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (activeView === 'my' && dataset.owner !== 'You') {
      return false;
    }
    
    return true;
  });

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Datasets</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Manage your data sources</span>
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
                placeholder="Search datasets" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-powerbi-primary"
              />
            </div>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload size={16} className="mr-1" />
              Upload
            </Button>
            <Button onClick={() => setIsImportDialogOpen(true)}>
              <Plus size={16} className="mr-1" />
              Connect data
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveView}>
          <TabsList>
            <TabsTrigger value="all">All datasets</TabsTrigger>
            <TabsTrigger value="my">My datasets</TabsTrigger>
            <TabsTrigger value="shared">Shared with me</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="bg-white border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Tables</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Size</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Last refresh</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Owner</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {datasets.map((dataset, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="mr-2">
                        {dataset.type === 'Excel' || dataset.type === 'CSV' ? 
                          <FileSpreadsheet size={18} className="text-green-600" /> : 
                          <Database size={18} className="text-blue-600" />
                        }
                      </span>
                      <span className="font-medium">{dataset.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{dataset.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{dataset.tables}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{dataset.size}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{dataset.lastRefresh}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{dataset.owner}</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {datasets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No datasets found. Try uploading a new dataset or connecting to a data source.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload dataset</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Upload size={24} className="text-gray-500" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Drag and drop your file here or click to browse</p>
              <p className="text-xs text-gray-500 mb-4">Supported formats: Excel, CSV, JSON, XML</p>
              <Button size="sm" onClick={() => {
                setFileName('sales_data_2023.xlsx');
                toast({
                  title: "File selected",
                  description: "sales_data_2023.xlsx is ready to upload.",
                  duration: 2000,
                });
              }}>
                Browse files
              </Button>
              
              {fileName && (
                <div className="mt-4 bg-gray-50 p-2 rounded flex items-center justify-between">
                  <div className="flex items-center">
                    <FileSpreadsheet size={16} className="text-green-600 mr-2" />
                    <span className="text-sm">{fileName}</span>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setFileName('')}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!fileName}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Connect to data source</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div 
                className={`border rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 ${selectedDataSource === 'excel' ? 'ring-2 ring-powerbi-primary' : ''}`}
                onClick={() => setSelectedDataSource('excel')}
              >
                <FileSpreadsheet size={24} className="mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Excel</div>
              </div>
              <div 
                className={`border rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 ${selectedDataSource === 'database' ? 'ring-2 ring-powerbi-primary' : ''}`}
                onClick={() => setSelectedDataSource('database')}
              >
                <Database size={24} className="mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Database</div>
              </div>
              <div 
                className={`border rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 ${selectedDataSource === 'web' ? 'ring-2 ring-powerbi-primary' : ''}`}
                onClick={() => setSelectedDataSource('web')}
              >
                <Table size={24} className="mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">Web</div>
              </div>
            </div>
            
            {selectedDataSource === 'excel' && (
              <div>
                <p className="text-sm mb-4">Connect to Excel file or CSV file on your computer or from cloud storage.</p>
                <Button variant="outline" size="sm" className="w-full mb-2">
                  <Upload size={16} className="mr-2" />
                  Browse files
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Upload size={16} className="mr-2" />
                  Select from cloud storage
                </Button>
              </div>
            )}
            
            {selectedDataSource === 'database' && (
              <div>
                <p className="text-sm mb-4">Connect to a SQL database, NoSQL database, or other data sources.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Server</label>
                    <input className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Database</label>
                    <input className="w-full p-2 border rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Username</label>
                      <input className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input type="password" className="w-full p-2 border rounded" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {selectedDataSource === 'web' && (
              <div>
                <p className="text-sm mb-4">Connect to data from web APIs, online services, or web pages.</p>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input 
                    className="w-full p-2 border rounded mb-4" 
                    placeholder="https://"
                  />
                  <div className="flex items-center">
                    <input id="auth-required" type="checkbox" className="mr-2" />
                    <label htmlFor="auth-required" className="text-sm">Authentication required</label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Datasets;
