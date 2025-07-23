
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewReportButtonProps {
  onClick: () => void;
}

const NewReportButton: React.FC<NewReportButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Button 
          className="bg-green-700 hover:bg-green-800 text-white"
          onClick={onClick}
        >
          <Plus size={16} className="mr-2" />
          New report
        </Button>
        <button 
          className="ml-2 p-1.5 border rounded hover:bg-gray-50 transition-colors"
          onClick={() => alert('Report options would be implemented here')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      
      <div className="flex items-center text-sm">
        <span className="text-gray-600 mr-2">New items saved to:</span>
        <div className="flex items-center font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          My workspace
        </div>
      </div>
    </div>
  );
};

export default NewReportButton;
