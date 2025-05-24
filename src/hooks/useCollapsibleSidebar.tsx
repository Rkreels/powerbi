
import { useState, useEffect } from 'react';

export function useCollapsibleSidebar(defaultCollapsed = true) {
  const SIDEBAR_STATE_KEY = 'powerbi-sidebar-collapsed';
  
  // Initialize state from localStorage if available, defaulting to collapsed
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
      return savedState !== null ? JSON.parse(savedState) : true; // Always default to collapsed
    }
    return true; // Always default to collapsed
  });

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  // Persist state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  // Add keyboard shortcut (Alt+B) to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'b') {
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isCollapsed, toggleSidebar };
}
