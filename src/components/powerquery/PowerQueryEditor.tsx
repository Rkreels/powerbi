import React, { useState, useRef } from 'react';
import { 
  Database, FileText, Download, Upload, Play, Save, RefreshCw, 
  Filter, Settings, Code, Eye, ArrowRight, Plus, Trash2, 
  Edit3, Copy, RotateCcw, Search, Table, Columns, Split
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'web' | 'api';
  status: 'connected' | 'disconnected' | 'error';
  lastRefresh: string;
  columns: Column[];
  sampleData: any[];
}

interface Column {
  id: string;
  name: string;
  dataType: 'Text' | 'Number' | 'Date' | 'Boolean' | 'DateTime';
  nullable: boolean;
  description?: string;
}

interface TransformStep {
  id: string;
  type: string;
  description: string;
  formula?: string;
  parameters?: any;
}

const PowerQueryEditor: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'ds1',
      name: 'Sales_Data.xlsx',
      type: 'file',
      status: 'connected',
      lastRefresh: '2024-01-15 10:30 AM',
      columns: [
        { id: 'c1', name: 'OrderID', dataType: 'Number', nullable: false },
        { id: 'c2', name: 'CustomerName', dataType: 'Text', nullable: false },
        { id: 'c3', name: 'OrderDate', dataType: 'Date', nullable: false },
        { id: 'c4', name: 'Amount', dataType: 'Number', nullable: false },
        { id: 'c5', name: 'Region', dataType: 'Text', nullable: true }
      ],
      sampleData: [
        { OrderID: 1001, CustomerName: 'Acme Corp', OrderDate: '2024-01-15', Amount: 2500, Region: 'North' },
        { OrderID: 1002, CustomerName: 'TechFlow Inc', OrderDate: '2024-01-14', Amount: 1800, Region: 'South' },
        { OrderID: 1003, CustomerName: 'Global Systems', OrderDate: '2024-01-13', Amount: 3200, Region: 'East' }
      ]
    },
    {
      id: 'ds2',
      name: 'Customer_Database',
      type: 'database',
      status: 'connected',
      lastRefresh: '2024-01-15 09:45 AM',
      columns: [
        { id: 'c6', name: 'CustomerID', dataType: 'Number', nullable: false },
        { id: 'c7', name: 'CompanyName', dataType: 'Text', nullable: false },
        { id: 'c8', name: 'ContactEmail', dataType: 'Text', nullable: true },
        { id: 'c9', name: 'City', dataType: 'Text', nullable: true },
        { id: 'c10', name: 'Country', dataType: 'Text', nullable: false }
      ],
      sampleData: [
        { CustomerID: 101, CompanyName: 'Acme Corp', ContactEmail: 'contact@acme.com', City: 'New York', Country: 'USA' },
        { CustomerID: 102, CompanyName: 'TechFlow Inc', ContactEmail: 'info@techflow.com', City: 'London', Country: 'UK' },
        { CustomerID: 103, CompanyName: 'Global Systems', ContactEmail: 'hello@global.com', City: 'Toronto', Country: 'Canada' }
      ]
    }
  ]);

  const [selectedDataSource, setSelectedDataSource] = useState<string>(dataSources[0]?.id);
  const [transformSteps, setTransformSteps] = useState<TransformStep[]>([
    {
      id: 's1',
      type: 'Remove Duplicates',
      description: 'Removed 3 duplicate rows based on OrderID column'
    },
    {
      id: 's2',
      type: 'Filter Rows',
      description: 'Keep rows where Amount > 1000',
      formula: 'Table.SelectRows(#"Previous Step", each [Amount] > 1000)'
    },
    {
      id: 's3',
      type: 'Add Column',
      description: 'Added "Quarter" column based on OrderDate',
      formula: 'Table.AddColumn(#"Previous Step", "Quarter", each Date.QuarterOfYear([OrderDate]))'
    }
  ]);

  const [activeTab, setActiveTab] = useState('data');
  const [formulaText, setFormulaText] = useState('= Table.SelectRows(Source, each [Amount] > 1000)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDataSource = dataSources.find(ds => ds.id === selectedDataSource);

  const transformOperations = [
    { id: 'remove-duplicates', name: 'Remove Duplicates', icon: <Copy size={16} /> },
    { id: 'filter-rows', name: 'Filter Rows', icon: <Filter size={16} /> },
    { id: 'sort', name: 'Sort', icon: <ArrowRight size={16} /> },
    { id: 'add-column', name: 'Add Column', icon: <Plus size={16} /> },
    { id: 'split-column', name: 'Split Column', icon: <Split size={16} /> },
    { id: 'merge-columns', name: 'Merge Columns', icon: <Columns size={16} /> },
    { id: 'change-type', name: 'Change Data Type', icon: <Settings size={16} /> },
    { id: 'replace-values', name: 'Replace Values', icon: <Edit3 size={16} /> }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file processing
      const newDataSource: DataSource = {
        id: `ds${Date.now()}`,
        name: file.name,
        type: 'file',
        status: 'connected',
        lastRefresh: new Date().toLocaleString(),
        columns: [
          { id: `c${Date.now()}1`, name: 'Column1', dataType: 'Text', nullable: true },
          { id: `c${Date.now()}2`, name: 'Column2', dataType: 'Number', nullable: true }
        ],
        sampleData: [
          { Column1: 'Sample Data 1', Column2: 100 },
          { Column1: 'Sample Data 2', Column2: 200 }
        ]
      };
      
      setDataSources(prev => [...prev, newDataSource]);
      setSelectedDataSource(newDataSource.id);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been successfully loaded`,
      });
    }
  };

  const handleApplyTransform = (transformType: string) => {
    const newStep: TransformStep = {
      id: `s${Date.now()}`,
      type: transformType,
      description: `Applied ${transformType} transformation`
    };
    
    setTransformSteps(prev => [...prev, newStep]);
    
    toast({
      title: "Transform Applied",
      description: `${transformType} has been added to the query`,
    });
  };

  const handleRemoveStep = (stepId: string) => {
    setTransformSteps(prev => prev.filter(s => s.id !== stepId));
    toast({
      title: "Step Removed",
      description: "Transform step has been removed",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Refreshing Data",
      description: "Data source is being refreshed...",
    });
    
    setTimeout(() => {
      setDataSources(prev => prev.map(ds => 
        ds.id === selectedDataSource 
          ? { ...ds, lastRefresh: new Date().toLocaleString(), status: 'connected' as const }
          : ds
      ));
      
      toast({
        title: "Data Refreshed",
        description: "All data sources have been updated",
      });
    }, 2000);
  };

  const handleSaveQuery = () => {
    toast({
      title: "Query Saved",
      description: "Your Power Query has been saved successfully",
    });
  };

  const handleApplyAndClose = () => {
    toast({
      title: "Changes Applied",
      description: "Query changes have been applied to the data model",
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-white">
        <div className="flex items-center space-x-3">
          <Database size={20} className="text-blue-600" />
          <h1 className="text-lg font-semibold">Power Query Editor</h1>
          <Badge variant="outline" className="text-xs">
            {dataSources.length} Data Source{dataSources.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.csv,.json,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} className="mr-1" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveQuery}>
            <Save size={16} className="mr-1" />
            Save
          </Button>
          <Button size="sm" onClick={handleApplyAndClose}>
            Apply & Close
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Data Sources & Steps */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          {/* Data Sources */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Data Sources</h3>
              <Button variant="ghost" size="sm">
                <Plus size={14} />
              </Button>
            </div>
            <div className="space-y-2">
              {dataSources.map(ds => (
                <div
                  key={ds.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDataSource === ds.id 
                      ? 'bg-blue-100 border border-blue-200' 
                      : 'bg-white border hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDataSource(ds.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {ds.type === 'file' ? <FileText size={16} /> : <Database size={16} />}
                      <span className="font-medium text-sm">{ds.name}</span>
                    </div>
                    <Badge 
                      variant={ds.status === 'connected' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {ds.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Last refresh: {ds.lastRefresh}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applied Steps */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Applied Steps</h3>
              <Badge variant="outline" className="text-xs">
                {transformSteps.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {transformSteps.map((step, index) => (
                <div key={step.id} className="p-2 bg-white border rounded group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{step.type}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 p-1"
                      onClick={() => handleRemoveStep(step.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transform Operations */}
          <div className="p-4 border-t">
            <h3 className="font-semibold text-sm mb-3">Transform Operations</h3>
            <div className="grid grid-cols-2 gap-2">
              {transformOperations.map(op => (
                <Button
                  key={op.id}
                  variant="outline"
                  size="sm"
                  className="h-auto p-2 text-xs"
                  onClick={() => handleApplyTransform(op.name)}
                >
                  <div className="flex flex-col items-center space-y-1">
                    {op.icon}
                    <span className="text-center leading-tight">{op.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start h-10 bg-gray-50 rounded-none border-b">
              <TabsTrigger value="data">Data Preview</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="formula">Formula Bar</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Editor</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="flex-1 p-6">
              {currentDataSource && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{currentDataSource.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {currentDataSource.sampleData.length} rows
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {currentDataSource.columns.length} columns
                      </Badge>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              {currentDataSource.columns.map(col => (
                                <th key={col.id} className="text-left p-3 font-medium">
                                  <div className="flex items-center space-x-2">
                                    <span>{col.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {col.dataType}
                                    </Badge>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentDataSource.sampleData.map((row, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50">
                                {currentDataSource.columns.map(col => (
                                  <td key={col.id} className="p-3">
                                    {row[col.name]}
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
              )}
            </TabsContent>

            <TabsContent value="schema" className="flex-1 p-6">
              {currentDataSource && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schema Information</h3>
                  <div className="grid gap-4">
                    {currentDataSource.columns.map(col => (
                      <Card key={col.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="font-medium">{col.name}</div>
                              <div className="text-sm text-gray-600">
                                Type: {col.dataType} • {col.nullable ? 'Nullable' : 'Required'}
                              </div>
                              {col.description && (
                                <div className="text-sm text-gray-500">{col.description}</div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Select defaultValue={col.dataType}>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Text">Text</SelectItem>
                                  <SelectItem value="Number">Number</SelectItem>
                                  <SelectItem value="Date">Date</SelectItem>
                                  <SelectItem value="Boolean">Boolean</SelectItem>
                                  <SelectItem value="DateTime">DateTime</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="sm">
                                <Edit3 size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="formula" className="flex-1 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Formula Bar</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye size={16} className="mr-1" />
                      Validate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play size={16} className="mr-1" />
                      Execute
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">M Formula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formulaText}
                      onChange={(e) => setFormulaText(e.target.value)}
                      className="min-h-32 font-mono text-sm"
                      placeholder="Enter M formula here..."
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Formula Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Common Functions</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li><code>Table.SelectRows</code> - Filter rows</li>
                          <li><code>Table.AddColumn</code> - Add new column</li>
                          <li><code>Table.RemoveColumns</code> - Remove columns</li>
                          <li><code>Table.RenameColumns</code> - Rename columns</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Date Functions</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li><code>Date.Year</code> - Extract year</li>
                          <li><code>Date.Month</code> - Extract month</li>
                          <li><code>Date.QuarterOfYear</code> - Get quarter</li>
                          <li><code>Date.DayOfWeek</code> - Get day of week</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="flex-1 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Advanced Editor</h3>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Complete M Query</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Code size={16} className="mr-1" />
                          Format
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw size={16} className="mr-1" />
                          Undo
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      className="min-h-64 font-mono text-sm"
                      defaultValue={`let
    Source = Excel.Workbook(File.Contents("C:\\Data\\Sales_Data.xlsx"), null, true),
    Sheet1_Sheet = Source{[Item="Sheet1",Kind="Sheet"]}[Data],
    #"Promoted Headers" = Table.PromoteHeaders(Sheet1_Sheet, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"OrderID", Int64.Type},
        {"CustomerName", type text},
        {"OrderDate", type date},
        {"Amount", type number},
        {"Region", type text}
    }),
    #"Removed Duplicates" = Table.Distinct(#"Changed Type", {"OrderID"}),
    #"Filtered Rows" = Table.SelectRows(#"Removed Duplicates", each [Amount] > 1000),
    #"Added Quarter" = Table.AddColumn(#"Filtered Rows", "Quarter", each Date.QuarterOfYear([OrderDate]), Int64.Type)
in
    #"Added Quarter"`}
                    />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Query Dependencies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <FileText size={16} className="text-blue-500" />
                          <span>Sales_Data.xlsx</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Database size={16} className="text-green-500" />
                          <span>Customer_Database</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Query Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Execution time:</span>
                          <span className="font-medium">1.2s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Rows processed:</span>
                          <span className="font-medium">15,234</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Memory usage:</span>
                          <span className="font-medium">45 MB</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PowerQueryEditor;