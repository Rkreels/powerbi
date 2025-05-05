
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Plus, Search, RefreshCw, Settings, Link, X, Table, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const DataModel = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeView, setActiveView] = useState('diagram');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTables, setSelectedTables] = useState<string[]>(['Sales', 'Products']);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data model refreshed",
        description: "The data model has been updated.",
        duration: 2000,
      });
    }, 1000);
  };
  
  const handleAddRelationship = () => {
    toast({
      title: "Add relationship",
      description: "Select two tables to create a relationship between them.",
      duration: 2000,
    });
  };
  
  const tables = [
    {
      name: "Sales",
      fields: [
        { name: "SalesID", type: "integer", isPrimaryKey: true },
        { name: "Date", type: "date" },
        { name: "ProductID", type: "integer", isForeignKey: true },
        { name: "CustomerID", type: "integer", isForeignKey: true },
        { name: "Quantity", type: "integer" },
        { name: "UnitPrice", type: "decimal" },
        { name: "TotalAmount", type: "decimal" }
      ]
    },
    {
      name: "Products",
      fields: [
        { name: "ProductID", type: "integer", isPrimaryKey: true },
        { name: "ProductName", type: "string" },
        { name: "CategoryID", type: "integer", isForeignKey: true },
        { name: "UnitPrice", type: "decimal" },
        { name: "UnitsInStock", type: "integer" }
      ]
    },
    {
      name: "Customers",
      fields: [
        { name: "CustomerID", type: "integer", isPrimaryKey: true },
        { name: "CustomerName", type: "string" },
        { name: "ContactName", type: "string" },
        { name: "Country", type: "string" },
        { name: "City", type: "string" },
        { name: "PostalCode", type: "string" }
      ]
    },
    {
      name: "Categories",
      fields: [
        { name: "CategoryID", type: "integer", isPrimaryKey: true },
        { name: "CategoryName", type: "string" },
        { name: "Description", type: "string" }
      ]
    }
  ].filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.fields.some(field => field.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const relationships = [
    { 
      id: 1, 
      fromTable: "Sales", 
      fromField: "ProductID", 
      toTable: "Products", 
      toField: "ProductID", 
      cardinality: "many-to-one" 
    },
    { 
      id: 2, 
      fromTable: "Sales", 
      fromField: "CustomerID", 
      toTable: "Customers", 
      toField: "CustomerID", 
      cardinality: "many-to-one" 
    },
    { 
      id: 3, 
      fromTable: "Products", 
      fromField: "CategoryID", 
      toTable: "Categories", 
      toField: "CategoryID", 
      cardinality: "many-to-one" 
    }
  ];

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName) 
        : [...prev, tableName]
    );
  };
  
  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 border-b bg-white">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Data Model</h1>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Manage data relationships</span>
                <button 
                  className={`ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded flex items-center ${isRefreshing ? 'animate-spin' : ''}`}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tables and fields" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-powerbi-primary"
                />
              </div>
              <Button onClick={handleAddRelationship}>
                <Link size={16} className="mr-1" />
                New relationship
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="diagram" className="mt-4" onValueChange={setActiveView}>
            <TabsList>
              <TabsTrigger value="diagram">Diagram view</TabsTrigger>
              <TabsTrigger value="table">Table view</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-6">
          {activeView === 'diagram' ? (
            <div className="flex h-[calc(100vh-240px)]">
              <div className="w-64 bg-white border rounded-md p-4 overflow-y-auto mr-4">
                <h3 className="text-sm font-medium mb-3">Tables</h3>
                <div className="space-y-1">
                  {tables.map((table) => (
                    <div 
                      key={table.name}
                      className={`flex items-center p-2 rounded text-sm cursor-pointer ${selectedTables.includes(table.name) ? 'bg-powerbi-primary text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => toggleTableSelection(table.name)}
                    >
                      <Table size={14} className="mr-2" />
                      <span>{table.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 bg-white border rounded-md p-4 relative">
                {selectedTables.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Database size={48} className="mx-auto mb-2 opacity-30" />
                      <p>Select tables from the list to visualize your data model</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full relative">
                    <div className="absolute left-1/4 top-1/4 w-64 border bg-gray-50 rounded shadow-sm p-2">
                      <div className="bg-powerbi-primary text-white text-xs py-1 px-2 rounded-t flex items-center justify-between">
                        <span>Sales</span>
                        <div className="flex">
                          <button className="p-0.5 hover:bg-powerbi-primary-dark rounded">
                            <Settings size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="px-2 py-1">
                        {tables.find(t => t.name === "Sales")?.fields.map((field, index) => (
                          <div key={index} className="flex items-center text-xs py-0.5">
                            <span className={`w-2 h-2 rounded-full mr-1 ${field.isPrimaryKey ? 'bg-yellow-500' : field.isForeignKey ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                            <span className="flex-1">{field.name}</span>
                            <span className="text-gray-500">{field.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="absolute right-1/4 top-1/4 w-64 border bg-gray-50 rounded shadow-sm p-2">
                      <div className="bg-powerbi-primary text-white text-xs py-1 px-2 rounded-t flex items-center justify-between">
                        <span>Products</span>
                        <div className="flex">
                          <button className="p-0.5 hover:bg-powerbi-primary-dark rounded">
                            <Settings size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="px-2 py-1">
                        {tables.find(t => t.name === "Products")?.fields.map((field, index) => (
                          <div key={index} className="flex items-center text-xs py-0.5">
                            <span className={`w-2 h-2 rounded-full mr-1 ${field.isPrimaryKey ? 'bg-yellow-500' : field.isForeignKey ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                            <span className="flex-1">{field.name}</span>
                            <span className="text-gray-500">{field.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* SVG for relationship lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="33%" y1="32%" x2="58%" y2="32%" stroke="#6264A7" strokeWidth="2" strokeDasharray="4" />
                      <polygon points="58%,32% 56%,31% 56%,33%" fill="#6264A7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">From table</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">From column</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">To table</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">To column</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Cardinality</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {relationships.map((rel) => (
                    <tr key={rel.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{rel.fromTable}</td>
                      <td className="px-4 py-3 text-sm">{rel.fromField}</td>
                      <td className="px-4 py-3">{rel.toTable}</td>
                      <td className="px-4 py-3 text-sm">{rel.toField}</td>
                      <td className="px-4 py-3 text-sm">{rel.cardinality}</td>
                      <td className="px-4 py-3">
                        <button 
                          className="p-1 hover:bg-gray-200 rounded text-red-500"
                          onClick={() => {
                            toast({
                              title: "Relationship deleted",
                              description: `The relationship between ${rel.fromTable} and ${rel.toTable} has been deleted.`,
                              duration: 2000,
                            });
                          }}
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DataModel;
