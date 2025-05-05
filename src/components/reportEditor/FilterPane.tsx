
import React, { useState } from 'react';
import { ChevronDown, Filter, Search, X } from 'lucide-react';

const FilterPane = () => {
  const [activeTab, setActiveTab] = useState('filters');
  
  return (
    <div className="flex flex-col w-[280px] border-l border-gray-200 bg-white overflow-hidden">
      <div className="powerbi-pane-header">
        <div className="flex">
          <button 
            className={`powerbi-tab-button ${activeTab === 'filters' ? 'active' : ''}`}
            onClick={() => setActiveTab('filters')}
          >
            Filters
          </button>
        </div>
      </div>
      
      {/* Filter sections */}
      <div className="flex-1 overflow-y-auto powerbi-scrollbar p-3">
        <FilterSection title="Report filters" />
        
        <FilterSection title="Page filters">
          <FilterCard 
            name="Category" 
            type="List"
            filters={['Electronics', 'Furniture', 'Office Supplies']} 
          />
          
          <FilterCard 
            name="Date" 
            type="Between"
            description="Jan 2023 - Dec 2023" 
          />
        </FilterSection>
        
        <FilterSection title="Visual filters" />
      </div>
    </div>
  );
};

interface FilterSectionProps {
  title: string;
  children?: React.ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div className="mb-4">
      <button 
        className="flex items-center justify-between w-full p-2 text-sm font-medium hover:bg-gray-100 rounded mb-2"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Filter size={14} className="mr-2" />
          <span>{title}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {expanded && children}
      
      {expanded && !children && (
        <div className="pl-2 text-sm text-gray-500">
          No filters applied
        </div>
      )}
    </div>
  );
};

interface FilterCardProps {
  name: string;
  type: string;
  filters?: string[];
  description?: string;
}

const FilterCard = ({ name, type, filters, description }: FilterCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="powerbi-filter-card">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{name}</div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">{type}</span>
          <button className="p-1 hover:bg-gray-100 rounded-sm">
            <ChevronDown 
              size={14} 
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`} 
              onClick={() => setExpanded(!expanded)}
            />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-sm">
            <X size={14} />
          </button>
        </div>
      </div>
      
      {!expanded && description && (
        <div className="text-xs text-gray-600">{description}</div>
      )}
      
      {!expanded && filters && (
        <div className="flex flex-wrap gap-1">
          {filters.map((filter, index) => (
            <span key={index} className="px-1.5 py-0.5 bg-gray-100 text-xs rounded">
              {filter}
            </span>
          ))}
        </div>
      )}
      
      {expanded && (
        <div className="mt-2 pt-2 border-t">
          {type === "List" && (
            <>
              <div className="relative mb-2">
                <Search size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full bg-gray-100 rounded pl-7 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-powerbi-primary"
                />
              </div>
              {filters && filters.map((filter, index) => (
                <div key={index} className="flex items-center mb-1">
                  <input type="checkbox" checked={true} className="mr-2" />
                  <span className="text-xs">{filter}</span>
                </div>
              ))}
            </>
          )}
          
          {type === "Between" && (
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-xs block mb-1">Start date</label>
                <input 
                  type="date" 
                  value="2023-01-01"
                  className="w-full border text-xs p-1 rounded" 
                />
              </div>
              <div>
                <label className="text-xs block mb-1">End date</label>
                <input 
                  type="date" 
                  value="2023-12-31"
                  className="w-full border text-xs p-1 rounded" 
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <button className="text-xs text-powerbi-primary font-medium hover:underline">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPane;
