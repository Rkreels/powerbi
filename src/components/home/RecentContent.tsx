
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Users, LayoutGrid } from 'lucide-react';

type RecentItem = {
  id: string;
  title: string;
  lastModified: string;
  owner: string;
  type: 'report' | 'dashboard';
};

interface RecentContentProps {
  recentItems: RecentItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
}

const RecentContent: React.FC<RecentContentProps> = ({ 
  recentItems, 
  activeTab, 
  setActiveTab, 
  searchQuery 
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mb-4 border-b">
        <div className="flex space-x-1">
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'recent' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('recent')}
          >
            <Clock size={14} className="inline mr-1" />
            Recent
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'favorites' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Star size={14} className="inline mr-1" />
            Favorites
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'apps' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('apps')}
          >
            <LayoutGrid size={14} className="inline mr-1" />
            My apps
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'external' ? 'border-powerbi-primary text-powerbi-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('external')}
          >
            <Users size={14} className="inline mr-1" />
            From external orgs
          </button>
        </div>
      </div>
      
      {/* Filter bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Filter by keyword" 
            className="w-full pl-8 pr-4 py-1.5 border rounded-md text-sm"
          />
        </div>
        
        <button 
          className="flex items-center border rounded px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
          onClick={() => alert('Filter functionality would be implemented here')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
          </svg>
          Filter
        </button>
      </div>
      
      {/* No content message or list of items */}
      {activeTab === 'recent' && recentItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
              <path d="M21.5 12H16c-.7 2-2.8 4-5 4s-4.3-2-5-4H.5"></path>
              <path d="M3 9l2 6h14l2-6"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Find recently opened content here</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Once you've opened some Power BI content, come back to Recents to find it again easily.
          </p>
        </div>
      ) : activeTab === 'recent' && (
        <div>
          {recentItems.map(item => (
            <div 
              key={item.id} 
              className="border-b py-3 flex items-center hover:bg-gray-50 px-3 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-10 h-10 mr-4 rounded bg-powerbi-primary flex items-center justify-center text-white">
                {item.type === 'report' ? 'R' : 'D'}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <div className="text-xs text-gray-600">
                  Modified {item.lastModified} • {item.owner}
                </div>
              </div>
              <div>
                <button 
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Item options would be implemented here');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {(activeTab !== 'recent' || (activeTab === 'recent' && recentItems.length === 0 && searchQuery)) && (
        <div className="text-center py-16">
          <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
              <path d="M21.5 12H16c-.7 2-2.8 4-5 4s-4.3-2-5-4H.5"></path>
              <path d="M3 9l2 6h14l2-6"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No content found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            There's no content to show in this section right now.
          </p>
        </div>
      )}
    </>
  );
};

export default RecentContent;
