
import React from 'react';
import { BarChart, LineChart, PieChart, AreaChart } from 'recharts';
import { MoreHorizontal, Maximize, X } from 'lucide-react';

const dummyData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

interface VisualizationProps {
  type: string;
  title: string;
}

const Visualization = ({ type, title }: VisualizationProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="powerbi-visual-header">
        <span className="font-medium">{title}</span>
        <div className="flex items-center">
          <button className="p-1 hover:bg-gray-100 rounded-sm">
            <MoreHorizontal size={14} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-sm">
            <Maximize size={14} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-sm">
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        <VisualizationContent type={type} />
      </div>
    </div>
  );
};

const VisualizationContent = ({ type }: { type: string }) => {
  switch (type) {
    case 'bar':
      return <BarChartViz />;
    case 'line':
      return <LineChartViz />;
    case 'pie':
      return <PieChartViz />;
    case 'card':
      return <CardViz />;
    case 'table':
      return <TableViz />;
    default:
      return <div>No visualization</div>;
  }
};

const BarChartViz = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#FCFCFC]">
      <BarChart width={300} height={200} data={dummyData}>
        <rect fill="#f5f5f5" width={300} height={200} />
        {dummyData.map((entry, index) => (
          <rect
            key={`bar-${index}`}
            x={index * 45 + 30}
            y={200 - entry.value / 5}
            width={30}
            height={entry.value / 5}
            fill="#6264A7"
          />
        ))}
      </BarChart>
    </div>
  );
};

const LineChartViz = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#FCFCFC]">
      <LineChart width={300} height={200} data={dummyData}>
        <rect fill="#f5f5f5" width={300} height={200} />
        <path
          d={`M30,${200 - dummyData[0].value / 5} ${dummyData.map((entry, index) => `L${index * 45 + 30},${200 - entry.value / 5}`).join(' ')}`}
          fill="none"
          stroke="#118DFF"
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
};

const PieChartViz = () => {
  const total = dummyData.reduce((sum, entry) => sum + entry.value, 0);
  let startAngle = 0;
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#FCFCFC]">
      <PieChart width={200} height={200}>
        <g transform="translate(100, 100)">
          {dummyData.map((entry, index) => {
            const percentage = entry.value / total;
            const angle = percentage * 360;
            const endAngle = startAngle + angle;
            
            const x1 = Math.cos((startAngle - 90) * Math.PI / 180) * 80;
            const y1 = Math.sin((startAngle - 90) * Math.PI / 180) * 80;
            const x2 = Math.cos((endAngle - 90) * Math.PI / 180) * 80;
            const y2 = Math.sin((endAngle - 90) * Math.PI / 180) * 80;
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const d = `M 0 0 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            const colors = ['#6264A7', '#118DFF', '#16C60C', '#F7630C', '#881798', '#FFB900'];
            const fill = colors[index % colors.length];
            
            const result = (
              <path key={index} d={d} fill={fill} />
            );
            
            startAngle += angle;
            return result;
          })}
        </g>
      </PieChart>
    </div>
  );
};

const CardViz = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#FCFCFC]">
      <div className="text-3xl font-semibold">$1,458,923</div>
      <div className="text-xs text-green-600 mt-1 flex items-center">
        <span className="mr-1">▲</span>
        <span>12.4% vs Last Year</span>
      </div>
    </div>
  );
};

const TableViz = () => {
  const tableData = [
    { product: 'Laptop Pro', sales: 1254, growth: 12.5 },
    { product: 'Smart Watch', sales: 986, growth: 8.3 },
    { product: 'Wireless Earbuds', sales: 756, growth: 15.7 },
    { product: 'Tablet Mini', sales: 682, growth: -2.3 },
  ];
  
  return (
    <div className="w-full h-full overflow-auto bg-[#FCFCFC]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row, index) => (
            <tr key={index}>
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
