
import React, { useState } from 'react';
import Visualization from './Visualization';
import { Grid2X2, Download, Share, Save, Plus } from 'lucide-react';
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
      ],
      fields: {
        axis: { name: 'Category', type: 'string', table: 'Products' },
        values: { name: 'Revenue', type: 'currency', table: 'Sales' }
      }
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
      ],
      fields: {
        axis: { name: 'Date', type: 'date', table: 'Sales' },
        values: { name: 'Revenue', type: 'currency', table: 'Sales' }
      }
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
      ],
      fields: {
        legend: { name: 'Region', type: 'string', table: 'Geography' },
        values: { name: 'Revenue', type: 'currency', table: 'Sales' }
      }
    },
    {
      id: 'visual-4',
      type: 'card',
      title: 'Total Sales',
      x: 4,
      y: 4,
      width: 4,
      height: 2,
      data: { value: 1458923, trend: 12.4, comparison: 'Last Year' },
      fields: {
        values: { name: 'Revenue', type: 'currency', table: 'Sales' }
      }
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
      ],
      fields: {
        columns: [
          { name: 'Product Name', type: 'string', table: 'Products' },
          { name: 'Quantity', type: 'number', table: 'Sales' },
          { name: 'Revenue', type: 'currency', table: 'Sales' }
        ]
      }
    }
  ]);

  const [selectedVisual, setSelectedVisual] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'reading'
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleVisualizationSelect = (id: string) => {
    if (viewMode === 'edit') {
      setSelectedVisual(id);
      toast({
        title: "Visualization selected",
        description: `You've selected the ${visualizations.find(v => v.id === id)?.title} visualization.`,
        duration: 2000,
      });
    }
  };

  const handleVisualizationDelete = (id: string) => {
    setVisualizations(visualizations.filter(viz => viz.id !== id));
    if (selectedVisual === id) {
      setSelectedVisual(null);
    }
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
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      const fieldData = JSON.parse(e.dataTransfer.getData('field'));
      // Add new visualization based on field type
      const newVisualization = createVisualizationFromField(fieldData);
      if (newVisualization) {
        setVisualizations([...visualizations, newVisualization]);
        toast({
          title: "Visualization created",
          description: `A new ${newVisualization.type} visualization has been created with ${fieldData.name}.`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error creating visualization from dropped field:", error);
    }
  };
  
  const createVisualizationFromField = (field: { name: string, type: string, table: string }) => {
    const id = `visual-${Date.now()}`;
    
    // Position the new visualization in an available space
    const positions = calculateAvailablePosition();
    
    switch (field.type) {
      case 'currency':
      case 'number':
        return {
          id,
          type: 'bar',
          title: `${field.name} by Category`,
          x: positions.x,
          y: positions.y,
          width: 6,
          height: 4,
          data: [
            { name: 'Category 1', value: 400 },
            { name: 'Category 2', value: 300 },
            { name: 'Category 3', value: 600 },
            { name: 'Category 4', value: 500 },
          ],
          fields: {
            values: field
          }
        };
      
      case 'string':
        return {
          id,
          type: 'pie',
          title: `Distribution by ${field.name}`,
          x: positions.x,
          y: positions.y,
          width: 4,
          height: 4,
          data: [
            { name: 'Segment 1', value: 400 },
            { name: 'Segment 2', value: 300 },
            { name: 'Segment 3', value: 500 },
          ],
          fields: {
            legend: field
          }
        };
      
      case 'date':
        return {
          id,
          type: 'line',
          title: `Trend Over ${field.name}`,
          x: positions.x,
          y: positions.y,
          width: 6,
          height: 4,
          data: [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 600 },
            { name: 'Apr', value: 500 },
            { name: 'May', value: 700 },
          ],
          fields: {
            axis: field
          }
        };
      
      default:
        return null;
    }
  };
  
  const calculateAvailablePosition = () => {
    // Simple logic to place new visualization in next available row
    const maxY = Math.max(...visualizations.map(v => v.y + v.height), 0);
    return { x: 0, y: maxY };
  };
  
  const handleAddVisualization = () => {
    toast({
      title: "Add Visualization",
      description: "Please drag a field from the Data pane or select a visualization type from the Visualization pane.",
      duration: 3000,
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
          <select 
            className="text-sm border rounded p-1 bg-white"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="edit">Editing View</option>
            <option value="reading">Reading View</option>
          </select>
        </div>
      </div>

      <div 
        className={`grid grid-cols-12 gap-4 auto-rows-[100px] min-h-[600px] ${isDraggingOver ? 'bg-blue-50 border-2 border-dashed border-powerbi-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
              isEditable={viewMode === 'edit'}
              onDelete={() => handleVisualizationDelete(viz.id)}
            />
          </div>
        ))}
        
        {viewMode === 'edit' && visualizations.length < 8 && (
          <div 
            className="col-span-4 row-span-2 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
            onClick={handleAddVisualization}
          >
            <Plus size={24} />
            <span className="mt-2 text-sm">Add Visualization</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCanvas;
