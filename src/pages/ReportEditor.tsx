
import React from 'react';
import DataPane from '../components/reportEditor/DataPane';
import ReportCanvas from '../components/reportEditor/ReportCanvas';
import VisualizationPane from '../components/reportEditor/VisualizationPane';
import FilterPane from '../components/reportEditor/FilterPane';

const ReportEditor = () => {
  return (
    <div className="flex h-full">
      <DataPane />
      <ReportCanvas />
      <VisualizationPane />
      <FilterPane />
    </div>
  );
};

export default ReportEditor;
