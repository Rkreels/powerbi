import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Upload, Clock, Database, Calendar, RefreshCw, MoreHorizontal, Trash2, Edit, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { dataService } from '@/services/dataService';

const Datasets = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [datasetsView, setDatasetsView] = useState<'grid' | 'list'>('grid');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [datasets, setDatasets] = useState(() => dataService.getDatasets());

  const reloadDatasets = () => setDatasets([...dataService.getDatasets()]);

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStatus || dataset.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      reloadDatasets();
      toast({ title: "Datasets refreshed", description: "All datasets have been updated.", duration: 2000 });
    }, 1000);
  };

  const handleCreateDataset = (source: string) => {
    dataService.createDataset({
      name: `${source} Dataset`,
      description: `Dataset from ${source}`,
      source,
      owner: "Current User",
      size: "0 MB",
      status: 'active'
    });
    setIsCreateDialogOpen(false);
    reloadDatasets();
    toast({ title: "Dataset Created", description: `${source} Dataset has been created.`, duration: 2000 });
  };

  const handleDeleteDataset = (id: string) => {
    const ds = datasets.find(d => d.id === id);
    dataService.deleteDataset(id);
    reloadDatasets();
    setSelectedDatasets(prev => prev.filter(s => s !== id));
    toast({ title: "Dataset Deleted", description: `${ds?.name} has been removed.`, duration: 2000 });
  };

  const handleBulkDelete = () => {
    selectedDatasets.forEach(id => dataService.deleteDataset(id));
    reloadDatasets();
    setSelectedDatasets([]);
    toast({ title: "Datasets Deleted", description: `${selectedDatasets.length} dataset(s) removed.`, duration: 2000 });
  };

  const handleExport = () => {
    const datasetsToExport = datasets.filter(d => selectedDatasets.includes(d.id));
    const exportData = { datasets: datasetsToExport, exportedAt: new Date().toISOString(), count: datasetsToExport.length };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datasets-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "Export Complete", description: `Exported ${datasetsToExport.length} dataset(s).`, duration: 2000 });
  };

  const toggleSelectDataset = (id: string) => {
    setSelectedDatasets(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const selectAllDatasets = () => {
    setSelectedDatasets(selectedDatasets.length === filteredDatasets.length ? [] : filteredDatasets.map(ds => ds.id));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">Datasets</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">{filteredDatasets.length} datasets available</span>
            <button className={`ml-2 p-1 text-gray-500 hover:text-gray-700 rounded ${isRefreshing ? 'animate-spin' : ''}`} onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search datasets" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 border rounded-md w-48 md:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus size={16} className="mr-1" />Get Data
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm mb-6">
        <div className="flex items-center justify-between p-4 border-b flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <button className={`p-1.5 rounded ${datasetsView === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'}`} onClick={() => setDatasetsView('grid')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
            <button className={`p-1.5 rounded ${datasetsView === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'}`} onClick={() => setDatasetsView('list')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="2" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="7" width="14" height="2" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="12" width="14" height="2" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
            <Button variant="outline" size="sm" className="ml-2" onClick={() => setShowFilterDialog(true)}>
              <Filter size={14} className="mr-1" />{filterStatus || 'Filter'}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {selectedDatasets.length > 0 && <span className="text-sm text-gray-500">{selectedDatasets.length} selected</span>}
            <Button variant="outline" size="sm" disabled={selectedDatasets.length === 0} onClick={handleRefresh}>
              <RefreshCw size={14} className="mr-1" />Refresh
            </Button>
            <Button variant="outline" size="sm" disabled={selectedDatasets.length === 0} onClick={handleExport}>
              <Download size={14} className="mr-1" />Export
            </Button>
            <Button variant="outline" size="sm" disabled={selectedDatasets.length === 0} onClick={handleBulkDelete} className="text-red-600 hover:text-red-700">
              <Trash2 size={14} className="mr-1" />Delete
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {datasetsView === 'list' ? (
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 w-8"><Checkbox checked={selectedDatasets.length === filteredDatasets.length && filteredDatasets.length > 0} onCheckedChange={selectAllDatasets} /></th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Owner</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Source</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Size</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDatasets.map((dataset) => (
                    <tr key={dataset.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4"><Checkbox checked={selectedDatasets.includes(dataset.id)} onCheckedChange={() => toggleSelectDataset(dataset.id)} /></td>
                      <td className="px-3 py-4">
                        <div className="flex items-center">
                          <Database size={16} className="mr-2 text-blue-600" />
                          <div className="text-sm font-medium">{dataset.name}</div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 hidden md:table-cell">{dataset.owner}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 hidden md:table-cell">{dataset.source}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">{dataset.size}</td>
                      <td className="px-3 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          dataset.status === 'active' ? 'bg-green-100 text-green-800' : dataset.status === 'refreshing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>{dataset.status}</span>
                      </td>
                      <td className="px-3 py-4 text-right text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal size={14} /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate('/model')}>Edit in Model</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/report')}>Create Report</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDataset(dataset.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDatasets.map((dataset) => (
                <div key={dataset.id} className="border rounded-lg p-4 hover:shadow-md cursor-pointer relative group" onClick={() => toggleSelectDataset(dataset.id)}>
                  <div className="absolute top-4 left-4"><Checkbox checked={selectedDatasets.includes(dataset.id)} className="pointer-events-none" /></div>
                  <div className="flex items-center mb-3 pl-8">
                    <Database size={18} className="mr-2 text-blue-600" />
                    <h3 className="font-medium truncate">{dataset.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                    <div>Owner:</div><div className="truncate">{dataset.owner}</div>
                    <div>Source:</div><div>{dataset.source}</div>
                    <div>Size:</div><div>{dataset.size}</div>
                    <div>Status:</div>
                    <div><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${dataset.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{dataset.status}</span></div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <div className="text-xs text-gray-500"><Clock size={12} className="inline mr-1" />Modified {new Date(dataset.modified).toLocaleDateString()}</div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => e.stopPropagation()}><MoreHorizontal size={14} /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate('/model')}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/report')}>Create Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDataset(dataset.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Create Dataset Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Connect to data</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {[
              { source: 'File', icon: <Database size={24} />, color: 'bg-blue-600', desc: 'Excel, CSV, XML, Text' },
              { source: 'Azure', icon: <Database size={24} />, color: 'bg-blue-500', desc: 'SQL Database, Synapse' },
              { source: 'SQL Server', icon: <Database size={24} />, color: 'bg-green-600', desc: 'SQL Server, Analysis Services' },
              { source: 'REST API', icon: <Database size={24} />, color: 'bg-purple-600', desc: 'Web APIs, OData feeds' },
              { source: 'PostgreSQL', icon: <Database size={24} />, color: 'bg-indigo-600', desc: 'PostgreSQL databases' },
              { source: 'Google Analytics', icon: <Database size={24} />, color: 'bg-orange-500', desc: 'Website analytics data' },
            ].map(item => (
              <div key={item.source} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleCreateDataset(item.source)}>
                <div className={`w-12 h-12 mb-3 rounded-full ${item.color} text-white flex items-center justify-center`}>{item.icon}</div>
                <h3 className="font-medium mb-1">{item.source}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader><DialogTitle>Filter Datasets</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            {['active', 'refreshing', 'inactive'].map(status => (
              <Button key={status} variant={filterStatus === status ? 'default' : 'outline'} className="mr-2 capitalize"
                onClick={() => { setFilterStatus(filterStatus === status ? null : status); setShowFilterDialog(false); }}>
                {status}
              </Button>
            ))}
            {filterStatus && <Button variant="ghost" onClick={() => { setFilterStatus(null); setShowFilterDialog(false); }}>Clear</Button>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Datasets;
