
import React, { useState } from 'react';
import { 
  Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, 
  ResponsiveContainer, Tooltip as RechartsTooltip, 
  Legend, CartesianGrid, XAxis, YAxis
} from 'recharts';
import { MoreHorizontal, Maximize, X } from 'lucide-react';

interface VisualizationProps {
  type: string;
  title: string;
  data: any;
  onDelete?: () => void;
}

const COLORS = ['#6264A7', '#118DFF', '#16C60C', '#F7630C', '#881798', '#FFB900'];

const Visualization = ({ type, title, data, onDelete }: VisualizationProps) => {
  const [showOptions, setShowOptions] = useState(false);
  
  return (
    <div className="flex flex-col h-full bg-white border rounded shadow-sm">
      <div className="powerbi-visual-header p-2 flex items-center justify-between border-b">
        <span className="font-medium text-sm">{title}</span>
        <div className="flex items-center">
          <button 
            className="p-1 hover:bg-gray-100 rounded-sm"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal size={14} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-sm">
            <Maximize size={14} />
          </button>
          <button 
            className="p-1 hover:bg-gray-100 rounded-sm"
            onClick={onDelete}
          >
            <X size={14} />
          </button>
          
          {showOptions && (
            <div className="absolute top-8 right-0 bg-white border shadow-md rounded z-10 py-1 min-w-[120px]">
              <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-xs">
                Edit visual
              </button>
              <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-xs">
                Duplicate
              </button>
              <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-xs">
                Export data
              </button>
              <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-xs text-red-500"
                onClick={onDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        <VisualizationContent type={type} data={data} />
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
          />
          <Bar dataKey="value" fill="#6264A7" radius={[4, 4, 0, 0]}>
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
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#118DFF" 
            activeDot={{ r: 6 }} 
            strokeWidth={2} 
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
          <Legend />
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
