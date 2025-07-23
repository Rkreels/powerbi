
import React from 'react';

type RecommendedItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: 'tutorial' | 'report';
};

interface RecommendedItemsProps {
  items: RecommendedItem[];
}

const RecommendedItems: React.FC<RecommendedItemsProps> = ({ items }) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recommended</h2>
        <div className="flex">
          <button 
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            onClick={() => alert('Previous navigation would be implemented here')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            onClick={() => alert('Next navigation would be implemented here')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md cursor-pointer">
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {item.type === 'tutorial' && (
                <div className="flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="#6264A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 2v7h7M16 13H8M16 17H8M10 9H8" stroke="#6264A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {item.type === 'report' && (
                <div className="w-full h-full bg-gradient-to-r from-powerbi-primary to-powerbi-secondary opacity-75"></div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.subtitle}</p>
            </div>
            <div className="px-4 py-2 border-t bg-gray-50">
              <button 
                className="w-full text-center py-1 text-sm font-medium hover:bg-gray-100 transition-colors rounded"
                onClick={() => {
                  if (item.type === 'tutorial') {
                    window.open('/demo', '_blank');
                  } else {
                    window.open('/report', '_blank');
                  }
                }}
              >
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedItems;
