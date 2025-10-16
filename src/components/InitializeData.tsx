import { useEffect } from 'react';
import { dataService } from '@/services/dataService';

export const InitializeData = () => {
  useEffect(() => {
    // Initialize sample data on mount
    dataService.initializeSampleData();
    console.log('Sample data initialized successfully');
  }, []);

  return null;
};
