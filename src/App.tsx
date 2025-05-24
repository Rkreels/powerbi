
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ReportEditor from "./pages/ReportEditor";
import Datasets from "./pages/Datasets";
import DataModel from "./pages/DataModel";
import Settings from "./pages/Settings";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import PowerBILayout from "./layouts/PowerBILayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PowerBILayout><Home /></PowerBILayout>} />
          <Route path="/dashboard" element={<PowerBILayout><Dashboard /></PowerBILayout>} />
          <Route path="/report" element={<PowerBILayout><ReportEditor /></PowerBILayout>} />
          <Route path="/datasets" element={<PowerBILayout><Datasets /></PowerBILayout>} />
          <Route path="/model" element={<PowerBILayout><DataModel /></PowerBILayout>} />
          <Route path="/settings" element={<PowerBILayout><Settings /></PowerBILayout>} />
          <Route path="/demo" element={<PowerBILayout><Demo /></PowerBILayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
