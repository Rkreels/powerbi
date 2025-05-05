
import React, { useState } from 'react';
import { ChevronDown, Search, Database, Table, List } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const DataPane = () => {
  const [activeTab, setActiveTab] = useState('model');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleDragStart = (e: React.DragEvent, field: { name: string, type: string }) => {
    e.dataTransfer.setData('field', JSON.stringify(field));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const filterFields = (fields: Array<{name: string, type: string}>) => {
    if (!searchQuery) return fields;
    return fields.filter(field => 
      field.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  return (
    <div className="flex flex-col w-64 border-r border-gray-200 bg-white overflow-hidden">
      <div className="powerbi-pane-header">
        <div className="flex">
          <button 
            className={`powerbi-tab-button ${activeTab === 'model' ? 'active' : ''}`}
            onClick={() => setActiveTab('model')}
          >
            Model
          </button>
          <button 
            className={`powerbi-tab-button ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search fields" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded pl-7 pr-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-powerbi-primary"
          />
        </div>
      </div>
      
      {/* Data fields */}
      <div className="flex-1 overflow-y-auto powerbi-scrollbar p-2">
        <DataTable 
          name="Sales" 
          icon={<Database size={14} />}
          fields={filterFields([
            { name: "Revenue", type: "currency" },
            { name: "Quantity", type: "number" },
            { name: "Discount", type: "percentage" },
            { name: "Date", type: "date" }
          ])}
          onDragStart={handleDragStart}
        />
        
        <DataTable 
          name="Products" 
          icon={<Table size={14} />}
          fields={filterFields([
            { name: "ProductID", type: "number" },
            { name: "Product Name", type: "string" },
            { name: "Category", type: "string" },
            { name: "Price", type: "currency" }
          ])}
          onDragStart={handleDragStart}
        />
        
        <DataTable 
          name="Customers" 
          icon={<List size={14} />}
          fields={filterFields([
            { name: "CustomerID", type: "number" },
            { name: "Name", type: "string" },
            { name: "Country", type: "string" },
            { name: "City", type: "string" }
          ])}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  );
};

interface DataTableProps {
  name: string;
  icon: React.ReactNode;
  fields: Array<{name: string, type: string}>;
  onDragStart: (e: React.DragEvent, field: { name: string, type: string }) => void;
}

const DataTable = ({ name, icon, fields, onDragStart }: DataTableProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleFieldClick = (field: { name: string, type: string }) => {
    toast({
      title: `Field selected: ${field.name}`,
      description: `You can drag this ${field.type} field to a visualization.`,
      duration: 2000,
    });
  };
  
  return (
    <div className="mb-2">
      <button 
        className="flex items-center justify-between w-full p-2 text-sm hover:bg-gray-100 rounded"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          <span>{name}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {expanded && (
        <div className="ml-6 mt-1">
          {fields.map((field, index) => (
            <div 
              key={index}
              className="powerbi-field-item hover:bg-gray-100 cursor-pointer flex items-center gap-2 p-1.5 rounded text-sm"
              draggable={true}
              onDragStart={(e) => onDragStart(e, field)}
              onClick={() => handleFieldClick(field)}
            >
              <span className="w-2 h-2 rounded-full bg-powerbi-primary"></span>
              <span>{field.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataPane;
