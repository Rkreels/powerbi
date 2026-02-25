import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - 1));
  };

  const handleNext = () => {
    setStartIndex(Math.min(items.length - visibleCount, startIndex + 1));
  };

  const handleOpen = (item: RecommendedItem) => {
    if (item.type === 'tutorial') {
      navigate('/demo');
    } else {
      navigate('/report');
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recommended</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={handlePrev} disabled={startIndex === 0}>
            <ChevronLeft size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={handleNext} disabled={startIndex >= items.length - visibleCount}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleItems.map(item => (
          <div 
            key={item.id} 
            className="border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => handleOpen(item)}
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {item.type === 'tutorial' ? (
                <div className="flex items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="#6264A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 2v7h7M16 13H8M16 17H8M10 9H8" stroke="#6264A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.subtitle}</p>
            </div>
            <div className="px-4 py-2 border-t bg-gray-50">
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                onClick={(e) => { e.stopPropagation(); handleOpen(item); }}
              >
                {item.type === 'tutorial' ? 'Start Learning' : 'Open Report'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedItems;
