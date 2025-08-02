import React, { useState, useEffect } from 'react';
import { dataService } from '@/services/dataService';
import { Grid2X2, Download, Share, Save, Plus, Sparkles, LayoutDashboard, Filter, Trash2, Settings, Move, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface VisualizationProps {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'card' | 'table';
  title: string;
  data: any[];
  config?: any;
  position: { x: number; y: number; width: number; height: number };
  onUpdate?: (id: string, updates: any) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

const ChartVisualization: React.FC<VisualizationProps> = ({ 
  id, type, title, data, config = {}, position, onUpdate, onDelete, isSelected, onSelect 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [chartTitle, setChartTitle] = useState(title);
  const [chartConfig, setChartConfig] = useState(config);

  const handleConfigUpdate = (key: string, value: any) => {
    const newConfig = { ...chartConfig, [key]: value };
    setChartConfig(newConfig);
    onUpdate?.(id, { config: newConfig });
  };

  const handleTitleChange = (newTitle: string) => {
    setChartTitle(newTitle);
    onUpdate?.(id, { title: newTitle });
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          No data available
        </div>
      );
    }

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartConfig.yKey || 'value'} fill={chartConfig.color || '#8884d8'} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={chartConfig.yKey || 'value'} stroke={chartConfig.color || '#8884d8'} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={chartConfig.valueKey || 'value'}
                nameKey={chartConfig.nameKey || 'name'}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'card':
        const cardData = Array.isArray(data) ? data[0] : data;
        return (
          <div className="h-full flex flex-col justify-center items-center p-4">
            <div className="text-3xl font-bold text-gray-900">
              {typeof cardData === 'object' ? cardData.value : cardData}
            </div>
            {typeof cardData === 'object' && cardData.trend && (
              <div className={`text-sm ${cardData.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cardData.trend > 0 ? '+' : ''}{cardData.trend}% {cardData.comparison || 'vs previous period'}
              </div>
            )}
          </div>
        );
      
      case 'table':
        return (
          <div className="h-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {data.length > 0 && Object.keys(data[0]).map((key) => (
                    <th key={key} className="px-2 py-1 text-left font-medium text-gray-600 border-b">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value: any, cellIndex) => (
                      <td key={cellIndex} className="px-2 py-1 border-b border-gray-200">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <Card 
      className={`h-full cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
      style={{
        gridColumn: `span ${position.width}`,
        gridRow: `span ${position.height}`
      }}
      onClick={() => onSelect?.(id)}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium text-sm truncate">{chartTitle}</h3>
          <div className="flex items-center gap-1">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings size={12} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chart Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={chartTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                    />
                  </div>
                  
                  {type !== 'card' && type !== 'table' && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Color</label>
                        <input
                          type="color"
                          value={chartConfig.color || '#8884d8'}
                          onChange={(e) => handleConfigUpdate('color', e.target.value)}
                          className="w-full mt-1 h-10 border rounded-md"
                        />
                      </div>
                      
                      {(type === 'bar' || type === 'line') && (
                        <>
                          <div>
                            <label className="text-sm font-medium">X-Axis Field</label>
                            <Select value={chartConfig.xKey || 'name'} onValueChange={(value) => handleConfigUpdate('xKey', value)}>
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {data.length > 0 && Object.keys(data[0]).map((key) => (
                                  <SelectItem key={key} value={key}>{key}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Y-Axis Field</label>
                            <Select value={chartConfig.yKey || 'value'} onValueChange={(value) => handleConfigUpdate('yKey', value)}>
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {data.length > 0 && Object.keys(data[0]).map((key) => (
                                  <SelectItem key={key} value={key}>{key}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(id);
              }}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-2">
          {renderChart()}
        </div>
      </div>
    </Card>
  );
};

interface EnhancedReportCanvasProps {
  selectedTemplate?: any;
}

export const EnhancedReportCanvas: React.FC<EnhancedReportCanvasProps> = ({ selectedTemplate }) => {
  const [visualizations, setVisualizations] = useState<any[]>([]);
  const [selectedVisualization, setSelectedVisualization] = useState<string | null>(null);
  const [reportName, setReportName] = useState('Untitled Report');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // Initialize with sample data
  useEffect(() => {
    if (selectedTemplate?.visualizations) {
      const templateViz = selectedTemplate.visualizations.map((viz: any, index: number) => ({
        id: `viz-${Date.now()}-${index}`,
        type: viz.type,
        title: viz.title,
        data: viz.data,
        config: {},
        position: {
          x: (index % 3) * 4,
          y: Math.floor(index / 3) * 3,
          width: viz.type === 'card' ? 3 : 4,
          height: viz.type === 'card' ? 2 : 3
        }
      }));
      setVisualizations(templateViz);
      setReportName(selectedTemplate.name || 'Untitled Report');
    } else {
      // Default sample visualizations
      setVisualizations([
        {
          id: 'viz-1',
          type: 'bar',
          title: 'Sales by Category',
          data: [
            { name: 'Electronics', value: 40000 },
            { name: 'Clothing', value: 30000 },
            { name: 'Home', value: 50000 },
            { name: 'Sports', value: 25000 }
          ],
          config: { xKey: 'name', yKey: 'value', color: '#8884d8' },
          position: { x: 0, y: 0, width: 4, height: 3 }
        },
        {
          id: 'viz-2',
          type: 'line',
          title: 'Monthly Trend',
          data: [
            { name: 'Jan', value: 12000 },
            { name: 'Feb', value: 15000 },
            { name: 'Mar', value: 18000 },
            { name: 'Apr', value: 22000 },
            { name: 'May', value: 25000 },
            { name: 'Jun', value: 28000 }
          ],
          config: { xKey: 'name', yKey: 'value', color: '#82ca9d' },
          position: { x: 4, y: 0, width: 4, height: 3 }
        },
        {
          id: 'viz-3',
          type: 'pie',
          title: 'Market Share',
          data: [
            { name: 'Product A', value: 45 },
            { name: 'Product B', value: 30 },
            { name: 'Product C', value: 15 },
            { name: 'Product D', value: 10 }
          ],
          config: { nameKey: 'name', valueKey: 'value' },
          position: { x: 8, y: 0, width: 4, height: 3 }
        },
        {
          id: 'viz-4',
          type: 'card',
          title: 'Total Revenue',
          data: { value: '$2.5M', trend: 12.5, comparison: 'vs last quarter' },
          config: {},
          position: { x: 0, y: 3, width: 3, height: 2 }
        }
      ]);
    }
  }, [selectedTemplate]);

  const handleVisualizationUpdate = (id: string, updates: any) => {
    setVisualizations(prev => 
      prev.map(viz => viz.id === id ? { ...viz, ...updates } : viz)
    );
  };

  const handleVisualizationDelete = (id: string) => {
    setVisualizations(prev => prev.filter(viz => viz.id !== id));
    setSelectedVisualization(null);
    toast({
      title: "Visualization deleted",
      description: "The visualization has been removed from the report.",
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
      const newViz = createVisualizationFromField(fieldData);
      if (newViz) {
        setVisualizations(prev => [...prev, newViz]);
        toast({
          title: "Visualization created",
          description: `New ${newViz.type} chart created from ${fieldData.name}.`,
        });
      }
    } catch (error) {
      console.error('Error creating visualization:', error);
    }
  };

  const createVisualizationFromField = (field: any) => {
    const id = `viz-${Date.now()}`;
    const sampleData = [
      { name: 'Q1', value: Math.random() * 1000 },
      { name: 'Q2', value: Math.random() * 1000 },
      { name: 'Q3', value: Math.random() * 1000 },
      { name: 'Q4', value: Math.random() * 1000 }
    ];
    
    return {
      id,
      type: field.type === 'currency' ? 'bar' : field.type === 'string' ? 'pie' : 'line',
      title: `${field.name} Analysis`,
      data: sampleData,
      config: {},
      position: {
        x: 0,
        y: Math.max(...visualizations.map(v => v.position.y + v.position.height), 0),
        width: 4,
        height: 3
      }
    };
  };

  const handleSave = () => {
    const report = {
      name: reportName,
      description: 'Report created with Power BI',
      owner: 'Current User',
      workspace: 'My Workspace',
      isPublished: false,
      visualizations: visualizations
    };
    
    dataService.createReport(report);
    toast({
      title: "Report saved",
      description: `"${reportName}" has been saved successfully.`,
    });
  };

  const handleExport = () => {
    const reportData = JSON.stringify({ reportName, visualizations }, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: "Report exported successfully.",
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/report/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share link copied",
      description: "Report share link copied to clipboard.",
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1"
          />
          <Badge variant="secondary">
            <LayoutDashboard size={12} className="mr-1" />
            Report
          </Badge>
          <Badge variant="outline" className="text-xs">
            {viewMode === 'edit' ? 'Editing' : 'Preview'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} variant="outline" size="sm">
            <Save size={14} className="mr-1" />
            Save
          </Button>
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share size={14} className="mr-1" />
            Share
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download size={14} className="mr-1" />
            Export
          </Button>
          <Button 
            onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
            variant={viewMode === 'preview' ? 'default' : 'outline'}
            size="sm"
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
          <ChartVisualization
            key={viz.id}
            {...viz}
            isSelected={selectedVisualization === viz.id}
            onSelect={setSelectedVisualization}
            onUpdate={handleVisualizationUpdate}
            onDelete={handleVisualizationDelete}
          />
        ))}
        
        {viewMode === 'edit' && (
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer flex items-center justify-center col-span-3 row-span-2">
            <div className="text-center p-4">
              <Plus size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                Drag fields here to create new visualizations
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedReportCanvas;