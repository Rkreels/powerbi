import { RecentItem, RecommendedItem } from '@/types/home';

// Mock data storage using localStorage
const STORAGE_KEYS = {
  REPORTS: 'powerbi_reports',
  DASHBOARDS: 'powerbi_dashboards',
  DATASETS: 'powerbi_datasets',
  WORKSPACES: 'powerbi_workspaces',
  NOTIFICATIONS: 'powerbi_notifications'
};

export interface Report {
  id: string;
  name: string;
  description: string;
  created: string;
  modified: string;
  owner: string;
  workspace: string;
  isPublished: boolean;
  visualizations: any[];
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  created: string;
  modified: string;
  owner: string;
  workspace: string;
  reports: string[];
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  source: string;
  created: string;
  modified: string;
  owner: string;
  size: string;
  status: 'active' | 'inactive' | 'refreshing';
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  created: string;
  members: number;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  created: string;
  read: boolean;
}

class DataService {
  // Generic CRUD operations
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Reports
  getReports(): Report[] {
    return this.getFromStorage<Report>(STORAGE_KEYS.REPORTS);
  }

  createReport(report: Omit<Report, 'id' | 'created' | 'modified'>): Report {
    const newReport: Report = {
      ...report,
      id: this.generateId(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    
    const reports = this.getReports();
    reports.push(newReport);
    this.saveToStorage(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  }

  updateReport(id: string, updates: Partial<Report>): Report | null {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    
    if (index === -1) return null;
    
    reports[index] = {
      ...reports[index],
      ...updates,
      modified: new Date().toISOString(),
    };
    
    this.saveToStorage(STORAGE_KEYS.REPORTS, reports);
    return reports[index];
  }

  deleteReport(id: string): boolean {
    const reports = this.getReports();
    const filtered = reports.filter(r => r.id !== id);
    
    if (filtered.length === reports.length) return false;
    
    this.saveToStorage(STORAGE_KEYS.REPORTS, filtered);
    return true;
  }

  // Dashboards
  getDashboards(): Dashboard[] {
    return this.getFromStorage<Dashboard>(STORAGE_KEYS.DASHBOARDS);
  }

  createDashboard(dashboard: Omit<Dashboard, 'id' | 'created' | 'modified'>): Dashboard {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: this.generateId(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    
    const dashboards = this.getDashboards();
    dashboards.push(newDashboard);
    this.saveToStorage(STORAGE_KEYS.DASHBOARDS, dashboards);
    return newDashboard;
  }

  updateDashboard(id: string, updates: Partial<Dashboard>): Dashboard | null {
    const dashboards = this.getDashboards();
    const index = dashboards.findIndex(d => d.id === id);
    
    if (index === -1) return null;
    
    dashboards[index] = {
      ...dashboards[index],
      ...updates,
      modified: new Date().toISOString(),
    };
    
    this.saveToStorage(STORAGE_KEYS.DASHBOARDS, dashboards);
    return dashboards[index];
  }

  deleteDashboard(id: string): boolean {
    const dashboards = this.getDashboards();
    const filtered = dashboards.filter(d => d.id !== id);
    
    if (filtered.length === dashboards.length) return false;
    
    this.saveToStorage(STORAGE_KEYS.DASHBOARDS, filtered);
    return true;
  }

  // Datasets
  getDatasets(): Dataset[] {
    return this.getFromStorage<Dataset>(STORAGE_KEYS.DATASETS);
  }

  createDataset(dataset: Omit<Dataset, 'id' | 'created' | 'modified'>): Dataset {
    const newDataset: Dataset = {
      ...dataset,
      id: this.generateId(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    
    const datasets = this.getDatasets();
    datasets.push(newDataset);
    this.saveToStorage(STORAGE_KEYS.DATASETS, datasets);
    return newDataset;
  }

  updateDataset(id: string, updates: Partial<Dataset>): Dataset | null {
    const datasets = this.getDatasets();
    const index = datasets.findIndex(d => d.id === id);
    
    if (index === -1) return null;
    
    datasets[index] = {
      ...datasets[index],
      ...updates,
      modified: new Date().toISOString(),
    };
    
    this.saveToStorage(STORAGE_KEYS.DATASETS, datasets);
    return datasets[index];
  }

  deleteDataset(id: string): boolean {
    const datasets = this.getDatasets();
    const filtered = datasets.filter(d => d.id !== id);
    
    if (filtered.length === datasets.length) return false;
    
    this.saveToStorage(STORAGE_KEYS.DATASETS, filtered);
    return true;
  }

  // Workspaces
  getWorkspaces(): Workspace[] {
    return this.getFromStorage<Workspace>(STORAGE_KEYS.WORKSPACES);
  }

  createWorkspace(workspace: Omit<Workspace, 'id' | 'created'>): Workspace {
    const newWorkspace: Workspace = {
      ...workspace,
      id: this.generateId(),
      created: new Date().toISOString(),
    };
    
    const workspaces = this.getWorkspaces();
    workspaces.push(newWorkspace);
    this.saveToStorage(STORAGE_KEYS.WORKSPACES, workspaces);
    return newWorkspace;
  }

  // Notifications
  getNotifications(): Notification[] {
    return this.getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
  }

  createNotification(notification: Omit<Notification, 'id' | 'created' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      created: new Date().toISOString(),
      read: false,
    };
    
    const notifications = this.getNotifications();
    notifications.unshift(newNotification); // Add to beginning
    this.saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotification;
  }

  markNotificationAsRead(id: string): boolean {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    
    if (!notification) return false;
    
    notification.read = true;
    this.saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return true;
  }

  getUnreadNotificationCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  // Recent items helper
  getRecentItems(): RecentItem[] {
    const reports = this.getReports();
    const dashboards = this.getDashboards();
    
    const allItems: RecentItem[] = [
      ...reports.map(r => ({
        id: r.id,
        title: r.name,
        lastModified: r.modified,
        owner: r.owner,
        type: 'report' as const
      })),
      ...dashboards.map(d => ({
        id: d.id,
        title: d.name,
        lastModified: d.modified,
        owner: d.owner,
        type: 'dashboard' as const
      }))
    ];

    return allItems
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 10);
  }

  // Initialize with sample data
  initializeSampleData(): void {
    if (this.getReports().length === 0) {
      this.createReport({
        name: 'Sales Performance Report',
        description: 'Monthly sales analysis and trends',
        owner: 'John Doe',
        workspace: 'My Workspace',
        isPublished: true,
        visualizations: []
      });

      this.createReport({
        name: 'Customer Analytics',
        description: 'Customer behavior and segmentation analysis',
        owner: 'Jane Smith',
        workspace: 'My Workspace',
        isPublished: false,
        visualizations: []
      });
    }

    if (this.getDashboards().length === 0) {
      this.createDashboard({
        name: 'Executive Dashboard',
        description: 'High-level business metrics and KPIs',
        owner: 'John Doe',
        workspace: 'My Workspace',
        reports: []
      });
    }

    if (this.getDatasets().length === 0) {
      this.createDataset({
        name: 'Sales Data',
        description: 'Historical sales data from CRM',
        source: 'SQL Server',
        owner: 'System',
        size: '2.5 GB',
        status: 'active'
      });

      this.createDataset({
        name: 'Customer Data',
        description: 'Customer demographics and behavior',
        source: 'Excel',
        owner: 'Marketing Team',
        size: '156 MB',
        status: 'active'
      });
    }

    if (this.getWorkspaces().length === 0) {
      this.createWorkspace({
        name: 'My Workspace',
        description: 'Personal workspace',
        members: 1,
        isDefault: true
      });

      this.createWorkspace({
        name: 'Sales Team',
        description: 'Shared workspace for sales team',
        members: 8,
        isDefault: false
      });
    }

    if (this.getNotifications().length === 0) {
      this.createNotification({
        title: 'Welcome to Power BI',
        message: 'Your account has been set up successfully!',
        type: 'success'
      });

      this.createNotification({
        title: 'Dataset Refresh Completed',
        message: 'Sales Data has been refreshed successfully.',
        type: 'info'
      });

      this.createNotification({
        title: 'Report Shared',
        message: 'Sales Performance Report was shared with your team.',
        type: 'info'
      });
    }
  }
}

export const dataService = new DataService();

// Initialize sample data on first load
dataService.initializeSampleData();