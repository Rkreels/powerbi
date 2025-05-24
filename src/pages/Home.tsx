
import React, { useState } from 'react';
import { 
  Plus, 
  Star, 
  MoreHorizontal, 
  Filter, 
  Clock, 
  Users, 
  BarChart2, 
  Layout, 
  FileSearch,
  TrendingUp,
  Eye,
  Share2,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContentItem {
  id: string;
  title: string;
  type: 'report' | 'dashboard' | 'dataset' | 'dataflow';
  lastModified: string;
  owner: string;
  views?: number;
  isShared?: boolean;
  isFavorite?: boolean;
  thumbnail?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Sales Performance Dashboard',
      type: 'dashboard',
      lastModified: '2 hours ago',
      owner: 'You',
      views: 156,
      isFavorite: true,
      thumbnail: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png'
    },
    {
      id: '2',
      title: 'Monthly Revenue Report',
      type: 'report',
      lastModified: '1 day ago',
      owner: 'John Smith',
      views: 89,
      isShared: true,
      isFavorite: false,
      thumbnail: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png'
    },
    {
      id: '3',
      title: 'Customer Analytics Dataset',
      type: 'dataset',
      lastModified: '3 days ago',
      owner: 'You',
      views: 234,
      isFavorite: true
    },
    {
      id: '4',
      title: 'Marketing Campaign Analysis',
      type: 'report',
      lastModified: '1 week ago',
      owner: 'Sarah Wilson',
      views: 67,
      isShared: true,
      isFavorite: false,
      thumbnail: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png'
    },
    {
      id: '5',
      title: 'Financial Overview',
      type: 'dashboard',
      lastModified: '2 weeks ago',
      owner: 'You',
      views: 342,
      isFavorite: false,
      thumbnail: '/lovable-uploads/5d8c88b5-3b6a-4ba6-b780-349246e55c0e.png'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report': return <BarChart2 size={16} className="text-green-600" />;
      case 'dashboard': return <Layout size={16} className="text-blue-600" />;
      case 'dataset': return <FileSearch size={16} className="text-orange-600" />;
      case 'dataflow': return <Filter size={16} className="text-purple-600" />;
      default: return <BarChart2 size={16} className="text-gray-600" />;
    }
  };

  const filteredItems = contentItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'favorites') return item.isFavorite;
    if (activeFilter === 'shared') return item.isShared;
    return item.type === activeFilter;
  });

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="p-4">
            {item.thumbnail ? (
              <div className="w-full h-32 bg-gray-100 rounded-md mb-3 overflow-hidden">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                {getTypeIcon(item.type)}
              </div>
            )}
            
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900 truncate flex-1">{item.title}</h3>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{item.owner}</span>
              <span>{item.lastModified}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                {getTypeIcon(item.type)}
                <span className="capitalize">{item.type}</span>
                {item.views && (
                  <>
                    <Eye size={12} />
                    <span>{item.views}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {item.isShared && <Users size={12} className="text-gray-400" />}
                <button className={`p-1 ${item.isFavorite ? 'text-yellow-500' : 'text-gray-300'}`}>
                  <Star size={12} className={item.isFavorite ? 'fill-current' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-2">Modified</div>
          <div className="col-span-1">Views</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>
      
      {filteredItems.map((item) => (
        <div key={item.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer group">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4 flex items-center">
              {getTypeIcon(item.type)}
              <span className="ml-2 text-sm font-medium text-gray-900 truncate">{item.title}</span>
              {item.isFavorite && <Star size={12} className="ml-2 text-yellow-500 fill-current" />}
              {item.isShared && <Users size={12} className="ml-1 text-gray-400" />}
            </div>
            <div className="col-span-2 text-sm text-gray-500 capitalize">{item.type}</div>
            <div className="col-span-2 text-sm text-gray-500">{item.owner}</div>
            <div className="col-span-2 text-sm text-gray-500">{item.lastModified}</div>
            <div className="col-span-1 text-sm text-gray-500">{item.views || '-'}</div>
            <div className="col-span-1">
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My workspace</h1>
        <p className="text-gray-600">Create reports and dashboards, connect to data sources, and share insights with your team.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => navigate('/report')}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <Plus size={24} className="mb-2" />
          <div className="text-left">
            <div className="font-semibold">Create Report</div>
            <div className="text-sm opacity-90">Build interactive reports</div>
          </div>
        </button>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
        >
          <Layout size={24} className="mb-2" />
          <div className="text-left">
            <div className="font-semibold">Create Dashboard</div>
            <div className="text-sm opacity-90">Combine multiple reports</div>
          </div>
        </button>
        
        <button 
          onClick={() => navigate('/datasets')}
          className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
        >
          <FileSearch size={24} className="mb-2" />
          <div className="text-left">
            <div className="font-semibold">Upload Data</div>
            <div className="text-sm opacity-90">Connect data sources</div>
          </div>
        </button>
        
        <button className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105">
          <TrendingUp size={24} className="mb-2" />
          <div className="text-left">
            <div className="font-semibold">Analytics Hub</div>
            <div className="text-sm opacity-90">Explore insights</div>
          </div>
        </button>
      </div>

      {/* Content Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent content</h2>
          
          {/* Filters */}
          <div className="flex items-center space-x-2">
            {['all', 'favorites', 'reports', 'dashboards', 'datasets', 'shared'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* View Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Layout size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <BarChart2 size={16} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
            <Filter size={16} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? <GridView /> : <ListView />}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <BarChart2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first report or dashboard.</p>
          <button 
            onClick={() => navigate('/report')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Report
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
