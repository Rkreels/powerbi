import React, { useState } from 'react';
import { Plus, FileText, Upload, Database, Globe, Zap, BarChart, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { dataService } from '@/services/dataService';

const EnhancedNewReportButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const reportOptions = [
    {
      id: 'blank',
      title: 'Blank Report',
      description: 'Start with a blank canvas and build your report from scratch',
      icon: <FileText size={24} className="text-blue-600" />,
      action: () => createBlankReport(),
      recommended: false,
      time: '5 min'
    },
    {
      id: 'upload',
      title: 'Upload Excel File',
      description: 'Import data from Excel, CSV, or other files',
      icon: <Upload size={24} className="text-green-600" />,
      action: () => handleFileUpload(),
      recommended: true,
      time: '2 min'
    },
    {
      id: 'connect',
      title: 'Connect to Data Source',
      description: 'Connect to SQL Server, Azure, SharePoint, and more',
      icon: <Database size={24} className="text-purple-600" />,
      action: () => connectToDataSource(),
      recommended: false,
      time: '10 min'
    },
    {
      id: 'web',
      title: 'Get Data from Web',
      description: 'Import data from web pages and online services',
      icon: <Globe size={24} className="text-orange-600" />,
      action: () => getDataFromWeb(),
      recommended: false,
      time: '7 min'
    },
    {
      id: 'template',
      title: 'Use Template',
      description: 'Start with pre-built templates for common scenarios',
      icon: <BarChart size={24} className="text-indigo-600" />,
      action: () => useTemplate(),
      recommended: true,
      time: '3 min'
    },
    {
      id: 'recent',
      title: 'From Recent Dataset',
      description: 'Build report using your recently used datasets',
      icon: <Clock size={24} className="text-teal-600" />,
      action: () => fromRecentDataset(),
      recommended: false,
      time: '2 min'
    }
  ];

  const createBlankReport = () => {
    const newReport = dataService.createReport({
      name: `Report ${Date.now()}`,
      description: 'New blank report',
      owner: 'Current User',
      workspace: 'My Workspace',
      isPublished: false,
      visualizations: []
    });

    toast({
      title: "Blank report created",
      description: `Created "${newReport.name}" successfully`,
    });

    setOpen(false);
    navigate('/report');
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv,.json,.pbix';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      
      if (files.length === 0) return;

      // Simulate file processing
      files.forEach((file, index) => {
        setTimeout(() => {
          const dataset = dataService.createDataset({
            name: file.name.replace(/\.[^/.]+$/, ""),
            description: `Imported from ${file.name}`,
            source: 'File Upload',
            owner: 'Current User',
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            status: 'active'
          });

          if (index === files.length - 1) {
            // Create report with the last uploaded dataset
            const newReport = dataService.createReport({
              name: `${dataset.name} Report`,
              description: `Report based on ${file.name}`,
              owner: 'Current User',
              workspace: 'My Workspace',
              isPublished: false,
              visualizations: []
            });

            toast({
              title: "Files uploaded and report created",
              description: `Created report from ${files.length} file(s)`,
            });

            setOpen(false);
            navigate('/report');
          }
        }, (index + 1) * 1000);
      });

      toast({
        title: "Processing files...",
        description: `Uploading ${files.length} file(s)`,
      });
    };

    input.click();
  };

  const connectToDataSource = () => {
    toast({
      title: "Data Source Connection",
      description: "Opening data source connection wizard...",
    });

    // Simulate connecting to a data source
    setTimeout(() => {
      const dataset = dataService.createDataset({
        name: 'SQL Server Dataset',
        description: 'Connected to SQL Server database',
        source: 'SQL Server',
        owner: 'Current User',
        size: '2.5 GB',
        status: 'active'
      });

      const newReport = dataService.createReport({
        name: 'SQL Server Report',
        description: 'Report connected to SQL Server data',
        owner: 'Current User',
        workspace: 'My Workspace',
        isPublished: false,
        visualizations: []
      });

      toast({
        title: "Connected to data source",
        description: "Report created with SQL Server connection",
      });

      setOpen(false);
      navigate('/report');
    }, 2000);
  };

  const getDataFromWeb = () => {
    const url = prompt('Enter the URL to get data from:');
    
    if (!url) return;

    toast({
      title: "Connecting to web source",
      description: `Getting data from ${url}...`,
    });

    // Simulate web data import
    setTimeout(() => {
      const dataset = dataService.createDataset({
        name: 'Web Data',
        description: `Data imported from ${url}`,
        source: 'Web',
        owner: 'Current User',
        size: '1.2 MB',
        status: 'active'
      });

      const newReport = dataService.createReport({
        name: 'Web Data Report',
        description: `Report with data from ${url}`,
        owner: 'Current User',
        workspace: 'My Workspace',
        isPublished: false,
        visualizations: []
      });

      toast({
        title: "Web data imported",
        description: "Report created with web data",
      });

      setOpen(false);
      navigate('/report');
    }, 3000);
  };

  const useTemplate = () => {
    const templates = [
      'Sales Dashboard',
      'Financial Report',
      'Marketing Analytics',
      'HR Metrics',
      'Operations Dashboard'
    ];

    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

    const newReport = dataService.createReport({
      name: `${selectedTemplate} - ${new Date().toLocaleDateString()}`,
      description: `Report created from ${selectedTemplate} template`,
      owner: 'Current User',
      workspace: 'My Workspace',
      isPublished: false,
      visualizations: []
    });

    toast({
      title: "Template applied",
      description: `Created report using ${selectedTemplate} template`,
    });

    setOpen(false);
    navigate('/report');
  };

  const fromRecentDataset = () => {
    const datasets = dataService.getDatasets();
    
    if (datasets.length === 0) {
      toast({
        title: "No recent datasets",
        description: "Upload or connect to a dataset first",
        variant: "destructive"
      });
      return;
    }

    const recentDataset = datasets[0]; // Use most recent dataset

    const newReport = dataService.createReport({
      name: `${recentDataset.name} Report`,
      description: `Report using ${recentDataset.name} dataset`,
      owner: 'Current User',
      workspace: 'My Workspace',
      isPublished: false,
      visualizations: []
    });

    toast({
      title: "Report created from recent dataset",
      description: `Using ${recentDataset.name}`,
    });

    setOpen(false);
    navigate('/report');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 text-lg h-auto">
          <Plus size={20} className="mr-2" />
          Create Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl flex items-center">
            <Zap className="mr-3 text-yellow-500" size={28} />
            Create New Report
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Choose how you'd like to start building your report. Each option is designed for different data sources and use cases.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportOptions.map((option) => (
            <Card 
              key={option.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300 relative group"
              onClick={option.action}
            >
              {option.recommended && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  Recommended
                </Badge>
              )}
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  {option.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {option.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      ~{option.time}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {option.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    Get Started
                    <svg 
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Quick Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Start with Excel upload for quick prototyping</li>
                <li>• Use templates for common business scenarios</li>
                <li>• Connect to databases for live data updates</li>
                <li>• Explore sample datasets in the gallery</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedNewReportButton;