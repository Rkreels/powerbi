
import React, { useState } from 'react';
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

  return (
    <div className="flex flex-col w-56 border-l border-gray-200 bg-white overflow-hidden">
      <div className="powerbi-pane-header">
        <span>Visualizations</span>
      </div>
      
      {/* Visualization Types */}
      <div className="p-3 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-2">
          <VisButton icon={<BarChart size={16} />} tooltip="Bar chart" />
          <VisButton icon={<LineChart size={16} />} tooltip="Line chart" />
          <VisButton icon={<PieChart size={16} />} tooltip="Pie chart" />
          <VisButton icon={<Table size={16} />} tooltip="Table" />
          <VisButton icon={<LayoutGrid size={16} />} tooltip="Card" />
          <VisButton icon={<Circle size={16} />} tooltip="Donut chart" />
          <VisButton icon={<Map size={16} />} tooltip="Map" />
          <VisButton icon={<MessageSquare size={16} />} tooltip="Text box" />
          <VisButton icon={<TrendingUp size={16} />} tooltip="Area chart" />
        </div>
      </div>
      
      {/* Visualization Settings */}
      <div className="flex-1 overflow-y-auto powerbi-scrollbar">
        <SettingsGroup title="Fields" expanded>
          <FieldWell name="Axis" description="Drag fields here" />
          <FieldWell name="Values" description="Drag fields here" />
          <FieldWell name="Legend" description="Drag fields here" />
        </SettingsGroup>
        
        <SettingsGroup title="Format">
          <div className="p-2 text-sm text-gray-500">
            Select a visual to see formatting options
          </div>
        </SettingsGroup>
        
        <SettingsGroup title="Analytics">
          <div className="p-2 text-sm text-gray-500">
            Select a visual to see analytics options
          </div>
        </SettingsGroup>
      </div>
    </div>
  );
};

interface VisButtonProps {
  icon: React.ReactNode;
  tooltip: string;
}

const VisButton = ({ icon, tooltip }: VisButtonProps) => {
  return (
    <button 
      className="flex items-center justify-center h-8 w-10 bg-white border hover:bg-gray-50 rounded"
      title={tooltip}
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
}

const FieldWell = ({ name, description }: FieldWellProps) => {
  return (
    <div className="mb-2">
      <div className="text-xs font-medium mb-1">{name}</div>
      <div className="min-h-[40px] border border-dashed rounded-sm p-2 text-xs text-gray-400 flex items-center justify-center">
        {description}
      </div>
    </div>
  );
};

export default VisualizationPane;
