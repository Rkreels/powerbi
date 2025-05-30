
import React, { useState } from 'react';
import { Database, Link, Settings, RefreshCw, Plus, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const DataModel = () => {
  const [selectedTable, setSelectedTable] = useState('sales');
  const [searchQuery, setSearchQuery] = useState('');

  const tables = [
    {
      id: 'sales',
      name: 'Sales',
      rows: 150000,
      columns: 8,
      relationships: 3,
      fields: [
        { name: 'SaleID', type: 'Integer', key: true },
        { name: 'ProductID', type: 'Integer', foreignKey: true },
        { name: 'CustomerID', type: 'Integer', foreignKey: true },
        { name: 'SaleDate', type: 'DateTime' },
        { name: 'Quantity', type: 'Integer' },
        { name: 'UnitPrice', type: 'Decimal' },
        { name: 'TotalAmount', type: 'Decimal' },
        { name: 'Region', type: 'Text' }
      ]
    },
    {
      id: 'products',
      name: 'Products',
      rows: 500,
      columns: 6,
      relationships: 1,
      fields: [
        { name: 'ProductID', type: 'Integer', key: true },
        { name: 'ProductName', type: 'Text' },
        { name: 'Category', type: 'Text' },
        { name: 'Brand', type: 'Text' },
        { name: 'Price', type: 'Decimal' },
        { name: 'Cost', type: 'Decimal' }
      ]
    },
    {
      id: 'customers',
      name: 'Customers',
      rows: 25000,
      columns: 7,
      relationships: 1,
      fields: [
        { name: 'CustomerID', type: 'Integer', key: true },
        { name: 'FirstName', type: 'Text' },
        { name: 'LastName', type: 'Text' },
        { name: 'Email', type: 'Text' },
        { name: 'City', type: 'Text' },
        { name: 'State', type: 'Text' },
        { name: 'Country', type: 'Text' }
      ]
    },
    {
      id: 'dates',
      name: 'Dates',
      rows: 1095,
      columns: 5,
      relationships: 1,
      fields: [
        { name: 'Date', type: 'DateTime', key: true },
        { name: 'Year', type: 'Integer' },
        { name: 'Month', type: 'Integer' },
        { name: 'Quarter', type: 'Integer' },
        { name: 'DayOfWeek', type: 'Text' }
      ]
    }
  ];

  const relationships = [
    { from: 'Sales.ProductID', to: 'Products.ProductID', type: 'Many-to-One' },
    { from: 'Sales.CustomerID', to: 'Customers.CustomerID', type: 'Many-to-One' },
    { from: 'Sales.SaleDate', to: 'Dates.Date', type: 'Many-to-One' }
  ];

  const handleRefreshModel = () => {
    toast({
      title: "Model refreshed",
      description: "Data model has been updated with latest schema changes.",
      duration: 2000,
    });
  };

  const selectedTableData = tables.find(t => t.id === selectedTable);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Data Model</h1>
            <p className="text-sm text-gray-500">Manage your data relationships and schema</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tables..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefreshModel}>
              <RefreshCw size={16} className="mr-1" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Add Table
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tables List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-medium">Tables ({tables.length})</h3>
              </div>
              <div className="p-2">
                {tables.map((table) => (
                  <button
                    key={table.id}
                    className={`w-full p-3 text-left rounded-md hover:bg-gray-50 ${
                      selectedTable === table.id ? 'bg-blue-50 border-blue-200 border' : ''
                    }`}
                    onClick={() => setSelectedTable(table.id)}
                  >
                    <div className="flex items-center mb-2">
                      <Database size={16} className="mr-2 text-blue-600" />
                      <span className="font-medium">{table.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {table.rows.toLocaleString()} rows • {table.columns} columns
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{selectedTableData?.name} - Fields</h3>
                  <Button variant="outline" size="sm">
                    <Settings size={16} className="mr-1" />
                    Configure
                  </Button>
                </div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedTableData?.fields.map((field, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{field.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{field.type}</td>
                        <td className="px-4 py-3 text-sm">
                          {field.key && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Primary
                            </span>
                          )}
                          {field.foreignKey && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Foreign
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Relationships */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-medium">Relationships</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {relationships.map((rel, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <Link size={14} className="mr-2 text-gray-500" />
                        <span className="text-xs font-medium">{rel.type}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div className="mb-1">{rel.from}</div>
                        <div className="text-center text-gray-400">↓</div>
                        <div>{rel.to}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm mt-6">
              <div className="p-4 border-b">
                <h3 className="font-medium">Model Statistics</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Tables:</span>
                    <span className="font-medium">{tables.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Relationships:</span>
                    <span className="font-medium">{relationships.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Rows:</span>
                    <span className="font-medium">{tables.reduce((sum, t) => sum + t.rows, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Model Size:</span>
                    <span className="font-medium">12.4 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModel;
