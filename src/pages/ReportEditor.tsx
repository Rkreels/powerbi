
import React, { useState } from 'react';
import { Save, Download, Share2, Undo, Redo, Eye, Settings, Plus, BarChart3, PieChart, LineChart, Table } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ReportEditor = () => {
  const [reportName, setReportName] = useState('Untitled Report');
  const [selectedVisualization, setSelectedVisualization] = useState('bar');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const visualizations = [
    { id: 'bar', name: 'Bar Chart', icon: <BarChart3 size={20} /> },
    { id: 'line', name: 'Line Chart', icon: <LineChart size={20} /> },
    { id: 'pie', name: 'Pie Chart', icon: <PieChart size={20} /> },
    { id: 'table', name: 'Table', icon: <Table size={20} /> }
  ];

  const handleSave = () => {
    toast({
      title: "Report saved",
      description: "Your report has been saved successfully.",
      duration: 2000,
    });
  };

  const handlePublish = () => {
    toast({
      title: "Report published",
      description: "Your report is now available to share.",
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert('Undo functionality would be implemented here')}
          >
            <Undo size={16} className="mr-1" />
            Undo
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert('Redo functionality would be implemented here')}
          >
            <Redo size={16} className="mr-1" />
            Redo
          </Button>
          <div className="w-px h-6 bg-gray-300"></div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye size={16} className="mr-1" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save size={16} className="mr-1" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert('Export functionality would be implemented here')}
          >
            <Download size={16} className="mr-1" />
            Export
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Share2 size={16} className="mr-1" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tools */}
        {!isPreviewMode && (
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-3">Visualizations</h3>
              <div className="grid grid-cols-2 gap-2">
                {visualizations.map((viz) => (
                  <button
                    key={viz.id}
                    className={`p-3 border rounded-lg hover:bg-gray-50 flex flex-col items-center text-xs ${
                      selectedVisualization === viz.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedVisualization(viz.id)}
                  >
                    {viz.icon}
                    <span className="mt-1">{viz.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-b">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-3">Fields</h3>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 rounded text-sm">Sales Amount</div>
                <div className="p-2 bg-gray-50 rounded text-sm">Product Category</div>
                <div className="p-2 bg-gray-50 rounded text-sm">Date</div>
                <div className="p-2 bg-gray-50 rounded text-sm">Customer Segment</div>
                <div className="p-2 bg-gray-50 rounded text-sm">Region</div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-3">Format</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full text-xs p-2 border rounded" 
                    placeholder="Chart title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Color</label>
                  <div className="flex space-x-1">
                    <div className="w-6 h-6 bg-blue-500 rounded border cursor-pointer"></div>
                    <div className="w-6 h-6 bg-green-500 rounded border cursor-pointer"></div>
                    <div className="w-6 h-6 bg-red-500 rounded border cursor-pointer"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded border cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border h-full min-h-96 relative">
            {isPreviewMode ? (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Sales Performance Report</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Revenue by Product Category</h3>
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                      Bar Chart Visualization
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Sales Trend</h3>
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-500">
                      Line Chart Visualization
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Plus size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">Drag fields here to create visualizations</p>
                  <p className="text-gray-400 text-sm mt-2">Or select a visualization type from the left panel</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Properties */}
        {!isPreviewMode && (
          <div className="w-64 bg-white border-l border-gray-200 p-4">
            <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-3">Properties</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">X-Axis</label>
                <select className="w-full p-2 border rounded text-sm">
                  <option>Select field...</option>
                  <option>Product Category</option>
                  <option>Date</option>
                  <option>Region</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Y-Axis</label>
                <select className="w-full p-2 border rounded text-sm">
                  <option>Select field...</option>
                  <option>Sales Amount</option>
                  <option>Quantity</option>
                  <option>Profit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Legend</label>
                <select className="w-full p-2 border rounded text-sm">
                  <option>None</option>
                  <option>Customer Segment</option>
                  <option>Product Category</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Show data labels
                </label>
              </div>
              
              <div>
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  Show grid lines
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportEditor;
