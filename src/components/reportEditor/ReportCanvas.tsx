
import React, { useState } from 'react';
import Visualization from './Visualization';
import { Grid2X2 } from 'lucide-react';

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
    },
    {
      id: 'visual-2',
      type: 'line',
      title: 'Monthly Revenue Trend',
      x: 6,
      y: 0,
      width: 6,
      height: 4,
    },
    {
      id: 'visual-3',
      type: 'pie',
      title: 'Sales by Region',
      x: 0,
      y: 4,
      width: 4,
      height: 4,
    },
    {
      id: 'visual-4',
      type: 'card',
      title: 'Total Sales',
      x: 4,
      y: 4,
      width: 4,
      height: 2,
    },
    {
      id: 'visual-5',
      type: 'table',
      title: 'Top Products',
      x: 8,
      y: 4,
      width: 4,
      height: 4,
    }
  ]);

  return (
    <div className="flex-1 bg-gray-50 overflow-auto p-6">
      <div className="mb-4 flex items-center">
        <h2 className="text-lg font-medium mr-2">Sales Overview</h2>
        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-md">Report</span>
        
        <div className="ml-auto flex items-center gap-2">
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
            className="powerbi-visual"
            style={{
              gridColumn: `span ${viz.width} / span ${viz.width}`,
              gridRow: `span ${viz.height} / span ${viz.height}`
            }}
          >
            <Visualization type={viz.type} title={viz.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCanvas;
