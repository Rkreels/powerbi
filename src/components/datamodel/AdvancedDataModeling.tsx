import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Database, Key, Link, Calculator, Plus, Trash2, Edit3, 
  Save, Download, Upload, RefreshCw, Settings, Eye, 
  Table as TableIcon, BarChart3, Filter, Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Table {
  id: string;
  name: string;
  fields: Field[];
  position: { x: number; y: number };
  isFactTable?: boolean;
}

interface Field {
  id: string;
  name: string;
  dataType: 'text' | 'number' | 'date' | 'boolean';
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isCalculated?: boolean;
  formula?: string;
  description?: string;
}

interface Relationship {
  id: string;
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  type: 'one-to-many' | 'many-to-one' | 'one-to-one' | 'many-to-many';
  crossFilterDirection: 'single' | 'both';
  isActive: boolean;
}

interface Measure {
  id: string;
  name: string;
  table: string;
  formula: string;
  description?: string;
  formatString?: string;
}

const AdvancedDataModeling: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([
    {
      id: 't1',
      name: 'Sales',
      isFactTable: true,
      position: { x: 400, y: 200 },
      fields: [
        { id: 'f1', name: 'SalesID', dataType: 'number', isPrimaryKey: true },
        { id: 'f2', name: 'ProductID', dataType: 'number', isForeignKey: true },
        { id: 'f3', name: 'CustomerID', dataType: 'number', isForeignKey: true },
        { id: 'f4', name: 'OrderDate', dataType: 'date' },
        { id: 'f5', name: 'Quantity', dataType: 'number' },
        { id: 'f6', name: 'UnitPrice', dataType: 'number' },
        { id: 'f7', name: 'TotalAmount', dataType: 'number', isCalculated: true, formula: 'Quantity * UnitPrice' }
      ]
    },
    {
      id: 't2',
      name: 'Products',
      position: { x: 100, y: 50 },
      fields: [
        { id: 'f8', name: 'ProductID', dataType: 'number', isPrimaryKey: true },
        { id: 'f9', name: 'ProductName', dataType: 'text' },
        { id: 'f10', name: 'Category', dataType: 'text' },
        { id: 'f11', name: 'Price', dataType: 'number' },
        { id: 'f12', name: 'InStock', dataType: 'boolean' }
      ]
    },
    {
      id: 't3',
      name: 'Customers',
      position: { x: 700, y: 50 },
      fields: [
        { id: 'f13', name: 'CustomerID', dataType: 'number', isPrimaryKey: true },
        { id: 'f14', name: 'CustomerName', dataType: 'text' },
        { id: 'f15', name: 'City', dataType: 'text' },
        { id: 'f16', name: 'Country', dataType: 'text' },
        { id: 'f17', name: 'RegistrationDate', dataType: 'date' }
      ]
    }
  ]);
  
  const [relationships, setRelationships] = useState<Relationship[]>([
    {
      id: 'r1',
      fromTable: 't2',
      fromField: 'f8',
      toTable: 't1',
      toField: 'f2',
      type: 'one-to-many',
      crossFilterDirection: 'single',
      isActive: true
    },
    {
      id: 'r2',
      fromTable: 't3',
      fromField: 'f13',
      toTable: 't1',
      toField: 'f3',
      type: 'one-to-many',
      crossFilterDirection: 'single',
      isActive: true
    }
  ]);

  const [measures, setMeasures] = useState<Measure[]>([
    {
      id: 'm1',
      name: 'Total Sales',
      table: 't1',
      formula: 'SUM(Sales[TotalAmount])',
      description: 'Sum of all sales amounts',
      formatString: 'Currency'
    },
    {
      id: 'm2',
      name: 'Average Order Value',
      table: 't1',
      formula: 'AVERAGE(Sales[TotalAmount])',
      description: 'Average value per order',
      formatString: 'Currency'
    }
  ]);

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('model');
  const canvasRef = useRef<HTMLDivElement>(null);

  const DraggableTable: React.FC<{ table: Table }> = ({ table }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'table',
      item: { id: table.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`absolute bg-white border rounded-lg shadow-sm overflow-hidden cursor-move ${
          selectedTable === table.id ? 'ring-2 ring-blue-500' : ''
        } ${isDragging ? 'opacity-50' : ''}`}
        style={{ 
          left: table.position.x, 
          top: table.position.y,
          minWidth: '200px'
        }}
        onClick={() => setSelectedTable(table.id)}
      >
        <div className={`px-3 py-2 border-b ${table.isFactTable ? 'bg-orange-50' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TableIcon size={16} className={table.isFactTable ? 'text-orange-600' : 'text-blue-600'} />
              <span className="font-medium text-sm">{table.name}</span>
            </div>
            {table.isFactTable && <Badge variant="secondary" className="text-xs">Fact</Badge>}
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {table.fields.map(field => (
            <div key={field.id} className="px-3 py-1.5 border-b border-gray-50 hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                {field.isPrimaryKey && <Key size={12} className="text-yellow-600" />}
                {field.isForeignKey && <Link size={12} className="text-blue-600" />}
                {field.isCalculated && <Calculator size={12} className="text-green-600" />}
                <span className="text-xs font-medium">{field.name}</span>
              </div>
              <div className="text-xs text-gray-500 ml-6">{field.dataType}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'table',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        moveTable(item.id, { x, y });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const moveTable = useCallback((tableId: string, position: { x: number; y: number }) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, position } : table
    ));
  }, []);

  const handleCreateMeasure = () => {
    const newMeasure: Measure = {
      id: `m${Date.now()}`,
      name: 'New Measure',
      table: tables[0]?.id || '',
      formula: 'SUM()',
      description: '',
      formatString: 'General'
    };
    
    setMeasures(prev => [...prev, newMeasure]);
    toast({
      title: "Measure Created",
      description: "New measure added to the model",
    });
  };

  const handleCreateCalculatedColumn = (tableId: string) => {
    const newField: Field = {
      id: `f${Date.now()}`,
      name: 'New Column',
      dataType: 'text',
      isCalculated: true,
      formula: '',
      description: ''
    };

    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, fields: [...table.fields, newField] }
        : table
    ));

    toast({
      title: "Calculated Column Created",
      description: "New calculated column added to the table",
    });
  };

  const handleRefreshModel = () => {
    toast({
      title: "Model Refreshing",
      description: "Data model is being refreshed with latest schema changes",
    });
    
    setTimeout(() => {
      toast({
        title: "Model Refreshed",
        description: "All tables and relationships are up to date",
      });
    }, 2000);
  };

  const handleValidateModel = () => {
    const issues: string[] = [];
    
    // Check for orphaned tables
    const tablesWithRelationships = new Set([
      ...relationships.map(r => r.fromTable),
      ...relationships.map(r => r.toTable)
    ]);
    
    const orphanedTables = tables.filter(t => !tablesWithRelationships.has(t.id) && !t.isFactTable);
    if (orphanedTables.length > 0) {
      issues.push(`${orphanedTables.length} table(s) have no relationships`);
    }

    // Check for circular relationships
    // (Simplified check)
    const hasCircular = relationships.some(r => 
      relationships.some(r2 => 
        r.id !== r2.id && r.fromTable === r2.toTable && r.toTable === r2.fromTable
      )
    );
    
    if (hasCircular) {
      issues.push('Potential circular relationships detected');
    }

    if (issues.length === 0) {
      toast({
        title: "Model Valid",
        description: "No issues found in the data model",
      });
    } else {
      toast({
        title: "Model Issues Found",
        description: issues.join(', '),
        variant: "destructive"
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4 bg-white">
          <div className="flex items-center space-x-3">
            <Database size={20} className="text-blue-600" />
            <h1 className="text-lg font-semibold">Data Model</h1>
            <Badge variant="outline" className="text-xs">
              {tables.length} Tables, {relationships.length} Relations
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleValidateModel}>
              <Eye size={16} className="mr-1" />
              Validate
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefreshModel}>
              <RefreshCw size={16} className="mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-1" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start h-10 bg-gray-50 rounded-none border-b">
            <TabsTrigger value="model" className="flex-1 max-w-xs">Model View</TabsTrigger>
            <TabsTrigger value="data" className="flex-1 max-w-xs">Data View</TabsTrigger>
            <TabsTrigger value="measures" className="flex-1 max-w-xs">Measures</TabsTrigger>
            <TabsTrigger value="relationships" className="flex-1 max-w-xs">Relationships</TabsTrigger>
          </TabsList>

          <TabsContent value="model" className="flex-1 relative overflow-hidden">
            <div className="flex h-full">
              {/* Canvas */}
              <div
                ref={(node) => {
                  canvasRef.current = node;
                  drop(node);
                }}
                className={`flex-1 relative bg-gray-50 overflow-auto ${
                  isOver ? 'bg-blue-50' : ''
                }`}
                style={{ minHeight: '600px' }}
              >
                {tables.map(table => (
                  <DraggableTable key={table.id} table={table} />
                ))}
                
                {/* Relationship Lines */}
                <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                  {relationships.map(rel => {
                    const fromTable = tables.find(t => t.id === rel.fromTable);
                    const toTable = tables.find(t => t.id === rel.toTable);
                    
                    if (!fromTable || !toTable) return null;
                    
                    const x1 = fromTable.position.x + 100;
                    const y1 = fromTable.position.y + 100;
                    const x2 = toTable.position.x + 100;
                    const y2 = toTable.position.y + 100;
                    
                    return (
                      <line
                        key={rel.id}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={rel.isActive ? "#3b82f6" : "#9ca3af"}
                        strokeWidth="2"
                        strokeDasharray={rel.isActive ? "none" : "5,5"}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Properties Panel */}
              {selectedTable && (
                <div className="w-80 bg-white border-l">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Table Properties</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <Label>Table Name</Label>
                      <Input 
                        value={tables.find(t => t.id === selectedTable)?.name || ''}
                        onChange={(e) => {
                          setTables(prev => prev.map(t => 
                            t.id === selectedTable ? { ...t, name: e.target.value } : t
                          ));
                        }}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCreateCalculatedColumn(selectedTable)}
                    >
                      <Plus size={16} className="mr-1" />
                      Add Calculated Column
                    </Button>

                    <div className="space-y-2">
                      <Label>Fields ({tables.find(t => t.id === selectedTable)?.fields.length})</Label>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {tables.find(t => t.id === selectedTable)?.fields.map(field => (
                          <div key={field.id} className="p-2 border rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{field.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {field.dataType}
                              </Badge>
                            </div>
                            {field.isCalculated && (
                              <div className="text-xs text-gray-500 mt-1">
                                Formula: {field.formula}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="measures" className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Measures</h3>
                <Button onClick={handleCreateMeasure}>
                  <Plus size={16} className="mr-1" />
                  New Measure
                </Button>
              </div>
              
              <div className="grid gap-4">
                {measures.map(measure => (
                  <Card key={measure.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{measure.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit3 size={14} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                          {measure.formula}
                        </div>
                        {measure.description && (
                          <p className="text-sm text-gray-600">{measure.description}</p>
                        )}
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>Table: {tables.find(t => t.id === measure.table)?.name}</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>Format: {measure.formatString}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="relationships" className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Relationships</h3>
                <Button>
                  <Plus size={16} className="mr-1" />
                  New Relationship
                </Button>
              </div>
              
              <div className="space-y-3">
                {relationships.map(rel => {
                  const fromTable = tables.find(t => t.id === rel.fromTable);
                  const toTable = tables.find(t => t.id === rel.toTable);
                  const fromField = fromTable?.fields.find(f => f.id === rel.fromField);
                  const toField = toTable?.fields.find(f => f.id === rel.toField);
                  
                  return (
                    <Card key={rel.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm">
                              <div className="font-medium">
                                {fromTable?.name}.{fromField?.name} → {toTable?.name}.{toField?.name}
                              </div>
                              <div className="text-gray-500">
                                {rel.type} • {rel.crossFilterDirection} direction
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={rel.isActive ? "default" : "secondary"}>
                              {rel.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Settings size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="flex-1 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Data Preview</h3>
                <div className="flex items-center space-x-2">
                  <Select defaultValue={tables[0]?.id}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      {tables.map(table => (
                        <SelectItem key={table.id} value={table.id}>
                          {table.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <RefreshCw size={16} className="mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          {tables[0]?.fields.map(field => (
                            <th key={field.id} className="text-left p-3 font-medium">
                              {field.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(10)].map((_, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            {tables[0]?.fields.map(field => (
                              <td key={field.id} className="p-3">
                                {field.dataType === 'number' ? Math.floor(Math.random() * 1000) :
                                 field.dataType === 'date' ? '2024-01-01' :
                                 field.dataType === 'boolean' ? 'true' :
                                 `Sample ${field.name} ${i + 1}`}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  );
};

export default AdvancedDataModeling;