
import React, { useState } from 'react';
import Visualization from './Visualization';
import { Grid2X2, Download, Share, Save } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const ReportCanvas = () => {
  const [visualizations, setVisualizations] = useState([
    {
      id: 'visual-1',
      type: 'bar',
      title: 'Sales by Category',
      x: 0,
      y: 0,
      width: 6,
      height: 4,
      data: [
        { name: 'Electronics', value: 400 },
        { name: 'Furniture', value: 300 },
        { name: 'Office Supplies', value: 600 },
        { name: 'Accessories', value: 800 },
      ]
    },
    {
      id: 'visual-2',
      type: 'line',
      title: 'Monthly Revenue Trend',
      x: 6,
      y: 0,
      width: 6,
      height: 4,
      data: [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Apr', value: 800 },
        { name: 'May', value: 500 },
        { name: 'Jun', value: 900 },
      ]
    },
    {
      id: 'visual-3',
      type: 'pie',
      title: 'Sales by Region',
      x: 0,
      y: 4,
      width: 4,
      height: 4,
      data: [
        { name: 'North', value: 400 },
        { name: 'South', value: 300 },
        { name: 'East', value: 500 },
        { name: 'West', value: 600 },
      ]
    },
    {
      id: 'visual-4',
      type: 'card',
      title: 'Total Sales',
      x: 4,
      y: 4,
      width: 4,
      height: 2,
      data: { value: 1458923, trend: 12.4, comparison: 'Last Year' }
    },
    {
      id: 'visual-5',
      type: 'table',
      title: 'Top Products',
      x: 8,
      y: 4,
      width: 4,
      height: 4,
      data: [
        { product: 'Laptop Pro', sales: 1254, growth: 12.5 },
        { product: 'Smart Watch', sales: 986, growth: 8.3 },
        { product: 'Wireless Earbuds', sales: 756, growth: 15.7 },
        { product: 'Tablet Mini', sales: 682, growth: -2.3 },
      ]
    }
  ]);

  const [selectedVisual, setSelectedVisual] = useState<string | null>(null);

  const handleVisualizationSelect = (id: string) => {
    setSelectedVisual(id);
    toast({
      title: "Visualization selected",
      description: `You've selected the ${visualizations.find(v => v.id === id)?.title} visualization.`,
      duration: 2000,
    });
  };

  const handleVisualizationDelete = (id: string) => {
    setVisualizations(visualizations.filter(viz => viz.id !== id));
    toast({
      title: "Visualization removed",
      description: "The visualization has been removed from the report.",
      duration: 2000,
    });
  };

  const handleSaveReport = () => {
    toast({
      title: "Report saved",
      description: "Your report has been saved successfully.",
      duration: 2000,
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Share options",
      description: "Sharing options would appear here.",
      duration: 2000,
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download started",
      description: "Your report is being downloaded as PDF.",
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto p-6">
      <div className="mb-4 flex items-center">
        <h2 className="text-lg font-medium mr-2">Sales Overview</h2>
        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-md">Report</span>
        
        <div className="ml-auto flex items-center gap-3">
          <button 
            onClick={handleSaveReport}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 flex items-center gap-1 text-xs"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          <button 
            onClick={handleShareReport}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 flex items-center gap-1 text-xs"
          >
            <Share size={16} />
            <span>Share</span>
          </button>
          <button 
            onClick={handleDownloadReport}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 flex items-center gap-1 text-xs"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
            <Grid2X2 size={18} />
          </button>
          <select className="text-sm border rounded p-1 bg-white">
            <option>View</option>
            <option>Reading View</option>
            <option>Editing View</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 auto-rows-[100px]">
        {visualizations.map((viz) => (
          <div 
            key={viz.id}
            className={`powerbi-visual ${selectedVisual === viz.id ? 'ring-2 ring-powerbi-primary' : ''}`}
            style={{
              gridColumn: `span ${viz.width} / span ${viz.width}`,
              gridRow: `span ${viz.height} / span ${viz.height}`
            }}
            onClick={() => handleVisualizationSelect(viz.id)}
          >
            <Visualization 
              type={viz.type} 
              title={viz.title} 
              data={viz.data}
              onDelete={() => handleVisualizationDelete(viz.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCanvas;
