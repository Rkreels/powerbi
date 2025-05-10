
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change: number;
  children?: React.ReactNode;
}

export const MetricsCard = ({ title, value, change, children }: MetricsCardProps) => {
  const isPositive = change > 0;
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-1 text-xs font-medium">
          {change !== 0 && (
            <span className={`${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {children}
      </CardContent>
    </Card>
  );
};

const salesData = [
  { month: 'Jan', sales: 4000, target: 4200 },
  { month: 'Feb', sales: 3000, target: 3300 },
  { month: 'Mar', sales: 5000, target: 4500 },
  { month: 'Apr', sales: 2780, target: 3000 },
  { month: 'May', sales: 1890, target: 2000 },
  { month: 'Jun', sales: 2390, target: 2500 },
  { month: 'Jul', sales: 3490, target: 3000 },
  { month: 'Aug', sales: 4000, target: 3700 },
  { month: 'Sep', sales: 2780, target: 3000 },
  { month: 'Oct', sales: 2000, target: 2500 },
  { month: 'Nov', sales: 5000, target: 4000 },
  { month: 'Dec', sales: 3540, target: 3000 }
];

const visitorsData = [
  { day: 'Mon', visitors: 520 },
  { day: 'Tue', visitors: 680 },
  { day: 'Wed', visitors: 790 },
  { day: 'Thu', visitors: 720 },
  { day: 'Fri', visitors: 580 },
  { day: 'Sat', visitors: 380 },
  { day: 'Sun', visitors: 290 }
];

const PowerBIMetrics: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard title="Total Revenue" value="$84,232.80" change={8.2} />
        <MetricsCard title="Unique Visitors" value="18,472" change={-3.1} />
        <MetricsCard title="New Customers" value="864" change={12.5} />
        <MetricsCard title="Avg Order Value" value="$92.58" change={1.2} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Monthly Sales vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="sales" name="Actual Sales" fill="#8884d8" />
                <Bar dataKey="target" name="Target" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Weekly Visitor Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="visitors" name="Visitors" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PowerBIMetrics;
