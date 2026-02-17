
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Video, FileText, ExternalLink, Clock, Users, Star, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Demo = () => {
  const navigate = useNavigate();
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [completedTutorials, setCompletedTutorials] = useState<number[]>([2]);

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with Power BI',
      description: 'Learn the basics of creating your first report',
      duration: '15 min',
      difficulty: 'Beginner',
      type: 'video',
      route: '/report',
      content: 'Navigate to the Report Editor to create your first visualization. Use the Data Pane to select fields and the Visualization Pane to choose chart types.'
    },
    {
      id: 2,
      title: 'Connecting to Data Sources',
      description: 'How to connect and import data from various sources',
      duration: '20 min',
      difficulty: 'Beginner',
      type: 'tutorial',
      route: '/datasets',
      content: 'Go to the Datasets page and click "Get Data" to connect to Excel, SQL Server, Azure, and other sources.'
    },
    {
      id: 3,
      title: 'Creating Visualizations',
      description: 'Build compelling charts and graphs',
      duration: '25 min',
      difficulty: 'Intermediate',
      type: 'hands-on',
      route: '/visualizations',
      content: 'Explore advanced visualization types including treemaps, waterfall charts, and custom visuals.'
    },
    {
      id: 4,
      title: 'Dashboard Design Best Practices',
      description: 'Design effective and beautiful dashboards',
      duration: '30 min',
      difficulty: 'Intermediate',
      type: 'video',
      route: '/dashboard',
      content: 'Learn KPI cards, chart layouts, and how to combine multiple reports into a single dashboard view.'
    },
    {
      id: 5,
      title: 'Advanced DAX Functions',
      description: 'Master complex calculations and measures',
      duration: '45 min',
      difficulty: 'Advanced',
      type: 'tutorial',
      route: '/model/advanced',
      content: 'Learn DAX functions like CALCULATE, SUMX, and time intelligence functions for advanced analytics.'
    },
    {
      id: 6,
      title: 'Data Modeling & Relationships',
      description: 'Build star schemas and manage table relationships',
      duration: '35 min',
      difficulty: 'Intermediate',
      type: 'hands-on',
      route: '/model',
      content: 'Create relationships between tables, define cardinality, and build an optimized data model.'
    },
    {
      id: 7,
      title: 'Power Query Editor',
      description: 'Transform and clean data before analysis',
      duration: '40 min',
      difficulty: 'Advanced',
      type: 'tutorial',
      route: '/power-query',
      content: 'Use Power Query to merge, append, pivot, and transform data from multiple sources.'
    },
    {
      id: 8,
      title: 'AI-Powered Insights',
      description: 'Use AI to discover patterns in your data',
      duration: '20 min',
      difficulty: 'Beginner',
      type: 'hands-on',
      route: '/ai-assistant',
      content: 'Let the AI assistant analyze your data and suggest the best visualizations automatically.'
    }
  ];

  const quickStartItems = [
    {
      title: 'Sample Sales Dashboard',
      description: 'Explore a pre-built sales dashboard with sample data',
      icon: <Play size={20} className="text-green-600" />,
      action: 'Open Demo',
      route: '/dashboard'
    },
    {
      title: 'Report Templates',
      description: 'Browse professionally designed report templates',
      icon: <BookOpen size={20} className="text-blue-600" />,
      action: 'Browse Templates',
      route: '/report'
    },
    {
      title: 'Data Modeling',
      description: 'Learn data relationships and schema design',
      icon: <Video size={20} className="text-purple-600" />,
      action: 'Open Model',
      route: '/model'
    },
    {
      title: 'AI Assistant',
      description: 'Get AI-powered insights from your data',
      icon: <FileText size={20} className="text-orange-600" />,
      action: 'Try AI',
      route: '/ai-assistant'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-purple-600" />;
      case 'tutorial': return <BookOpen size={16} className="text-blue-600" />;
      case 'hands-on': return <Play size={16} className="text-green-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTutorial = (tutorial: any) => {
    setSelectedTutorial(tutorial);
    if (!completedTutorials.includes(tutorial.id)) {
      setCompletedTutorials(prev => [...prev, tutorial.id]);
    }
    toast({
      title: `Starting: ${tutorial.title}`,
      description: tutorial.content,
      duration: 4000,
    });
    setTimeout(() => navigate(tutorial.route), 1500);
  };

  const completedCount = completedTutorials.length;
  const totalCount = tutorials.length;

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Learn Power BI</h1>
        <p className="text-gray-600">Master data visualization and business intelligence</p>
      </div>

      {/* Quick Start */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStartItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(item.route)}>
              <div className="flex items-center mb-3">
                {item.icon}
                <h3 className="font-medium ml-2">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                {item.action}
                <ExternalLink size={14} className="ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Learning Path</h2>
              <p className="text-gray-600 text-sm mt-1">Follow our structured learning path to master Power BI</p>
            </div>
            <div className="p-4 md:p-6">
              <div className="space-y-4">
                {tutorials.map((tutorial) => {
                  const isCompleted = completedTutorials.includes(tutorial.id);
                  return (
                    <div 
                      key={tutorial.id} 
                      className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isCompleted ? 'bg-green-50 border-green-200' : ''
                      }`}
                      onClick={() => handleStartTutorial(tutorial)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="mt-1 flex-shrink-0">
                            {isCompleted ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1 flex-wrap">
                              {getTypeIcon(tutorial.type)}
                              <h3 className="font-medium">{tutorial.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{tutorial.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 flex-wrap gap-1">
                              <div className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                {tutorial.duration}
                              </div>
                              <span className={`px-2 py-1 rounded-full ${getDifficultyColor(tutorial.difficulty)}`}>
                                {tutorial.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-2 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTutorial(tutorial);
                          }}
                        >
                          {isCompleted ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold mb-4">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-medium">{completedCount} of {totalCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
              </div>
              <div className="text-xs text-gray-500">{Math.round((completedCount / totalCount) * 100)}% Complete</div>
            </div>
          </div>

          {/* Community */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="space-y-3">
              <button onClick={() => window.open('https://community.powerbi.com', '_blank')} className="flex items-center justify-between text-sm w-full hover:bg-gray-50 p-1 rounded">
                <div className="flex items-center"><Users size={16} className="mr-2 text-blue-600" /><span>Discussion Forum</span></div>
                <ExternalLink size={14} className="text-gray-400" />
              </button>
              <button onClick={() => navigate('/visualizations')} className="flex items-center justify-between text-sm w-full hover:bg-gray-50 p-1 rounded">
                <div className="flex items-center"><Star size={16} className="mr-2 text-yellow-600" /><span>Featured Examples</span></div>
                <ExternalLink size={14} className="text-gray-400" />
              </button>
              <button onClick={() => navigate('/ai-assistant')} className="flex items-center justify-between text-sm w-full hover:bg-gray-50 p-1 rounded">
                <div className="flex items-center"><Video size={16} className="mr-2 text-purple-600" /><span>AI Assistant</span></div>
                <ExternalLink size={14} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold mb-4">Additional Resources</h3>
            <div className="space-y-2">
              <button onClick={() => navigate('/datasets')} className="block text-sm text-blue-600 hover:underline">Sample Datasets</button>
              <button onClick={() => navigate('/report')} className="block text-sm text-blue-600 hover:underline">Report Templates</button>
              <button onClick={() => navigate('/power-query')} className="block text-sm text-blue-600 hover:underline">Power Query Editor</button>
              <button onClick={() => navigate('/model')} className="block text-sm text-blue-600 hover:underline">Data Model Guide</button>
              <button onClick={() => navigate('/settings')} className="block text-sm text-blue-600 hover:underline">Settings & Preferences</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
