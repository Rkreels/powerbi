
import React, { useState, useEffect } from 'react';
import { 
  Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, 
  ResponsiveContainer, Tooltip as RechartsTooltip, 
  Legend, CartesianGrid, XAxis, YAxis
} from 'recharts';
import { MoreHorizontal, Maximize, X, Settings, Download, ChevronDown } from 'lucide-react';

interface VisualizationProps {
  type: string;
  title: string;
  data: any;
  isEditable?: boolean;
  onDelete?: () => void;
}

const COLORS = ['#6264A7', '#118DFF', '#16C60C', '#F7630C', '#881798', '#FFB900'];

const Visualization = ({ type, title, data, isEditable = true, onDelete }: VisualizationProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOptions && !(event.target as Element).closest('.options-menu')) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);
  
  return (
    <div className={`flex flex-col h-full bg-white border rounded shadow-sm ${isMaximized ? 'fixed top-0 left-0 w-full h-full z-50' : ''}`}>
      <div className="powerbi-visual-header p-2 flex items-center justify-between border-b">
        <span className="font-medium text-sm">{title}</span>
        {isEditable && (
          <div className="flex items-center relative">
            <button 
              className="p-1 hover:bg-gray-100 rounded-sm"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings size={14} />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-sm"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreHorizontal size={14} />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-sm"
              onClick={() => setIsMaximized(!isMaximized)}
            >
              <Maximize size={14} />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-sm"
              onClick={onDelete}
            >
              <X size={14} />
            </button>
            
            {showOptions && (
              <div className="options-menu absolute top-8 right-0 bg-white border shadow-md rounded z-10 py-1 min-w-[120px]">
                <button 
                  className="w-full text-left px-3 py-1 hover:bg-gray-100 text-xs flex items-center"
                  onClick={() => {
                    setShowOptions(false);
                    setIsSettingsOpen(true);
                  }}
                >
                  <Settings size={12} className="mr-2" />
                  Edit visual
                </button>
                <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-xs flex items-center">
                  <ChevronDown size={12} className="mr-2" />
                  Duplicate
                </button>
                <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-xs flex items-center">
                  <Download size={12} className="mr-2" />
                  Export data
                </button>
                <button 
                  className="w-full text-left px-3 py-1 hover:bg-gray-100 text-xs text-red-500 flex items-center"
                  onClick={onDelete}
                >
                  <X size={12} className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 p-3 overflow-hidden relative">
        <VisualizationContent type={type} data={data} />
        
        {isSettingsOpen && (
          <div className="absolute top-0 right-0 bottom-0 bg-white border-l border-gray-200 w-48 shadow-md p-2 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Format Visual</h3>
              <button 
                className="p-1 hover:bg-gray-100 rounded-sm"
                onClick={() => setIsSettingsOpen(false)}
              >
                <X size={12} />
              </button>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                className="w-full border text-xs p-1 rounded"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Chart Type</label>
              <select className="w-full border text-xs p-1 rounded">
                <option value="bar" selected={type === 'bar'}>Bar Chart</option>
                <option value="line" selected={type === 'line'}>Line Chart</option>
                <option value="pie" selected={type === 'pie'}>Pie Chart</option>
                <option value="card" selected={type === 'card'}>Card</option>
                <option value="table" selected={type === 'table'}>Table</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Colors</label>
              <div className="flex flex-wrap gap-1 mb-1">
                {COLORS.map((color, index) => (
                  <div 
                    key={index}
                    className="w-5 h-5 rounded cursor-pointer hover:ring-2 ring-gray-400"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Data Labels</label>
              <div className="flex items-center">
                <input type="checkbox" id="data-labels" className="mr-1" />
                <label htmlFor="data-labels" className="text-xs">Show data labels</label>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Legend</label>
              <div className="flex items-center">
                <input type="checkbox" id="show-legend" className="mr-1" checked />
                <label htmlFor="show-legend" className="text-xs">Show legend</label>
              </div>
            </div>
            
            <button className="w-full bg-powerbi-primary text-white text-xs py-1 rounded">
              Apply Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const VisualizationContent = ({ type, data }: { type: string; data: any }) => {
  switch (type) {
    case 'bar':
      return <BarChartViz data={data} />;
    case 'line':
      return <LineChartViz data={data} />;
    case 'pie':
      return <PieChartViz data={data} />;
    case 'card':
      return <CardViz data={data} />;
    case 'table':
      return <TableViz data={data} />;
    default:
      return <div>No visualization</div>;
  }
};

const BarChartViz = ({ data }: { data: any[] }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" fontSize={10} />
          <YAxis fontSize={10} />
          <RechartsTooltip 
            formatter={(value: number) => [`${value}`, 'Value']} 
            labelFormatter={(label) => `Category: ${label}`}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Bar dataKey="value" fill="#6264A7" radius={[4, 4, 0, 0]} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LineChartViz = ({ data }: { data: any[] }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" fontSize={10} />
          <YAxis fontSize={10} />
          <RechartsTooltip 
            formatter={(value: number) => [`${value}`, 'Value']} 
            labelFormatter={(label) => `Month: ${label}`}
            cursor={{ strokeDasharray: '5 5' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#118DFF" 
            activeDot={{ r: 6 }} 
            strokeWidth={2} 
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const PieChartViz = ({ data }: { data: any[] }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip 
            formatter={(value: number) => [`${value}`, 'Value']} 
            labelFormatter={(name) => `Region: ${name}`}
          />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const CardViz = ({ data }: { data: { value: number; trend: number; comparison: string } }) => {
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(data.value);
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white">
      <div className="text-3xl font-semibold">{formattedValue}</div>
      <div className={`text-xs ${data.trend >= 0 ? 'text-green-600' : 'text-red-600'} mt-1 flex items-center`}>
        <span className="mr-1">{data.trend >= 0 ? '▲' : '▼'}</span>
        <span>{Math.abs(data.trend)}% vs {data.comparison}</span>
      </div>
    </div>
  );
};

const TableViz = ({ data }: { data: any[] }) => {
  return (
    <div className="w-full h-full overflow-auto bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors cursor-pointer">
              <td className="px-3 py-2 whitespace-nowrap text-sm">{row.product}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{row.sales.toLocaleString()}</td>
              <td className={`px-3 py-2 whitespace-nowrap text-sm text-right ${row.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {row.growth >= 0 ? '+' : ''}{row.growth}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Visualization;
