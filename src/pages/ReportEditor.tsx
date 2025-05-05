
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import DataPane from '../components/reportEditor/DataPane';
import ReportCanvas from '../components/reportEditor/ReportCanvas';
import VisualizationPane from '../components/reportEditor/VisualizationPane';
import FilterPane from '../components/reportEditor/FilterPane';

const ReportEditor = () => {
  return (
    <MainLayout>
      <div className="flex h-full">
        <DataPane />
        <ReportCanvas />
        <VisualizationPane />
        <FilterPane />
      </div>
    </MainLayout>
  );
};

export default ReportEditor;
