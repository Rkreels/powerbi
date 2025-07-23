
import React, { useState } from 'react';
import { Play, BookOpen, Video, FileText, ExternalLink, Clock, Users, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Demo = () => {
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with Power BI',
      description: 'Learn the basics of creating your first report',
      duration: '15 min',
      difficulty: 'Beginner',
      type: 'video',
      completed: false
    },
    {
      id: 2,
      title: 'Connecting to Data Sources',
      description: 'How to connect and import data from various sources',
      duration: '20 min',
      difficulty: 'Beginner',
      type: 'tutorial',
      completed: true
    },
    {
      id: 3,
      title: 'Creating Visualizations',
      description: 'Build compelling charts and graphs',
      duration: '25 min',
      difficulty: 'Intermediate',
      type: 'hands-on',
      completed: false
    },
    {
      id: 4,
      title: 'Dashboard Design Best Practices',
      description: 'Design effective and beautiful dashboards',
      duration: '30 min',
      difficulty: 'Intermediate',
      type: 'video',
      completed: false
    },
    {
      id: 5,
      title: 'Advanced DAX Functions',
      description: 'Master complex calculations and measures',
      duration: '45 min',
      difficulty: 'Advanced',
      type: 'tutorial',
      completed: false
    },
    {
      id: 6,
      title: 'Sharing and Collaboration',
      description: 'Share reports and collaborate with your team',
      duration: '18 min',
      difficulty: 'Beginner',
      type: 'hands-on',
      completed: false
    }
  ];

  const quickStartItems = [
    {
      title: 'Sample Sales Dashboard',
      description: 'Explore a pre-built sales dashboard with sample data',
      icon: <Play size={20} className="text-green-600" />,
      action: 'Open Demo'
    },
    {
      title: 'Template Gallery',
      description: 'Browse professionally designed report templates',
      icon: <BookOpen size={20} className="text-blue-600" />,
      action: 'Browse Templates'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: <Video size={20} className="text-purple-600" />,
      action: 'Watch Videos'
    },
    {
      title: 'Documentation',
      description: 'Read comprehensive guides and references',
      icon: <FileText size={20} className="text-orange-600" />,
      action: 'Read Docs'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-purple-600" />;
      case 'tutorial': return <BookOpen size={16} className="text-blue-600" />;
      case 'hands-on': return <Play size={16} className="text-green-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learn Power BI</h1>
        <p className="text-gray-600">Master data visualization and business intelligence with our comprehensive learning resources</p>
      </div>

      {/* Quick Start Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStartItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-3">
                {item.icon}
                <h3 className="font-medium ml-2">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  if (item.action === 'Open Demo') {
                    window.open('/dashboard', '_blank');
                  } else if (item.action === 'Browse Templates') {
                    alert('Template gallery would be implemented here');
                  } else if (item.action === 'Watch Videos') {
                    alert('Video tutorials would be implemented here');
                  } else {
                    alert('Documentation would be implemented here');
                  }
                }}
              >
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
            <div className="p-6">
              <div className="space-y-4">
                {tutorials.map((tutorial) => (
                  <div 
                    key={tutorial.id} 
                    className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                      tutorial.completed ? 'bg-green-50 border-green-200' : ''
                    }`}
                    onClick={() => setSelectedTutorial(tutorial)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {tutorial.completed ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getTypeIcon(tutorial.type)}
                            <h3 className="font-medium">{tutorial.title}</h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{tutorial.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                        onClick={() => {
                          setSelectedTutorial(tutorial);
                          alert(`${tutorial.completed ? 'Reviewing' : 'Starting'} tutorial: ${tutorial.title}`);
                        }}
                      >
                        {tutorial.completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold mb-4">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Completed Tutorials</span>
                <span className="font-medium">1 of {tutorials.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(tutorials.filter(t => t.completed).length / tutorials.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {Math.round((tutorials.filter(t => t.completed).length / tutorials.length) * 100)}% Complete
              </div>
            </div>
          </div>

          {/* Community */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-blue-600" />
                  <span>Discussion Forum</span>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Video size={16} className="mr-2 text-purple-600" />
                  <span>Live Webinars</span>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Star size={16} className="mr-2 text-yellow-600" />
                  <span>Featured Examples</span>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold mb-4">Additional Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-blue-600 hover:underline">Power BI Documentation</a>
              <a href="#" className="block text-sm text-blue-600 hover:underline">Sample Datasets</a>
              <a href="#" className="block text-sm text-blue-600 hover:underline">Template Gallery</a>
              <a href="#" className="block text-sm text-blue-600 hover:underline">Best Practices Guide</a>
              <a href="#" className="block text-sm text-blue-600 hover:underline">Keyboard Shortcuts</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
