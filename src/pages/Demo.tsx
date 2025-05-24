import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PowerBILayout from '../layouts/PowerBILayout';
import { Search, Play, FileText, Database, ChevronRight, Download, Star, Clock, Bookmark, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Demo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  
  const tutorials = [
    {
      id: 'demo-1',
      title: 'Getting Started with Power BI',
      description: 'Learn the basics of Power BI interface and how to create your first report',
      category: 'beginner',
      duration: '15 mins',
      image: 'https://via.placeholder.com/300x180',
      popularity: 'Most popular',
      topics: ['Interface', 'Navigation', 'Reports']
    },
    {
      id: 'demo-2',
      title: 'Advanced Visualization Techniques',
      description: 'Master complex visualizations and interactive dashboards',
      category: 'advanced',
      duration: '25 mins',
      image: 'https://via.placeholder.com/300x180',
      popularity: 'Recommended',
      topics: ['Custom Visuals', 'Slicers', 'Drill-through']
    },
    {
      id: 'demo-3',
      title: 'Data Modeling Fundamentals',
      description: 'Create relationships and optimize data models for better performance',
      category: 'intermediate',
      duration: '20 mins',
      image: 'https://via.placeholder.com/300x180',
      popularity: 'Popular',
      topics: ['Relationships', 'Star Schema', 'Performance']
    },
    {
      id: 'demo-4',
      title: 'DAX Formula Basics',
      description: 'Learn essential DAX functions and create calculated columns and measures',
      category: 'intermediate',
      duration: '30 mins',
      image: 'https://via.placeholder.com/300x180',
      popularity: 'Essential',
      topics: ['DAX', 'Measures', 'Calculations']
    },
    {
      id: 'demo-5',
      title: 'Real-time Analytics',
      description: 'Configure real-time data sources and streaming datasets',
      category: 'advanced',
      duration: '22 mins',
      image: 'https://via.placeholder.com/300x180',
      popularity: 'Trending',
      topics: ['Streaming', 'Real-time', 'Dashboards']
    }
  ];
  
  const sampleDatasets = [
    {
      id: 'ds-1',
      name: 'Sales Analysis Sample',
      description: 'Comprehensive sales data with products, regions, and time periods',
      size: '2.4 MB',
      tables: 5,
      rows: '10,000+',
      category: 'business'
    },
    {
      id: 'ds-2',
      name: 'Financial Performance',
      description: 'Financial metrics, profit & loss statements, and projections',
      size: '3.8 MB',
      tables: 8,
      rows: '15,000+',
      category: 'business'
    },
    {
      id: 'ds-3',
      name: 'Marketing Campaign Analytics',
      description: 'Campaign performance data across channels with conversion metrics',
      size: '1.9 MB',
      tables: 4,
      rows: '8,500+',
      category: 'marketing'
    },
    {
      id: 'ds-4',
      name: 'HR Analytics Sample',
      description: 'Employee data, performance metrics, and retention analytics',
      size: '1.2 MB',
      tables: 3,
      rows: '5,000+',
      category: 'hr'
    },
    {
      id: 'ds-5',
      name: 'Global COVID-19 Dataset',
      description: 'Comprehensive COVID-19 case data by country and region',
      size: '4.6 MB',
      tables: 6,
      rows: '20,000+',
      category: 'healthcare'
    }
  ];
  
  const filteredTutorials = tutorials.filter(tutorial => 
    (activeCategory === 'all' || tutorial.category === activeCategory) &&
    (tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  const filteredDatasets = sampleDatasets.filter(dataset => 
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleOpenTutorial = (tutorial: any) => {
    setSelectedTutorial(tutorial);
    setIsDialogOpen(true);
  };
  
  const handleImportDataset = (dataset: any) => {
    toast({
      title: "Dataset imported",
      description: `${dataset.name} has been imported successfully.`,
      duration: 3000,
    });
    navigate('/datasets');
  };

  return (
    <PowerBILayout>
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-3">Demo & Learning</h1>
          <p className="text-gray-600">
            Explore sample datasets and tutorials to learn and practice Power BI functionality
          </p>
        </div>
        
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-64">
            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tutorials & datasets" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-powerbi-primary"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter size={14} className="mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Star size={14} className="mr-1" />
              Favorites
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="tutorials" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="tutorials">Tutorials & Guides</TabsTrigger>
            <TabsTrigger value="datasets">Sample Datasets</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tutorials">
            <div className="mb-4 flex items-center space-x-2">
              <Button 
                variant={activeCategory === 'all' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveCategory('all')}
              >
                All
              </Button>
              <Button 
                variant={activeCategory === 'beginner' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveCategory('beginner')}
              >
                Beginner
              </Button>
              <Button 
                variant={activeCategory === 'intermediate' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveCategory('intermediate')}
              >
                Intermediate
              </Button>
              <Button 
                variant={activeCategory === 'advanced' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveCategory('advanced')}
              >
                Advanced
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTutorials.map(tutorial => (
                <div 
                  key={tutorial.id}
                  className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenTutorial(tutorial)}
                >
                  <div className="h-40 bg-gradient-to-r from-powerbi-primary to-powerbi-secondary relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center">
                        <Play size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-powerbi-primary/90 text-white px-2 py-0.5 rounded text-xs font-medium">
                      {tutorial.duration}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="text-white text-xs font-medium">{tutorial.popularity}</div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{tutorial.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tutorial.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {tutorial.topics.map((topic: string, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="datasets">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDatasets.map(dataset => (
                <div 
                  key={dataset.id}
                  className="bg-white rounded-lg border shadow-sm overflow-hidden"
                >
                  <div className="p-4 flex items-start">
                    <div className="bg-blue-100 p-2 rounded mr-4">
                      <Database size={24} className="text-powerbi-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{dataset.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{dataset.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Database size={12} className="mr-1" />
                          {dataset.tables} Tables
                        </div>
                        <div className="flex items-center">
                          <FileText size={12} className="mr-1" />
                          {dataset.rows} Rows
                        </div>
                        <div className="flex items-center">
                          <Download size={12} className="mr-1" />
                          {dataset.size}
                        </div>
                      </div>
                      <div>
                        <Button size="sm" onClick={() => handleImportDataset(dataset)}>
                          Import Dataset
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="bg-white border rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Report Templates Coming Soon</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                We're working on adding ready-made report templates for different industries and use cases.
              </p>
              <Button variant="outline">
                Check Back Later
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResourceCard 
              title="Power BI Documentation"
              description="Official documentation and guides for Microsoft Power BI"
              icon={<Bookmark size={18} className="text-powerbi-primary" />}
            />
            <ResourceCard 
              title="Video Tutorials"
              description="Step-by-step video guides for all experience levels"
              icon={<Play size={18} className="text-powerbi-primary" />}
            />
            <ResourceCard 
              title="Community Forum"
              description="Connect with other Power BI users and experts"
              icon={<Clock size={18} className="text-powerbi-primary" />}
            />
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen && selectedTutorial !== null} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedTutorial?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="aspect-video bg-gradient-to-r from-powerbi-primary to-powerbi-secondary rounded-lg mb-4 flex items-center justify-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30">
                <Play size={32} className="text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="border rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Duration</div>
                <div className="font-medium flex items-center">
                  <Clock size={14} className="mr-1 text-powerbi-primary" />
                  {selectedTutorial?.duration}
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Level</div>
                <div className="font-medium flex items-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 text-powerbi-primary">
                    <path d="M3 17h18M3 12h18M3 7h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {selectedTutorial?.category.charAt(0).toUpperCase() + selectedTutorial?.category.slice(1)}
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Popularity</div>
                <div className="font-medium flex items-center">
                  <Star size={14} className="mr-1 text-powerbi-primary" />
                  {selectedTutorial?.popularity}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{selectedTutorial?.description}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTutorial?.topics.map((topic: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Tutorial Sections</h3>
              <div className="space-y-2">
                <TutorialSection 
                  number="01"
                  title="Introduction to the Tutorial"
                  duration="2:30"
                  isActive={true}
                />
                <TutorialSection 
                  number="02"
                  title="Understanding the Basics"
                  duration="5:15"
                />
                <TutorialSection 
                  number="03"
                  title="Practical Examples"
                  duration="8:45"
                />
                <TutorialSection 
                  number="04"
                  title="Advanced Techniques"
                  duration="6:30"
                />
                <TutorialSection 
                  number="05"
                  title="Conclusion and Next Steps"
                  duration="2:00"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsDialogOpen(false);
              toast({
                title: "Tutorial started",
                description: "Your tutorial is now playing.",
                duration: 3000,
              });
            }}>
              Start Tutorial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PowerBILayout>
  );
};

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ResourceCard = ({ title, description, icon }: ResourceCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md cursor-pointer">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex items-center text-powerbi-primary text-sm font-medium">
        <span>View resources</span>
        <ChevronRight size={16} className="ml-1" />
      </div>
    </div>
  );
};

interface TutorialSectionProps {
  number: string;
  title: string;
  duration: string;
  isActive?: boolean;
}

const TutorialSection = ({ number, title, duration, isActive = false }: TutorialSectionProps) => {
  return (
    <div className={`flex items-center p-2 rounded ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isActive ? 'bg-powerbi-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
        {isActive ? <Play size={14} /> : number}
      </div>
      <div className="flex-1">
        <div className={`font-medium ${isActive ? 'text-powerbi-primary' : ''}`}>{title}</div>
        <div className="text-xs text-gray-500">{duration}</div>
      </div>
      {isActive ? (
        <div className="text-powerbi-primary text-xs font-medium">Currently playing</div>
      ) : (
        <ChevronRight size={16} className="text-gray-400" />
      )}
    </div>
  );
};

export default Demo;
