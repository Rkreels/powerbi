
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
        <PowerBILayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportEditor />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/model" element={<DataModel />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PowerBILayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
