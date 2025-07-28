import React, { useState, useEffect } from 'react';
import Visualization from './Visualization';
import { Grid2X2, Download, Share, Save, Plus, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Define more specific types for visualizations
type VisualizationBase = {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

type BarOrLineVisualization = VisualizationBase & {
  type: 'bar' | 'line' | 'area';
  data: { name: string; value: number }[];
  fields: {
    axis?: { name: string; type: string; table: string };
    values?: { name: string; type: string; table: string };
    legend?: never;
    columns?: never;
  };
}

type PieVisualization = VisualizationBase & {
  type: 'pie' | 'donut';
  data: { name: string; value: number }[];
  fields: {
    legend?: { name: string; type: string; table: string };
    values?: { name: string; type: string; table: string };
    axis?: never;
    columns?: never;
  };
}

type CardVisualization = VisualizationBase & {
  type: 'card';
  data: { value: number; trend: number; comparison: string };
  fields: {
    values?: { name: string; type: string; table: string };
    axis?: never;
    legend?: never;
    columns?: never;
  };
}

type TableVisualization = VisualizationBase & {
  type: 'table';
  data: { [key: string]: any }[];
  fields: {
    columns?: { name: string; type: string; table: string }[];
    axis?: never;
    values?: never;
    legend?: never;
  };
}

type VisualizationType = BarOrLineVisualization | PieVisualization | CardVisualization | TableVisualization;

interface ReportCanvasProps {
  selectedTemplate?: any;
}

const ReportCanvas = ({ selectedTemplate }: ReportCanvasProps) => {
  // Initialize visualizations with template data if available
  const getInitialVisualizations = (): VisualizationType[] => {
    if (selectedTemplate?.visualizations) {
      return selectedTemplate.visualizations.map((viz: any, index: number) => ({
        id: `template-${index}`,
        type: viz.type,
        title: viz.title,
        x: (index % 3) * 4,
        y: Math.floor(index / 3) * 4,
        width: viz.type === 'card' ? 3 : viz.type === 'pie' ? 4 : 6,
        height: viz.type === 'card' ? 2 : 4,
        data: viz.data,
        fields: {}
      }));
    }
    
    return [
      {
        id: 'visual-1',
        type: 'bar',
        title: 'Sales by Category',
        x: 0,
        y: 0,
        width: 6,
        height: 4,
        data: [
          { name: 'Electronics', value: 400000 },
          { name: 'Furniture', value: 300000 },
          { name: 'Office Supplies', value: 600000 },
          { name: 'Accessories', value: 800000 },
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
          { name: 'Jan', value: 400000 },
          { name: 'Feb', value: 300000 },
          { name: 'Mar', value: 600000 },
          { name: 'Apr', value: 800000 },
          { name: 'May', value: 500000 },
          { name: 'Jun', value: 900000 },
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
          { name: 'North America', value: 45 },
          { name: 'Europe', value: 30 },
          { name: 'Asia Pacific', value: 20 },
          { name: 'Others', value: 5 },
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
        data: { value: 2458923, trend: 12.4, comparison: 'vs Last Quarter' },
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
          { product: 'Laptop Pro Max', sales: 125400, growth: 12.5 },
          { product: 'Smart Watch Ultra', sales: 98600, growth: 8.3 },
          { product: 'Wireless Earbuds Pro', sales: 75600, growth: 15.7 },
          { product: 'Tablet Mini 5G', sales: 68200, growth: -2.3 },
          { product: 'Gaming Mouse RGB', sales: 54300, growth: 22.1 },
        ],
        fields: {
          columns: [
            { name: 'Product Name', type: 'string', table: 'Products' },
            { name: 'Sales Amount', type: 'currency', table: 'Sales' },
            { name: 'Growth %', type: 'percentage', table: 'Metrics' }
          ]
        }
      }
    ];
  };

  const [visualizations, setVisualizations] = useState<VisualizationType[]>(getInitialVisualizations());
  const [selectedVisual, setSelectedVisual] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'reading'
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Update visualizations when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setVisualizations(getInitialVisualizations());
    }
  }, [selectedTemplate]);

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
    const shareUrl = `${window.location.origin}/report/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share link copied",
      description: "Report share link has been copied to clipboard.",
      duration: 3000,
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Export started",
      description: "Your report is being exported as PDF. This will download shortly.",
      duration: 3000,
    });
    
    // Simulate download
    setTimeout(() => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Sample Report Export'));
      element.setAttribute('download', `${selectedTemplate?.name || 'Report'}_${new Date().toISOString().split('T')[0]}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
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
      toast({
        title: "Error",
        description: "Could not create visualization from dropped field.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };
  
  const createVisualizationFromField = (field: { name: string, type: string, table: string }): VisualizationType | null => {
    const id = `visual-${Date.now()}`;
    
    // Position the new visualization in an available space
    const positions = calculateAvailablePosition();
    
    switch (field.type) {
      case 'currency':
      case 'number':
        return {
          id,
          type: 'bar',
          title: `${field.name} Analysis`,
          x: positions.x,
          y: positions.y,
          width: 6,
          height: 4,
          data: [
            { name: 'Q1', value: Math.floor(Math.random() * 500000) + 100000 },
            { name: 'Q2', value: Math.floor(Math.random() * 500000) + 100000 },
            { name: 'Q3', value: Math.floor(Math.random() * 500000) + 100000 },
            { name: 'Q4', value: Math.floor(Math.random() * 500000) + 100000 },
          ],
          fields: {
            values: field,
            axis: { name: 'Quarter', type: 'string', table: 'Time' }
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
            { name: 'Segment A', value: 35 },
            { name: 'Segment B', value: 30 },
            { name: 'Segment C', value: 25 },
            { name: 'Segment D', value: 10 },
          ],
          fields: {
            legend: field,
            values: { name: 'Count', type: 'number', table: 'Metrics' }
          }
        };
      
      case 'date':
        return {
          id,
          type: 'line',
          title: `Trend Over Time`,
          x: positions.x,
          y: positions.y,
          width: 6,
          height: 4,
          data: [
            { name: 'Jan', value: Math.floor(Math.random() * 100) + 50 },
            { name: 'Feb', value: Math.floor(Math.random() * 100) + 50 },
            { name: 'Mar', value: Math.floor(Math.random() * 100) + 50 },
            { name: 'Apr', value: Math.floor(Math.random() * 100) + 50 },
            { name: 'May', value: Math.floor(Math.random() * 100) + 50 },
            { name: 'Jun', value: Math.floor(Math.random() * 100) + 50 },
          ],
          fields: {
            axis: field,
            values: { name: 'Value', type: 'number', table: 'Metrics' }
          }
        };
      
      default:
        return null;
    }
  };
  
  const calculateAvailablePosition = () => {
    // Simple logic to place new visualization in next available row
    const maxY = Math.max(...visualizations.map(v => v.y + v.height), 0);
    return { x: 0, y: maxY + 1 };
  };
  
  const handleAddVisualization = () => {
    toast({
      title: "Add Visualization",
      description: "Drag a field from the Data pane or select a visualization type from the Visualization pane to get started.",
      duration: 3000,
    });
  };

  const handleAutoLayout = () => {
    const newVisualizations = visualizations.map((viz, index) => ({
      ...viz,
      x: (index % 3) * 4,
      y: Math.floor(index / 3) * 4,
      width: viz.type === 'card' ? 3 : viz.type === 'pie' ? 4 : 6,
      height: viz.type === 'card' ? 2 : 4,
    }));
    
    setVisualizations(newVisualizations);
    toast({
      title: "Layout optimized",
      description: "Visualizations have been automatically arranged for better presentation.",
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedTemplate ? selectedTemplate.name : 'Sales Overview'}
          </h2>
          <Badge variant="secondary" className="text-xs">
            <LayoutDashboard size={12} className="mr-1" />
            Report
          </Badge>
          {selectedTemplate && (
            <Badge variant="outline" className="text-xs">
              {selectedTemplate.category}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAutoLayout}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Sparkles size={14} className="mr-1" />
            Auto Layout
          </Button>
          <Button 
            onClick={handleSaveReport}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Save size={14} className="mr-1" />
            Save
          </Button>
          <Button 
            onClick={handleShareReport}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Share size={14} className="mr-1" />
            Share
          </Button>
          <Button 
            onClick={handleDownloadReport}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Download size={14} className="mr-1" />
            Export
          </Button>
          <Button 
            onClick={() => setViewMode(viewMode === 'edit' ? 'reading' : 'edit')}
            variant={viewMode === 'reading' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            <Grid2X2 size={14} className="mr-1" />
            {viewMode === 'edit' ? 'Preview' : 'Edit'}
          </Button>
        </div>
      </div>

      <div 
        className={`grid grid-cols-12 gap-4 auto-rows-[100px] min-h-[600px] transition-all duration-200 ${
          isDraggingOver ? 'bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {visualizations.map((viz) => (
          <div 
            key={viz.id}
            className={`powerbi-visual transition-all duration-200 hover:shadow-lg ${
              selectedVisual === viz.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
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
        
        {viewMode === 'edit' && visualizations.length < 12 && (
          <div 
            className="col-span-4 row-span-3 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all duration-200 group"
            onClick={handleAddVisualization}
          >
            <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add Visualization</span>
            <span className="text-xs text-gray-500 mt-1">Drag fields or use templates</span>
          </div>
        )}
        
        {isDraggingOver && (
          <div className="col-span-12 row-span-2 flex items-center justify-center text-blue-600 bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg">
            <div className="text-center">
              <Plus size={32} className="mx-auto mb-2" />
              <p className="font-medium">Drop field here to create visualization</p>
              <p className="text-sm text-blue-500">A chart will be automatically generated</p>
            </div>
          </div>
        )}
      </div>
      
      {visualizations.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <LayoutDashboard size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No visualizations yet</p>
            <p className="text-sm">Start by dragging fields from the Data pane or selecting a template</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCanvas;