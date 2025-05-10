
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PowerBIMetrics from '@/components/dashboard/PowerBIMetrics';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("month");
  const [category, setCategory] = useState("all");

  return (
    <div className="w-full h-full overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Sales Dashboard</h1>
            <p className="text-gray-500">Performance metrics and KPIs</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="food">Food & Beverage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <PowerBIMetrics />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
            <div className="space-y-2">
              {[
                { name: "Ultra HD Smart TV", sales: 432, change: 12 },
                { name: "Wireless Headphones", sales: 327, change: -3 },
                { name: "Smartphone Charger", sales: 298, change: 8 },
                { name: "Bluetooth Speaker", sales: 276, change: 5 },
                { name: "Fitness Tracker", sales: 195, change: -2 }
              ].map((product, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} units</p>
                  </div>
                  <div className={`text-sm ${product.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.change > 0 ? `↑ ${product.change}%` : `↓ ${Math.abs(product.change)}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Regional Performance</h2>
            <div className="space-y-2">
              {[
                { region: "North America", revenue: "$42,580", growth: 8.4 },
                { region: "Europe", revenue: "$23,650", growth: 4.2 },
                { region: "Asia Pacific", revenue: "$15,380", growth: 12.7 },
                { region: "South America", revenue: "$7,920", growth: -2.3 },
                { region: "Africa", revenue: "$4,780", growth: 15.8 }
              ].map((region, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{region.region}</p>
                    <p className="text-sm text-gray-500">{region.revenue}</p>
                  </div>
                  <div className={`text-sm ${region.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {region.growth > 0 ? `↑ ${region.growth}%` : `↓ ${Math.abs(region.growth)}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
