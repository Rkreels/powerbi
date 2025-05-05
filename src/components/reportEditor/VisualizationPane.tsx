
import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Table, 
  LayoutGrid, 
  Circle, 
  Map, 
  MessageSquare, 
  TrendingUp,
  ChevronDown
} from 'lucide-react';

const VisualizationPane = () => {
  const [activeTab, setActiveTab] = useState('visualizations');

  const handleVisualizationSelect = (type: string) => {
    toast({
      title: "Visualization added",
      description: `A new ${type} chart has been added to your report.`,
      duration: 2000,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, wellName: string) => {
    e.preventDefault();
    try {
      const fieldData = JSON.parse(e.dataTransfer.getData('field'));
      toast({
        title: "Field added",
        description: `${fieldData.name} has been added to ${wellName}.`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error parsing dragged data:", error);
    }
  };

  return (
    <div className="flex flex-col w-56 border-l border-gray-200 bg-white overflow-hidden">
      <div className="powerbi-pane-header">
        <span>Visualizations</span>
      </div>
      
      {/* Visualization Types */}
      <div className="p-3 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-2">
          <VisButton icon={<BarChart size={16} />} tooltip="Bar chart" onClick={() => handleVisualizationSelect('bar')} />
          <VisButton icon={<LineChart size={16} />} tooltip="Line chart" onClick={() => handleVisualizationSelect('line')} />
          <VisButton icon={<PieChart size={16} />} tooltip="Pie chart" onClick={() => handleVisualizationSelect('pie')} />
          <VisButton icon={<Table size={16} />} tooltip="Table" onClick={() => handleVisualizationSelect('table')} />
          <VisButton icon={<LayoutGrid size={16} />} tooltip="Card" onClick={() => handleVisualizationSelect('card')} />
          <VisButton icon={<Circle size={16} />} tooltip="Donut chart" onClick={() => handleVisualizationSelect('donut')} />
          <VisButton icon={<Map size={16} />} tooltip="Map" onClick={() => handleVisualizationSelect('map')} />
          <VisButton icon={<MessageSquare size={16} />} tooltip="Text box" onClick={() => handleVisualizationSelect('text')} />
          <VisButton icon={<TrendingUp size={16} />} tooltip="Area chart" onClick={() => handleVisualizationSelect('area')} />
        </div>
      </div>
      
      {/* Visualization Settings */}
      <div className="flex-1 overflow-y-auto powerbi-scrollbar">
        <SettingsGroup title="Fields" expanded>
          <FieldWell name="Axis" description="Drag fields here" onDrop={(e) => handleDrop(e, 'Axis')} />
          <FieldWell name="Values" description="Drag fields here" onDrop={(e) => handleDrop(e, 'Values')} />
          <FieldWell name="Legend" description="Drag fields here" onDrop={(e) => handleDrop(e, 'Legend')} />
        </SettingsGroup>
        
        <SettingsGroup title="Format">
          <div className="p-2">
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Title</label>
              <input type="text" className="w-full text-xs border rounded p-1.5" defaultValue="Chart Title" />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Chart Colors</label>
              <div className="flex gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded cursor-pointer"></div>
                <div className="w-5 h-5 bg-green-500 rounded cursor-pointer"></div>
                <div className="w-5 h-5 bg-yellow-500 rounded cursor-pointer"></div>
                <div className="w-5 h-5 bg-red-500 rounded cursor-pointer"></div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Background</label>
              <select className="w-full text-xs border rounded p-1.5">
                <option>White</option>
                <option>Light Gray</option>
                <option>Transparent</option>
              </select>
            </div>
          </div>
        </SettingsGroup>
        
        <SettingsGroup title="Analytics">
          <div className="p-2">
            <button className="w-full text-xs bg-gray-100 hover:bg-gray-200 py-1.5 px-2 rounded text-left mb-2">
              Add trend line
            </button>
            <button className="w-full text-xs bg-gray-100 hover:bg-gray-200 py-1.5 px-2 rounded text-left mb-2">
              Add constant line
            </button>
            <button className="w-full text-xs bg-gray-100 hover:bg-gray-200 py-1.5 px-2 rounded text-left">
              Add forecast
            </button>
          </div>
        </SettingsGroup>
      </div>
    </div>
  );
};

interface VisButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
}

const VisButton = ({ icon, tooltip, onClick }: VisButtonProps) => {
  return (
    <button 
      className="flex items-center justify-center h-8 w-10 bg-white border hover:bg-gray-50 rounded"
      title={tooltip}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
}

const SettingsGroup = ({ title, children, expanded: initialExpanded = false }: SettingsGroupProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  
  return (
    <div className="border-b border-gray-200">
      <button 
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium"
        onClick={() => setExpanded(!expanded)}
      >
        {title}
        <ChevronDown 
          size={14} 
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {expanded && (
        <div className="px-2 pb-2">
          {children}
        </div>
      )}
    </div>
  );
};

interface FieldWellProps {
  name: string;
  description: string;
  onDrop: (e: React.DragEvent) => void;
}

const FieldWell = ({ name, description, onDrop }: FieldWellProps) => {
  const [isOver, setIsOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(e);
  };
  
  return (
    <div className="mb-2">
      <div className="text-xs font-medium mb-1">{name}</div>
      <div 
        className={`min-h-[40px] border ${isOver ? 'border-powerbi-primary bg-blue-50' : 'border-dashed'} rounded-sm p-2 text-xs text-gray-400 flex items-center justify-center transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {description}
      </div>
    </div>
  );
};

export default VisualizationPane;
