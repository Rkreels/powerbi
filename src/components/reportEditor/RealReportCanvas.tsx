import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  BarChart2, PieChart, LineChart, Table, Download, Save, Share2, 
  Filter, Settings, Eye, Play, Pause, Plus, Trash2, Copy, Edit3,
  Grid, Layout, TrendingUp, BarChart, Activity, Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { dataService } from '@/services/dataService';
import { 
  ResponsiveContainer, LineChart as RechartsLineChart, BarChart as RechartsBarChart, 
  PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, Pie 
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

interface Visualization {
  id: string;
  type: 'LineChart' | 'BarChart' | 'PieChart' | 'Table' | 'Card';
  title: string;
  datasetName: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
}

const DraggableVisualization: React.FC<{
  viz: Visualization;
  onUpdate: (id: string, updates: Partial<Visualization>) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ viz, onUpdate, onDelete, isSelected, onSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'visualization',
    item: { id: viz.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const { datasets } = dataService.getSampleData();
  const dataset = datasets.find(ds => ds.name === viz.datasetName);
  const data = dataset?.data || [];

  const renderVisualization = () => {
    switch (viz.type) {
      case 'LineChart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={viz.config.xAxis} />
              <YAxis />
              <Tooltip formatter={(value: any) => [value.toLocaleString(), viz.config.yAxis]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={viz.config.yAxis} 
                stroke={viz.config.color || '#8884d8'} 
                strokeWidth={2}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      
      case 'BarChart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={viz.config.xAxis} />
              <YAxis />
              <Tooltip formatter={(value: any) => [value.toLocaleString(), viz.config.yAxis]} />
              <Legend />
              <Bar dataKey={viz.config.yAxis} fill={viz.config.color || '#82ca9d'} />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      
      case 'PieChart':
        const pieData = data.reduce((acc: any[], item: any) => {
          const existing = acc.find(a => a.name === item[viz.config.nameField]);
          if (existing) {
            existing.value += item[viz.config.valueField];
          } else {
            acc.push({
              name: item[viz.config.nameField],
              value: item[viz.config.valueField]
            });
          }
          return acc;
        }, []);

        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [value.toLocaleString()]} />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      
      case 'Table':
        return (
          <div className="w-full h-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {Object.keys(data[0] || {}).map(key => (
                    <th key={key} className="text-left p-2 font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {Object.values(row).map((value: any, i) => (
                      <td key={i} className="p-2">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'Card':
        const total = data.reduce((sum, item) => sum + (item[viz.config.valueField] || 0), 0);
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-4">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{viz.config.label || viz.config.valueField}</div>
          </div>
        );
      
      default:
        return <div className="flex items-center justify-center h-full text-gray-400">No visualization</div>;
    }
  };

  return (
    <div
      ref={drag}
      className={`absolute bg-white border rounded-lg shadow-sm overflow-hidden cursor-move transition-all ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: viz.position.x,
        top: viz.position.y,
        width: viz.size.width,
        height: viz.size.height,
      }}
      onClick={() => onSelect(viz.id)}
    >
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <h3 className="text-sm font-medium truncate">{viz.title}</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => {
            e.stopPropagation();
            onUpdate(viz.id, { title: prompt('Edit title:', viz.title) || viz.title });
          }}>
            <Edit3 size={12} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => {
            e.stopPropagation();
            onDelete(viz.id);
          }}>
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
      <div className="h-full pb-10">
        {renderVisualization()}
      </div>
    </div>
  );
};

const RealReportCanvas: React.FC = () => {
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [selectedViz, setSelectedViz] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['visualization', 'tool'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        
        if (item.type === 'tool') {
          createVisualization(item.vizType, { x, y });
        } else if (item.id) {
          moveVisualization(item.id, { x, y });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const createVisualization = useCallback((type: string, position: { x: number; y: number }) => {
    const { datasets } = dataService.getSampleData();
    const defaultDataset = datasets[0];
    
    const newViz: Visualization = {
      id: `viz_${Date.now()}`,
      type: type as any,
      title: `${type} Chart`,
      datasetName: defaultDataset.name,
      position,
      size: { width: 400, height: 300 },
      config: getDefaultConfig(type, defaultDataset)
    };

    setVisualizations(prev => [...prev, newViz]);
    setSelectedViz(newViz.id);
    
    toast({
      title: "Visualization created",
      description: `${type} added to canvas`,
    });
  }, []);

  const getDefaultConfig = (type: string, dataset: any) => {
    const fields = Object.keys(dataset.data[0] || {});
    const numericFields = fields.filter(field => 
      typeof dataset.data[0]?.[field] === 'number'
    );
    const stringFields = fields.filter(field => 
      typeof dataset.data[0]?.[field] === 'string'
    );

    switch (type) {
      case 'LineChart':
      case 'BarChart':
        return {
          xAxis: stringFields[0] || fields[0],
          yAxis: numericFields[0] || fields[1],
          color: COLORS[0]
        };
      case 'PieChart':
        return {
          nameField: stringFields[0] || fields[0],
          valueField: numericFields[0] || fields[1]
        };
      case 'Card':
        return {
          valueField: numericFields[0] || fields[0],
          label: numericFields[0] || fields[0]
        };
      default:
        return {};
    }
  };

  const moveVisualization = useCallback((id: string, position: { x: number; y: number }) => {
    setVisualizations(prev => prev.map(viz => 
      viz.id === id ? { ...viz, position } : viz
    ));
  }, []);

  const updateVisualization = useCallback((id: string, updates: Partial<Visualization>) => {
    setVisualizations(prev => prev.map(viz => 
      viz.id === id ? { ...viz, ...updates } : viz
    ));
  }, []);

  const deleteVisualization = useCallback((id: string) => {
    setVisualizations(prev => prev.filter(viz => viz.id !== id));
    setSelectedViz(null);
    toast({
      title: "Visualization deleted",
      description: "Visualization removed from canvas",
    });
  }, []);

  const saveReport = useCallback(() => {
    const reportData = {
      name: `Report ${new Date().toLocaleDateString()}`,
      description: 'Generated report with visualizations',
      owner: 'Current User',
      workspace: 'My Workspace',
      isPublished: false,
      visualizations: visualizations.map(viz => ({
        ...viz,
        id: `saved_${viz.id}`
      }))
    };

    dataService.createReport(reportData);
    
    toast({
      title: "Report saved",
      description: "Your report has been saved successfully",
    });
  }, [visualizations]);

  const exportReport = useCallback((format: 'pdf' | 'excel' | 'powerpoint') => {
    toast({
      title: "Export started",
      description: `Exporting report to ${format.toUpperCase()}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: `Report exported as ${format.toUpperCase()} successfully`,
      });
    }, 2000);
  }, []);

  const shareReport = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Power BI Report',
        text: 'Check out my Power BI report',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Report link copied to clipboard",
      });
    }
  }, []);

  const ToolboxItem: React.FC<{ icon: React.ReactNode; label: string; vizType: string }> = ({ icon, label, vizType }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'tool',
      item: { type: 'tool', vizType },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`flex flex-col items-center p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition-colors ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        {icon}
        <span className="text-xs mt-1 text-center">{label}</span>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        {/* Toolbox */}
        <div className="w-64 bg-gray-50 border-r p-4">
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Visualizations</h3>
            <div className="grid grid-cols-2 gap-2">
              <ToolboxItem icon={<BarChart2 size={20} />} label="Bar Chart" vizType="BarChart" />
              <ToolboxItem icon={<LineChart size={20} />} label="Line Chart" vizType="LineChart" />
              <ToolboxItem icon={<PieChart size={20} />} label="Pie Chart" vizType="PieChart" />
              <ToolboxItem icon={<Table size={20} />} label="Table" vizType="Table" />
              <ToolboxItem icon={<TrendingUp size={20} />} label="Card" vizType="Card" />
              <ToolboxItem icon={<Activity size={20} />} label="Area Chart" vizType="AreaChart" />
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="font-semibold mb-3">Properties</h3>
            {selectedViz && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium">Dataset</label>
                  <Select 
                    value={visualizations.find(v => v.id === selectedViz)?.datasetName}
                    onValueChange={(value) => updateVisualization(selectedViz, { datasetName: value })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataService.getSampleData().datasets.map(ds => (
                        <SelectItem key={ds.name} value={ds.name}>{ds.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-12 bg-white border-b px-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {visualizations.length} visualizations
              </Badge>
              <Badge variant="outline" className="text-xs">
                {canvasSize.width} × {canvasSize.height}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={isPreviewMode ? "default" : "outline"} 
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? <Pause size={16} /> : <Play size={16} />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button variant="outline" size="sm" onClick={saveReport}>
                <Save size={16} className="mr-1" />
                Save
              </Button>
              
              <Button variant="outline" size="sm" onClick={shareReport}>
                <Share2 size={16} className="mr-1" />
                Share
              </Button>

              <Select onValueChange={(value) => exportReport(value as any)}>
                <SelectTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download size={16} className="mr-1" />
                    Export
                  </Button>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">Export as PDF</SelectItem>
                  <SelectItem value="excel">Export to Excel</SelectItem>
                  <SelectItem value="powerpoint">Export to PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div
              ref={(node) => {
                canvasRef.current = node;
                drop(node);
              }}
              className={`relative bg-white shadow-lg mx-auto transition-all ${
                isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
              }`}
              style={{ 
                width: canvasSize.width, 
                height: canvasSize.height,
                minHeight: '600px'
              }}
            >
              {visualizations.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Grid size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Drag visualizations here to start building your report</p>
                    <p className="text-sm mt-2">Choose from charts, tables, and cards in the toolbox</p>
                  </div>
                </div>
              )}
              
              {visualizations.map(viz => (
                <DraggableVisualization
                  key={viz.id}
                  viz={viz}
                  onUpdate={updateVisualization}
                  onDelete={deleteVisualization}
                  isSelected={selectedViz === viz.id}
                  onSelect={setSelectedViz}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default RealReportCanvas;