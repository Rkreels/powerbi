import { useEffect } from 'react';
import { dataService } from '@/services/dataService';

export const InitializeData = () => {
  useEffect(() => {
    // Check if data is already initialized
    const hasData = localStorage.getItem('powerbi_initialized');
    
    if (!hasData) {
      // Initialize sample data
      dataService.initializeSampleData();
      localStorage.setItem('powerbi_initialized', 'true');
      console.log('Sample data initialized successfully');
    }
  }, []);

  return null; // This component doesn't render anything
};
