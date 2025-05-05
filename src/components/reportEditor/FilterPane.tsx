
import React, { useState } from 'react';
import { ChevronDown, Filter, Search, X, Calendar, Trash2, Plus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const FilterPane = () => {
  const [activeTab, setActiveTab] = useState('filters');
  const [activeSection, setActiveSection] = useState<string[]>(['report', 'page', 'visual']);
  
  const toggleSection = (section: string) => {
    setActiveSection(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, filterType: string) => {
    e.preventDefault();
    try {
      const fieldData = JSON.parse(e.dataTransfer.getData('field'));
      toast({
        title: "Filter created",
        description: `A ${filterType} filter for ${fieldData.name} has been created.`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error parsing dragged data:", error);
    }
  };
  
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
        <FilterSection 
          title="Report filters" 
          expanded={activeSection.includes('report')}
          onToggle={() => toggleSection('report')}
          onDrop={(e) => handleDrop(e, 'report')}
        />
        
        <FilterSection 
          title="Page filters" 
          expanded={activeSection.includes('page')}
          onToggle={() => toggleSection('page')}
          onDrop={(e) => handleDrop(e, 'page')}
        >
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
          
          <button 
            className="w-full text-sm bg-gray-100 hover:bg-gray-200 p-2 rounded text-center mb-2 flex items-center justify-center gap-2"
            onClick={() => {
              toast({
                title: "Add page filter",
                description: "Drag a field here to create a page filter.",
                duration: 2000,
              });
            }}
          >
            <Plus size={14} />
            Add page filter
          </button>
        </FilterSection>
        
        <FilterSection 
          title="Visual filters" 
          expanded={activeSection.includes('visual')}
          onToggle={() => toggleSection('visual')}
          onDrop={(e) => handleDrop(e, 'visual')}
        >
          <button 
            className="w-full text-sm bg-gray-100 hover:bg-gray-200 p-2 rounded text-center mb-2 flex items-center justify-center gap-2"
            onClick={() => {
              toast({
                title: "Add visual filter",
                description: "Select a visualization and drag a field here to create a filter.",
                duration: 2000,
              });
            }}
          >
            <Plus size={14} />
            Add visual filter
          </button>
        </FilterSection>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm font-medium mb-2 flex items-center">
            <Calendar size={14} className="mr-2 text-gray-500" />
            Relative Date Filtering
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Filter data based on a relative time period.
          </p>
          <select className="w-full text-xs border rounded p-1.5 mb-2">
            <option>Last 30 days</option>
            <option>Last 60 days</option>
            <option>Last quarter</option>
            <option>Last year</option>
            <option>Year to date</option>
          </select>
          <button 
            className="w-full text-xs bg-powerbi-primary text-white py-1.5 rounded hover:bg-powerbi-primary/90"
            onClick={() => {
              toast({
                title: "Relative date filter applied",
                description: "Your data is now filtered to show the last 30 days.",
                duration: 2000,
              });
            }}
          >
            Apply Date Filter
          </button>
        </div>
      </div>
    </div>
  );
};

interface FilterSectionProps {
  title: string;
  children?: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  onDrop: (e: React.DragEvent) => void;
}

const FilterSection = ({ title, children, expanded, onToggle, onDrop }: FilterSectionProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    setIsDraggingOver(false);
    onDrop(e);
  };
  
  return (
    <div className="mb-4">
      <button 
        className="flex items-center justify-between w-full p-2 text-sm font-medium hover:bg-gray-100 rounded mb-2"
        onClick={onToggle}
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
      
      {expanded && (
        <div 
          className={`pl-2 ${isDraggingOver ? 'bg-blue-50 border border-dashed border-powerbi-primary rounded p-2' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {children || (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>Drag fields here to create filters</span>
            </div>
          )}
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
  const [selectedFilters, setSelectedFilters] = useState<string[]>(filters || []);
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  
  const handleCheckboxChange = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  
  const handleApply = () => {
    setExpanded(false);
    toast({
      title: "Filter applied",
      description: `${name} filter has been updated.`,
      duration: 2000,
    });
  };
  
  const handleRemove = () => {
    toast({
      title: "Filter removed",
      description: `${name} filter has been removed.`,
      duration: 2000,
    });
  };
  
  return (
    <div className="powerbi-filter-card p-3 bg-gray-50 rounded mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{name}</div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">{type}</span>
          <button 
            className="p-1 hover:bg-gray-100 rounded-sm"
            onClick={() => setExpanded(!expanded)}  
          >
            <ChevronDown 
              size={14} 
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`} 
            />
          </button>
          <button 
            className="p-1 hover:bg-gray-100 rounded-sm"
            onClick={handleRemove}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {!expanded && description && (
        <div className="text-xs text-gray-600">{description}</div>
      )}
      
      {!expanded && filters && (
        <div className="flex flex-wrap gap-1">
          {selectedFilters.map((filter, index) => (
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
                  <input 
                    type="checkbox" 
                    id={`filter-${name}-${filter}`}
                    checked={selectedFilters.includes(filter)} 
                    onChange={() => handleCheckboxChange(filter)}
                    className="mr-2" 
                  />
                  <label htmlFor={`filter-${name}-${filter}`} className="text-xs cursor-pointer">
                    {filter}
                  </label>
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border text-xs p-1 rounded" 
                />
              </div>
              <div>
                <label className="text-xs block mb-1">End date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border text-xs p-1 rounded" 
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <button 
              className="text-xs text-powerbi-primary font-medium hover:underline"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPane;
