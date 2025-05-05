
import React, { useState } from 'react';
import { ChevronDown, Search, Database, Table, List } from 'lucide-react';

const DataPane = () => {
  const [activeTab, setActiveTab] = useState('model');
  
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
            className="w-full bg-gray-100 rounded pl-7 pr-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-powerbi-primary"
          />
        </div>
      </div>
      
      {/* Data fields */}
      <div className="flex-1 overflow-y-auto powerbi-scrollbar p-2">
        <DataTable 
          name="Sales" 
          icon={<Database size={14} />}
          fields={[
            { name: "Revenue", type: "currency" },
            { name: "Quantity", type: "number" },
            { name: "Discount", type: "percentage" },
            { name: "Date", type: "date" }
          ]}
        />
        
        <DataTable 
          name="Products" 
          icon={<Table size={14} />}
          fields={[
            { name: "ProductID", type: "number" },
            { name: "Product Name", type: "string" },
            { name: "Category", type: "string" },
            { name: "Price", type: "currency" }
          ]}
        />
        
        <DataTable 
          name="Customers" 
          icon={<List size={14} />}
          fields={[
            { name: "CustomerID", type: "number" },
            { name: "Name", type: "string" },
            { name: "Country", type: "string" },
            { name: "City", type: "string" }
          ]}
        />
      </div>
    </div>
  );
};

interface DataTableProps {
  name: string;
  icon: React.ReactNode;
  fields: Array<{name: string, type: string}>;
}

const DataTable = ({ name, icon, fields }: DataTableProps) => {
  const [expanded, setExpanded] = useState(false);
  
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
              className="powerbi-field-item"
              draggable={true}
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
