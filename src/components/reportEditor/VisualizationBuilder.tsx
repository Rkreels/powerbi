import React, { useState, useEffect } from 'react';
import { dataService } from '@/services/dataService';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Edit, Settings } from 'lucide-react';

interface VisualizationBuilderProps {
  visualization: any;
  onUpdate: (visualization: any) => void;
  onRemove: (id: string) => void;
}

const VisualizationBuilder: React.FC<VisualizationBuilderProps> = ({ 
  visualization, 
  onUpdate, 
  onRemove 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState(visualization.config || {});
  const [data, setData] = useState([]);
  const [title, setTitle] = useState(visualization.title || '');

  useEffect(() => {
    loadData();
  }, [visualization.datasetName, config]);

  const loadData = () => {
    if (visualization.datasetName) {
      const filters = config.filters || {};
      const chartData = dataService.queryData(visualization.datasetName, filters);
      setData(chartData);
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    const updatedVisualization = {
      ...visualization,
      config: newConfig,
      title: title
    };
    onUpdate(updatedVisualization);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const updatedVisualization = {
      ...visualization,
      title: newTitle,
      config: config
    };
    onUpdate(updatedVisualization);
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      );
    }

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

    switch (visualization.type) {
      case 'LineChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis || 'month'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={config.yAxis || 'revenue'} 
                stroke={config.color || '#8884d8'} 
                strokeWidth={2}
                name={config.yAxis || 'Value'}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'BarChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis || 'month'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={config.yAxis || 'revenue'} 
                fill={config.color || '#8884d8'}
                name={config.yAxis || 'Value'}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'PieChart':
        // Group data by the specified field for pie chart
        const groupedData = data.reduce((acc, item) => {
          const key = item[config.nameField || 'region'] || 'Unknown';
          const value = Number(item[config.valueField || 'revenue']) || 0;
          
          if (acc[key]) {
            acc[key] += value;
          } else {
            acc[key] = value;
          }
          return acc;
        }, {});

        const pieData = Object.entries(groupedData).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length]
        }));

        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="h-64 flex items-center justify-center">Unsupported chart type</div>;
    }
  };

  const getAvailableFields = () => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0] || {});
  };

  const availableFields = getAvailableFields();

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Input 
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none p-0 h-auto"
              placeholder="Chart Title"
            />
          ) : (
            <CardTitle className="text-lg">{title || 'Untitled Chart'}</CardTitle>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Settings size={16} /> : <Edit size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(visualization.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing && (
          <div className="mb-4 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="xAxis">X-Axis</Label>
              <Select value={config.xAxis || ''} onValueChange={(value) => handleConfigChange('xAxis', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="yAxis">Y-Axis / Value</Label>
              <Select value={config.yAxis || config.valueField || ''} onValueChange={(value) => {
                handleConfigChange('yAxis', value);
                handleConfigChange('valueField', value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.filter(field => 
                    typeof data[0]?.[field] === 'number'
                  ).map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {visualization.type === 'PieChart' && (
              <div>
                <Label htmlFor="nameField">Category Field</Label>
                <Select value={config.nameField || ''} onValueChange={(value) => handleConfigChange('nameField', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.filter(field => 
                      typeof data[0]?.[field] === 'string'
                    ).map(field => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="color">Color</Label>
              <input 
                type="color" 
                value={config.color || '#8884d8'}
                onChange={(e) => handleConfigChange('color', e.target.value)}
                className="w-full h-10 rounded border"
              />
            </div>
          </div>
        )}
        
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default VisualizationBuilder;