import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Filter, X, Calendar as CalendarIcon, Plus, Trash2, 
  RotateCcw, Search, ChevronDown, Check
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { dataService } from '@/services/dataService';
import { toast } from "@/hooks/use-toast";

interface FilterCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any;
  type: 'text' | 'number' | 'date' | 'select';
}

interface FilterGroup {
  id: string;
  name: string;
  conditions: FilterCondition[];
  operator: 'AND' | 'OR';
}

const OPERATORS = {
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does not contain' }
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'between', label: 'Between' }
  ],
  date: [
    { value: 'equals', label: 'On' },
    { value: 'greater_than', label: 'After' },
    { value: 'less_than', label: 'Before' },
    { value: 'between', label: 'Between' }
  ],
  select: [
    { value: 'in', label: 'Is one of' },
    { value: 'not_in', label: 'Is not one of' }
  ]
};

interface RealFilterSystemProps {
  trigger?: React.ReactNode;
  onFiltersApply?: (filters: FilterGroup[]) => void;
  availableFields?: { name: string; type: string; values?: string[] }[];
}

export const RealFilterSystem: React.FC<RealFilterSystemProps> = ({ 
  trigger, 
  onFiltersApply,
  availableFields = []
}) => {
  const [open, setOpen] = useState(false);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get sample data fields if none provided
  const fields = availableFields.length > 0 ? availableFields : [
    { name: 'month', type: 'text', values: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    { name: 'revenue', type: 'number' },
    { name: 'region', type: 'select', values: ['North', 'South', 'East', 'West'] },
    { name: 'category', type: 'select', values: ['Electronics', 'Clothing', 'Home', 'Sports', 'Books'] },
    { name: 'date', type: 'date' }
  ];

  useEffect(() => {
    if (filterGroups.length === 0) {
      createNewGroup();
    }
  }, []);

  const createNewGroup = () => {
    const newGroup: FilterGroup = {
      id: `group_${Date.now()}`,
      name: `Filter Group ${filterGroups.length + 1}`,
      conditions: [],
      operator: 'AND'
    };
    setFilterGroups(prev => [...prev, newGroup]);
    setActiveGroup(newGroup.id);
  };

  const addCondition = (groupId: string) => {
    const newCondition: FilterCondition = {
      id: `condition_${Date.now()}`,
      field: fields[0]?.name || '',
      operator: 'equals',
      value: '',
      type: fields[0]?.type as any || 'text'
    };

    setFilterGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, conditions: [...group.conditions, newCondition] }
        : group
    ));
  };

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<FilterCondition>) => {
    setFilterGroups(prev => prev.map(group => 
      group.id === groupId 
        ? {
            ...group,
            conditions: group.conditions.map(condition =>
              condition.id === conditionId ? { ...condition, ...updates } : condition
            )
          }
        : group
    ));
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setFilterGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, conditions: group.conditions.filter(c => c.id !== conditionId) }
        : group
    ));
  };

  const removeGroup = (groupId: string) => {
    setFilterGroups(prev => prev.filter(g => g.id !== groupId));
    if (activeGroup === groupId && filterGroups.length > 1) {
      setActiveGroup(filterGroups.find(g => g.id !== groupId)?.id || '');
    }
  };

  const clearAllFilters = () => {
    setFilterGroups([]);
    createNewGroup();
    toast({
      title: "Filters cleared",
      description: "All filters have been removed",
    });
  };

  const applyFilters = () => {
    const validGroups = filterGroups.filter(group => group.conditions.length > 0);
    onFiltersApply?.(validGroups);
    setOpen(false);
    
    toast({
      title: "Filters applied",
      description: `${validGroups.length} filter group(s) applied`,
    });
  };

  const renderConditionValue = (condition: FilterCondition, groupId: string) => {
    const field = fields.find(f => f.name === condition.field);
    
    switch (condition.type) {
      case 'text':
      case 'number':
        return (
          <Input
            value={condition.value}
            onChange={(e) => updateCondition(groupId, condition.id, { 
              value: condition.type === 'number' ? Number(e.target.value) : e.target.value 
            })}
            placeholder={`Enter ${condition.type}`}
            type={condition.type}
          />
        );
      
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start text-left font-normal", !condition.value && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {condition.value ? format(new Date(condition.value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={condition.value ? new Date(condition.value) : undefined}
                onSelect={(date) => updateCondition(groupId, condition.id, { value: date?.toISOString() })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            {field?.values?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  checked={Array.isArray(condition.value) ? condition.value.includes(option) : condition.value === option}
                  onCheckedChange={(checked) => {
                    if (condition.operator === 'in' || condition.operator === 'not_in') {
                      const currentValues = Array.isArray(condition.value) ? condition.value : [];
                      const newValues = checked 
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      updateCondition(groupId, condition.id, { value: newValues });
                    } else {
                      updateCondition(groupId, condition.id, { value: checked ? option : '' });
                    }
                  }}
                />
                <Label className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const activeGroupData = filterGroups.find(g => g.id === activeGroup);

  const defaultTrigger = (
    <Button variant="outline">
      <Filter size={16} className="mr-2" />
      Advanced Filters
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Advanced Filters</DialogTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {filterGroups.reduce((sum, group) => sum + group.conditions.length, 0)} conditions
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <RotateCcw size={16} className="mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-96">
          {/* Filter Groups Sidebar */}
          <div className="w-64 border-r pr-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filter Groups</h3>
                <Button variant="ghost" size="sm" onClick={createNewGroup}>
                  <Plus size={16} />
                </Button>
              </div>
              
              <div className="space-y-1">
                {filterGroups.map((group) => (
                  <div
                    key={group.id}
                    className={cn(
                      "p-2 rounded cursor-pointer flex items-center justify-between group",
                      activeGroup === group.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                    )}
                    onClick={() => setActiveGroup(group.id)}
                  >
                    <div>
                      <div className="text-sm font-medium">{group.name}</div>
                      <div className="text-xs text-gray-500">
                        {group.conditions.length} condition(s)
                      </div>
                    </div>
                    {filterGroups.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 p-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGroup(group.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Conditions */}
          <div className="flex-1 pl-4">
            {activeGroupData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{activeGroupData.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={activeGroupData.operator} 
                      onValueChange={(value) => 
                        setFilterGroups(prev => prev.map(g => 
                          g.id === activeGroup ? { ...g, operator: value as 'AND' | 'OR' } : g
                        ))
                      }
                    >
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => addCondition(activeGroup)}>
                      <Plus size={16} className="mr-2" />
                      Add Condition
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activeGroupData.conditions.map((condition, index) => (
                    <Card key={condition.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-12 gap-2 items-start">
                          {index > 0 && (
                            <div className="col-span-12 text-center">
                              <Badge variant="outline" className="text-xs">
                                {activeGroupData.operator}
                              </Badge>
                            </div>
                          )}
                          
                          <div className="col-span-3">
                            <Label className="text-xs">Field</Label>
                            <Select 
                              value={condition.field} 
                              onValueChange={(value) => {
                                const field = fields.find(f => f.name === value);
                                updateCondition(activeGroup, condition.id, { 
                                  field: value, 
                                  type: field?.type as any,
                                  value: ''
                                });
                              }}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fields.map((field) => (
                                  <SelectItem key={field.name} value={field.name}>
                                    {field.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-3">
                            <Label className="text-xs">Operator</Label>
                            <Select 
                              value={condition.operator} 
                              onValueChange={(value) => updateCondition(activeGroup, condition.id, { operator: value as any })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {OPERATORS[condition.type]?.map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-5">
                            <Label className="text-xs">Value</Label>
                            {renderConditionValue(condition, activeGroup)}
                          </div>

                          <div className="col-span-1 flex justify-end pt-5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto text-red-500 hover:text-red-700"
                              onClick={() => removeCondition(activeGroup, condition.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {activeGroupData.conditions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Filter size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No conditions added yet</p>
                      <Button variant="outline" onClick={() => addCondition(activeGroup)} className="mt-2">
                        <Plus size={16} className="mr-2" />
                        Add First Condition
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={applyFilters}>
            <Check size={16} className="mr-2" />
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};