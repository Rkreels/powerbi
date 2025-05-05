
import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, BookOpen, Play, Download, ArrowRight, BookText } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('datasets');
  
  const handleImportDemo = (demoName: string) => {
    toast({
      title: "Demo dataset imported",
      description: `The ${demoName} dataset has been imported to your workspace.`,
      duration: 2000,
    });
    
    setTimeout(() => {
      navigate('/report');
    }, 1000);
  };
  
  const handleStartTutorial = (tutorialName: string) => {
    toast({
      title: "Tutorial started",
      description: `Starting the ${tutorialName} tutorial.`,
      duration: 2000,
    });
  };
  
  return (
    <MainLayout>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 border-b bg-white">
          <h1 className="text-2xl font-semibold mb-1">Demo Center</h1>
          <p className="text-sm text-gray-500">Explore sample datasets and tutorials to learn Power BI</p>
          
          <Tabs defaultValue="datasets" className="mt-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="datasets">Sample Datasets</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="templates">Report Templates</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-6">
          <TabsContent value="datasets" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DemoDatasetCard 
                title="Retail Sales Analysis"
                description="A comprehensive dataset with retail sales data, product categories, customer segments, and regional information."
                fields={['Sales', 'Products', 'Customers', 'Regions']}
                rows="15,000+"
                image="/placeholder.svg"
                onImport={() => handleImportDemo("Retail Sales Analysis")}
              />
              
              <DemoDatasetCard 
                title="Financial Performance"
                description="Financial data including revenue, expenses, profit margins, and forecasts across multiple departments and time periods."
                fields={['Revenue', 'Expenses', 'Profit', 'Departments']}
                rows="5,000+"
                image="/placeholder.svg"
                onImport={() => handleImportDemo("Financial Performance")}
              />
              
              <DemoDatasetCard 
                title="Marketing Campaign Results"
                description="Detailed marketing campaign data with metrics on reach, engagement, conversions, and ROI across different channels."
                fields={['Campaigns', 'Channels', 'Metrics', 'Audiences']}
                rows="8,000+"
                image="/placeholder.svg"
                onImport={() => handleImportDemo("Marketing Campaign Results")}
              />
              
              <DemoDatasetCard 
                title="HR Analytics"
                description="Employee data including demographics, performance metrics, satisfaction scores, and retention statistics."
                fields={['Employees', 'Performance', 'Satisfaction', 'Retention']}
                rows="3,000+"
                image="/placeholder.svg"
                onImport={() => handleImportDemo("HR Analytics")}
              />
              
              <DemoDatasetCard 
                title="Supply Chain Management"
                description="Supply chain data covering inventory, logistics, suppliers, and delivery performance metrics."
                fields={['Inventory', 'Logistics', 'Suppliers', 'Performance']}
                rows="12,000+"
                image="/placeholder.svg"
                onImport={() => handleImportDemo("Supply Chain Management")}
              />
              
              <DemoDatasetCard 
                title="Customer Behavior Analysis"
                description="Detailed customer behavior data including purchases, website interactions, support tickets, and feedback."
                fields={['Purchases', 'Interactions', 'Support', 'Feedback']}
                rows="20,000+"
                image="/placeholder.svg"
                onImport={() => handleImportDemo("Customer Behavior Analysis")}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tutorials" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TutorialCard 
                title="Getting Started with Power BI"
                description="Learn the basics of Power BI, including navigation, importing data, and creating your first visualization."
                duration="15 mins"
                level="Beginner"
                onStart={() => handleStartTutorial("Getting Started with Power BI")}
              />
              
              <TutorialCard 
                title="Advanced Data Modeling"
                description="Dive into relationships, calculated columns, and measures to build a robust data model."
                duration="25 mins"
                level="Intermediate"
                onStart={() => handleStartTutorial("Advanced Data Modeling")}
              />
              
              <TutorialCard 
                title="Creating Interactive Dashboards"
                description="Learn how to build interactive dashboards with slicers, filters, and drill-through functionality."
                duration="20 mins"
                level="Intermediate"
                onStart={() => handleStartTutorial("Creating Interactive Dashboards")}
              />
              
              <TutorialCard 
                title="DAX Formulas Masterclass"
                description="Master Data Analysis Expressions (DAX) for complex calculations and business logic."
                duration="30 mins"
                level="Advanced"
                onStart={() => handleStartTutorial("DAX Formulas Masterclass")}
              />
              
              <TutorialCard 
                title="Data Visualization Best Practices"
                description="Learn design principles and best practices for creating effective and insightful visualizations."
                duration="15 mins"
                level="All Levels"
                onStart={() => handleStartTutorial("Data Visualization Best Practices")}
              />
              
              <TutorialCard 
                title="Power BI for Data Analysis"
                description="Apply analytical techniques to uncover insights and tell compelling data stories."
                duration="25 mins"
                level="Intermediate"
                onStart={() => handleStartTutorial("Power BI for Data Analysis")}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TemplateCard 
                title="Sales Performance Dashboard"
                description="Comprehensive sales analytics with KPIs, trends, and performance metrics."
                category="Sales"
                visualizations={8}
                onUse={() => {
                  toast({
                    title: "Template applied",
                    description: "The Sales Performance Dashboard template has been applied. Redirecting to editor...",
                    duration: 2000,
                  });
                  setTimeout(() => navigate('/report'), 1000);
                }}
              />
              
              <TemplateCard 
                title="Financial Analysis Report"
                description="Financial reporting with profit & loss, balance sheets, and cash flow analysis."
                category="Finance"
                visualizations={10}
                onUse={() => {
                  toast({
                    title: "Template applied",
                    description: "The Financial Analysis Report template has been applied. Redirecting to editor...",
                    duration: 2000,
                  });
                  setTimeout(() => navigate('/report'), 1000);
                }}
              />
              
              <TemplateCard 
                title="Marketing Campaign Tracker"
                description="Track and analyze marketing campaigns across multiple channels."
                category="Marketing"
                visualizations={6}
                onUse={() => {
                  toast({
                    title: "Template applied",
                    description: "The Marketing Campaign Tracker template has been applied. Redirecting to editor...",
                    duration: 2000,
                  });
                  setTimeout(() => navigate('/report'), 1000);
                }}
              />
              
              <TemplateCard 
                title="HR Analytics Dashboard"
                description="Monitor employee metrics, satisfaction, turnover, and performance indicators."
                category="Human Resources"
                visualizations={7}
                onUse={() => {
                  toast({
                    title: "Template applied",
                    description: "The HR Analytics Dashboard template has been applied. Redirecting to editor...",
                    duration: 2000,
                  });
                  setTimeout(() => navigate('/report'), 1000);
                }}
              />
              
              <TemplateCard 
                title="Customer Insights Report"
                description="Analyze customer behavior, segments, acquisition, and retention metrics."
                category="Customer Analytics"
                visualizations={9}
                onUse={() => {
                  toast({
                    title: "Template applied",
                    description: "The Customer Insights Report template has been applied. Redirecting to editor...",
                    duration: 2000,
                  });
                  setTimeout(() => navigate('/report'), 1000);
                }}
              />
              
              <TemplateCard 
                title="Executive Dashboard"
                description="High-level overview of key business metrics for executive decision-making."
                category="Executive"
                visualizations={5}
                onUse={() => {
                  toast({
                    title: "Template applied",
                    description: "The Executive Dashboard template has been applied. Redirecting to editor...",
                    duration: 2000,
                  });
                  setTimeout(() => navigate('/report'), 1000);
                }}
              />
            </div>
          </TabsContent>
        </div>
      </div>
    </MainLayout>
  );
};

interface DemoDatasetCardProps {
  title: string;
  description: string;
  fields: string[];
  rows: string;
  image: string;
  onImport: () => void;
}

const DemoDatasetCard = ({ title, description, fields, rows, image, onImport }: DemoDatasetCardProps) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="h-40 bg-gradient-to-r from-powerbi-primary to-powerbi-secondary flex items-center justify-center">
        <FileSpreadsheet size={48} className="text-white" />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Tables:</span>
            <span className="font-medium">{fields.length}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Fields:</span>
            <span className="font-medium">{fields.join(', ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Rows:</span>
            <span className="font-medium">{rows}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 text-sm"
            onClick={() => {
              toast({
                title: "Preview not available",
                description: "This feature is not implemented in the demo.",
                duration: 2000,
              });
            }}
          >
            Preview
          </Button>
          <Button 
            className="flex-1 text-sm"
            onClick={onImport}
          >
            Import
          </Button>
        </div>
      </div>
    </div>
  );
};

interface TutorialCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  onStart: () => void;
}

const TutorialCard = ({ title, description, duration, level, onStart }: TutorialCardProps) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <BookOpen size={20} className="text-powerbi-primary mr-2" />
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Duration:</span>
            <span className="font-medium">{duration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Level:</span>
            <span className="font-medium">{level}</span>
          </div>
        </div>
        
        <Button 
          className="w-full text-sm"
          onClick={onStart}
        >
          <Play size={16} className="mr-2" />
          Start Tutorial
        </Button>
      </div>
    </div>
  );
};

interface TemplateCardProps {
  title: string;
  description: string;
  category: string;
  visualizations: number;
  onUse: () => void;
}

const TemplateCard = ({ title, description, category, visualizations, onUse }: TemplateCardProps) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 p-4 flex items-center justify-center relative">
        <div className="grid grid-cols-2 gap-2 w-full max-w-[200px]">
          <div className="h-12 bg-blue-500 rounded"></div>
          <div className="h-12 bg-green-500 rounded"></div>
          <div className="h-12 bg-purple-500 rounded"></div>
          <div className="h-12 bg-orange-500 rounded"></div>
        </div>
        <div className="absolute top-2 right-2 bg-white text-xs px-2 py-0.5 rounded-full shadow-sm">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Visualizations:</span>
            <span className="font-medium">{visualizations}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Compatible with:</span>
            <span className="font-medium">All sample datasets</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 text-sm"
            onClick={() => {
              toast({
                title: "Preview not available",
                description: "This feature is not implemented in the demo.",
                duration: 2000,
              });
            }}
          >
            <BookText size={16} className="mr-2" />
            Details
          </Button>
          <Button 
            className="flex-1 text-sm"
            onClick={onUse}
          >
            <ArrowRight size={16} className="mr-2" />
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
