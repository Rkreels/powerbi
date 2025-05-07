
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart2,
  FileText,
  Filter,
  Settings,
  Database,
  LayoutDashboard,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BarChart2, label: 'Reports', path: '/report' },
  { icon: BookOpen, label: 'Demo Data', path: '/demo' },
  { icon: Database, label: 'Datasets', path: '/datasets' },
  { icon: Filter, label: 'Data Model', path: '/model' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const ModernSidebarContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-700">
        <div className="p-4">
          <span className="text-lg font-semibold text-white">Power BI Clone</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-powerbi-nav-bg text-white">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Sales Overview">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                  <span>Sales Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Marketing Analytics">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                  <span>Marketing Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Financial Dashboard">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></span>
                  <span>Financial Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-powerbi-nav-bg border-t border-gray-700 p-4">
        <div className="text-white text-xs">
          <div>Power BI Clone</div>
          <div>v1.0.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const ModernSidebar = () => (
  <ModernSidebarContent />
);

export default ModernSidebar;
