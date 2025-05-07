
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Search, Plus, Filter, Download, Upload, Clock, Database, Calendar, RefreshCw, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const Datasets = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [datasetsView, setDatasetsView] = useState<'grid' | 'list'>('grid');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const datasets = [
    {
      id: 'ds-1',
      name: 'Sales Data',
      lastRefreshed: '1 hour ago',
      size: '4.2 MB',
      owner: 'John Smith',
      created: 'Jan 15, 2025',
      tables: 5,
      status: 'online',
      type: 'Import'
    },
    {
      id: 'ds-2',
      name: 'Marketing Analytics',
      lastRefreshed: '2 days ago',
      size: '1.8 MB',
      owner: 'Maria Chen',
      created: 'Mar 20, 2025',
      tables: 3,
      status: 'online',
      type: 'DirectQuery'
    },
    {
      id: 'ds-3',
      name: 'Financial Dashboard Data',
      lastRefreshed: 'Yesterday',
      size: '6.5 MB',
      owner: 'John Smith',
      created: 'Apr 5, 2025',
      tables: 8,
      status: 'online',
      type: 'Import'
    },
    {
      id: 'ds-4',
      name: 'Customer Insights',
      lastRefreshed: '3 days ago',
      size: '2.3 MB',
      owner: 'Robert Johnson',
      created: 'Mar 12, 2025',
      tables: 4,
      status: 'online',
      type: 'Composite'
    },
    {
      id: 'ds-5',
      name: 'HR Analytics',
      lastRefreshed: '5 hours ago',
      size: '1.1 MB',
      owner: 'Sarah Miller',
      created: 'Apr 18, 2025',
      tables: 2,
      status: 'scheduled',
      type: 'Import'
    }
  ];

  const filteredDatasets = datasets.filter(dataset => 
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleCreateDataset = () => {
    setIsCreateDialogOpen(false);
    toast({
      title: "Dataset created",
      description: "Your new dataset has been created successfully.",
      duration: 3000,
    });
  };

  const toggleSelectDataset = (id: string) => {
    setSelectedDatasets(prev => 
      prev.includes(id) 
        ? prev.filter(datasetId => datasetId !== id) 
        : [...prev, id]
    );
  };

  const selectAllDatasets = () => {
    if (selectedDatasets.length === datasets.length) {
      setSelectedDatasets([]);
    } else {
      setSelectedDatasets(datasets.map(ds => ds.id));
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Datasets</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">{datasets.length} datasets available</span>
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus size={16} className="mr-1" />
              Get Data
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm mb-6">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <button 
                className={`p-1.5 rounded ${datasetsView === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={() => setDatasetsView('grid')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              <button
                className={`p-1.5 rounded ${datasetsView === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={() => setDatasetsView('list')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="2" width="14" height="2" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="1" y="7" width="14" height="2" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="1" y="12" width="14" height="2" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              <Button variant="outline" size="sm" className="ml-2">
                <Filter size={14} className="mr-1" />
                Filter
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedDatasets.length > 0 && (
                <span className="text-sm text-gray-500">{selectedDatasets.length} selected</span>
              )}
              <Button variant="outline" size="sm" disabled={selectedDatasets.length === 0}>
                <RefreshCw size={14} className="mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" disabled={selectedDatasets.length === 0}>
                <Download size={14} className="mr-1" />
                Export
              </Button>
              <button className="p-1.5 rounded hover:bg-gray-100">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {datasetsView === 'list' ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                        <Checkbox 
                          checked={selectedDatasets.length === datasets.length && datasets.length > 0} 
                          onCheckedChange={selectAllDatasets} 
                        />
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Refreshed</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tables</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDatasets.map((dataset) => (
                      <tr key={dataset.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 whitespace-nowrap">
                          <Checkbox 
                            checked={selectedDatasets.includes(dataset.id)} 
                            onCheckedChange={() => toggleSelectDataset(dataset.id)} 
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Database size={16} className="mr-2 text-powerbi-primary" />
                            <div className="text-sm font-medium text-gray-900">{dataset.name}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{dataset.owner}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{dataset.type}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{dataset.lastRefreshed}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{dataset.tables}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            dataset.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {dataset.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-powerbi-primary hover:text-powerbi-secondary px-2">Edit</button>
                          <button className="text-powerbi-primary hover:text-powerbi-secondary px-2">Open</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDatasets.map((dataset) => (
                  <div 
                    key={dataset.id} 
                    className="border rounded-lg p-4 hover:shadow-md cursor-pointer relative"
                    onClick={() => toggleSelectDataset(dataset.id)}
                  >
                    <div className="absolute top-4 left-4">
                      <Checkbox 
                        checked={selectedDatasets.includes(dataset.id)}
                        className="pointer-events-none" 
                      />
                    </div>
                    <div className="flex items-center mb-3 pl-8">
                      <Database size={18} className="mr-2 text-powerbi-primary" />
                      <h3 className="font-medium truncate">{dataset.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                      <div>Owner:</div>
                      <div>{dataset.owner}</div>
                      <div>Created:</div>
                      <div>{dataset.created}</div>
                      <div>Size:</div>
                      <div>{dataset.size}</div>
                      <div>Type:</div>
                      <div>{dataset.type}</div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        <span>Last refreshed {dataset.lastRefreshed}</span>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to data</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="w-12 h-12 mb-3 rounded-full bg-powerbi-primary text-white flex items-center justify-center">
                <Database size={24} />
              </div>
              <h3 className="font-medium mb-2">Files</h3>
              <p className="text-sm text-gray-500">Excel, CSV, XML, Text, and more</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="w-12 h-12 mb-3 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                  <path d="M2 17L12 22L22 17V7L12 2L2 7V17Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Azure</h3>
              <p className="text-sm text-gray-500">SQL Database, Synapse Analytics, and more</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="w-12 h-12 mb-3 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/>
                  <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Database</h3>
              <p className="text-sm text-gray-500">SQL Server, Oracle, MySQL, and more</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="w-12 h-12 mb-3 rounded-full bg-purple-500 text-white flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                  <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Online Services</h3>
              <p className="text-sm text-gray-500">SharePoint, Google Analytics, and more</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDataset}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Datasets;
