
import React from 'react';
import PowerBILayout from '../layouts/PowerBILayout';
import DataPane from '../components/reportEditor/DataPane';
import ReportCanvas from '../components/reportEditor/ReportCanvas';
import VisualizationPane from '../components/reportEditor/VisualizationPane';
import FilterPane from '../components/reportEditor/FilterPane';

const ReportEditor = () => {
  return (
    <PowerBILayout>
      <div className="flex h-full">
        <DataPane />
        <ReportCanvas />
        <VisualizationPane />
        <FilterPane />
      </div>
    </PowerBILayout>
  );
};

export default ReportEditor;
