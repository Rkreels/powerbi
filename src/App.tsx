
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
import EnhancedPowerBISidebar from "./components/navigation/EnhancedPowerBISidebar";
import EnhancedPowerBITopBar from "./components/navigation/EnhancedPowerBITopBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen w-full overflow-hidden bg-white">
          <EnhancedPowerBISidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <EnhancedPowerBITopBar />
            
            <div className="flex-1 overflow-auto bg-gray-50">
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
            </div>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
