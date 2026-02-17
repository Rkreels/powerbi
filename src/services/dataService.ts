import { RecentItem, RecommendedItem } from '@/types/home';

// In-memory data storage (no localStorage, no browser storage)
const IN_MEMORY_STORAGE: {
  reports: Report[];
  dashboards: Dashboard[];
  datasets: Dataset[];
  workspaces: Workspace[];
  notifications: AppNotification[];
} = {
  reports: [],
  dashboards: [],
  datasets: [],
  workspaces: [],
  notifications: []
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  created: string;
  read: boolean;
}

// Re-export as Notification for backward compatibility
export type Notification = AppNotification;

class DataService {
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Reports
  getReports(): Report[] {
    return IN_MEMORY_STORAGE.reports;
  }

  createReport(report: Omit<Report, 'id' | 'created' | 'modified'>): Report {
    const newReport: Report = {
      ...report,
      id: this.generateId(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    IN_MEMORY_STORAGE.reports.push(newReport);
    return newReport;
  }

  updateReport(id: string, updates: Partial<Report>): Report | null {
    const index = IN_MEMORY_STORAGE.reports.findIndex(r => r.id === id);
    if (index === -1) return null;
    IN_MEMORY_STORAGE.reports[index] = {
      ...IN_MEMORY_STORAGE.reports[index],
      ...updates,
      modified: new Date().toISOString(),
    };
    return IN_MEMORY_STORAGE.reports[index];
  }

  deleteReport(id: string): boolean {
    const initialLength = IN_MEMORY_STORAGE.reports.length;
    IN_MEMORY_STORAGE.reports = IN_MEMORY_STORAGE.reports.filter(r => r.id !== id);
    return IN_MEMORY_STORAGE.reports.length < initialLength;
  }

  // Dashboards
  getDashboards(): Dashboard[] {
    return IN_MEMORY_STORAGE.dashboards;
  }

  createDashboard(dashboard: Omit<Dashboard, 'id' | 'created' | 'modified'>): Dashboard {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: this.generateId(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    IN_MEMORY_STORAGE.dashboards.push(newDashboard);
    return newDashboard;
  }

  updateDashboard(id: string, updates: Partial<Dashboard>): Dashboard | null {
    const index = IN_MEMORY_STORAGE.dashboards.findIndex(d => d.id === id);
    if (index === -1) return null;
    IN_MEMORY_STORAGE.dashboards[index] = {
      ...IN_MEMORY_STORAGE.dashboards[index],
      ...updates,
      modified: new Date().toISOString(),
    };
    return IN_MEMORY_STORAGE.dashboards[index];
  }

  deleteDashboard(id: string): boolean {
    const initialLength = IN_MEMORY_STORAGE.dashboards.length;
    IN_MEMORY_STORAGE.dashboards = IN_MEMORY_STORAGE.dashboards.filter(d => d.id !== id);
    return IN_MEMORY_STORAGE.dashboards.length < initialLength;
  }

  // Datasets
  getDatasets(): Dataset[] {
    return IN_MEMORY_STORAGE.datasets;
  }

  createDataset(dataset: Omit<Dataset, 'id' | 'created' | 'modified'>): Dataset {
    const newDataset: Dataset = {
      ...dataset,
      id: this.generateId(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    IN_MEMORY_STORAGE.datasets.push(newDataset);
    return newDataset;
  }

  updateDataset(id: string, updates: Partial<Dataset>): Dataset | null {
    const index = IN_MEMORY_STORAGE.datasets.findIndex(d => d.id === id);
    if (index === -1) return null;
    IN_MEMORY_STORAGE.datasets[index] = {
      ...IN_MEMORY_STORAGE.datasets[index],
      ...updates,
      modified: new Date().toISOString(),
    };
    return IN_MEMORY_STORAGE.datasets[index];
  }

  deleteDataset(id: string): boolean {
    const initialLength = IN_MEMORY_STORAGE.datasets.length;
    IN_MEMORY_STORAGE.datasets = IN_MEMORY_STORAGE.datasets.filter(d => d.id !== id);
    return IN_MEMORY_STORAGE.datasets.length < initialLength;
  }

  // Workspaces
  getWorkspaces(): Workspace[] {
    return IN_MEMORY_STORAGE.workspaces;
  }

  createWorkspace(workspace: Omit<Workspace, 'id' | 'created'>): Workspace {
    const newWorkspace: Workspace = {
      ...workspace,
      id: this.generateId(),
      created: new Date().toISOString(),
    };
    IN_MEMORY_STORAGE.workspaces.push(newWorkspace);
    return newWorkspace;
  }

  deleteWorkspace(id: string): boolean {
    const ws = IN_MEMORY_STORAGE.workspaces.find(w => w.id === id);
    if (!ws || ws.isDefault) return false;
    IN_MEMORY_STORAGE.workspaces = IN_MEMORY_STORAGE.workspaces.filter(w => w.id !== id);
    return true;
  }

  // Notifications
  getNotifications(): AppNotification[] {
    return IN_MEMORY_STORAGE.notifications;
  }

  createNotification(notification: Omit<AppNotification, 'id' | 'created' | 'read'>): AppNotification {
    const newNotification: AppNotification = {
      ...notification,
      id: this.generateId(),
      created: new Date().toISOString(),
      read: false,
    };
    IN_MEMORY_STORAGE.notifications.unshift(newNotification);
    return newNotification;
  }

  markNotificationAsRead(id: string): boolean {
    const notification = IN_MEMORY_STORAGE.notifications.find(n => n.id === id);
    if (!notification) return false;
    notification.read = true;
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

  // Sample realistic data
  getSampleData(): { datasets: any[], sampleVisualizations: any[] } {
    const sampleDatasets = [
      {
        name: "Sales Data",
        data: [
          { month: 'Jan', revenue: 65000, units: 120, region: 'North', category: 'Electronics' },
          { month: 'Feb', revenue: 59000, units: 110, region: 'South', category: 'Electronics' },
          { month: 'Mar', revenue: 80000, units: 150, region: 'East', category: 'Electronics' },
          { month: 'Apr', revenue: 81000, units: 160, region: 'West', category: 'Electronics' },
          { month: 'May', revenue: 96000, units: 180, region: 'North', category: 'Clothing' },
          { month: 'Jun', revenue: 78000, units: 140, region: 'South', category: 'Clothing' },
          { month: 'Jul', revenue: 103000, units: 200, region: 'East', category: 'Home' },
          { month: 'Aug', revenue: 89000, units: 170, region: 'West', category: 'Home' },
          { month: 'Sep', revenue: 91000, units: 175, region: 'North', category: 'Sports' },
          { month: 'Oct', revenue: 87000, units: 165, region: 'South', category: 'Sports' },
          { month: 'Nov', revenue: 102000, units: 195, region: 'East', category: 'Books' },
          { month: 'Dec', revenue: 115000, units: 220, region: 'West', category: 'Books' }
        ]
      },
      {
        name: "Customer Data",
        data: [
          { customerId: 'C001', name: 'Alice Johnson', age: 28, city: 'New York', purchases: 5, totalSpent: 1200 },
          { customerId: 'C002', name: 'Bob Smith', age: 34, city: 'Los Angeles', purchases: 8, totalSpent: 2100 },
          { customerId: 'C003', name: 'Carol Davis', age: 45, city: 'Chicago', purchases: 12, totalSpent: 3400 },
          { customerId: 'C004', name: 'David Wilson', age: 31, city: 'Houston', purchases: 3, totalSpent: 890 },
          { customerId: 'C005', name: 'Eva Brown', age: 29, city: 'Phoenix', purchases: 7, totalSpent: 1650 },
          { customerId: 'C006', name: 'Frank Miller', age: 52, city: 'Philadelphia', purchases: 15, totalSpent: 4200 },
          { customerId: 'C007', name: 'Grace Lee', age: 26, city: 'San Antonio', purchases: 4, totalSpent: 980 }
        ]
      },
      {
        name: "Product Performance",
        data: [
          { productId: 'P001', name: 'Laptop Pro', category: 'Electronics', price: 1299, sales: 45, rating: 4.5 },
          { productId: 'P002', name: 'Smartphone X', category: 'Electronics', price: 899, sales: 78, rating: 4.2 },
          { productId: 'P003', name: 'Wireless Headphones', category: 'Electronics', price: 199, sales: 156, rating: 4.7 },
          { productId: 'P004', name: 'Running Shoes', category: 'Sports', price: 129, sales: 89, rating: 4.1 },
          { productId: 'P005', name: 'Coffee Maker', category: 'Home', price: 89, sales: 67, rating: 4.3 },
          { productId: 'P006', name: 'Desk Chair', category: 'Home', price: 249, sales: 34, rating: 4.0 }
        ]
      }
    ];

    const sampleVisualizations = [
      { id: 'v1', type: 'LineChart', title: 'Revenue Trend', datasetName: 'Sales Data', config: { xAxis: 'month', yAxis: 'revenue', color: '#8884d8' } },
      { id: 'v2', type: 'BarChart', title: 'Units Sold by Month', datasetName: 'Sales Data', config: { xAxis: 'month', yAxis: 'units', color: '#82ca9d' } },
      { id: 'v3', type: 'PieChart', title: 'Revenue by Region', datasetName: 'Sales Data', config: { nameField: 'region', valueField: 'revenue' } }
    ];

    return { datasets: sampleDatasets, sampleVisualizations };
  }

  queryData(datasetName: string, filters?: any): any[] {
    const { datasets } = this.getSampleData();
    const dataset = datasets.find(ds => ds.name === datasetName);
    if (!dataset) return [];
    let data = [...dataset.data];
    if (filters) {
      if (filters.category) data = data.filter(item => item.category === filters.category);
      if (filters.region) data = data.filter(item => item.region === filters.region);
    }
    return data;
  }

  // Initialize with 10 enterprise demo data entries
  initializeSampleData(): void {
    if (this.getReports().length > 0) return;

    const { sampleVisualizations } = this.getSampleData();

    // 10 Enterprise Reports
    const reportData = [
      { name: 'Q4 Sales Performance Dashboard', description: 'Quarterly sales analysis with regional breakdowns and target tracking', owner: 'John Doe', workspace: 'My Workspace', isPublished: true, visualizations: sampleVisualizations.slice(0, 2) },
      { name: 'Customer Segmentation Analysis', description: 'Customer behavior clustering and lifetime value analysis', owner: 'Jane Smith', workspace: 'Sales Team', isPublished: true, visualizations: [sampleVisualizations[2]] },
      { name: 'Supply Chain Efficiency Report', description: 'End-to-end supply chain metrics and bottleneck identification', owner: 'Mike Johnson', workspace: 'Operations', isPublished: true, visualizations: [] },
      { name: 'Marketing Campaign ROI Tracker', description: 'Multi-channel campaign performance and spend optimization', owner: 'Sarah Wilson', workspace: 'Marketing', isPublished: true, visualizations: [sampleVisualizations[0], sampleVisualizations[2]] },
      { name: 'Financial P&L Statement', description: 'Profit and loss analysis with budget variance tracking', owner: 'Robert Chen', workspace: 'Finance', isPublished: true, visualizations: sampleVisualizations },
      { name: 'HR Workforce Analytics', description: 'Employee headcount, attrition, and diversity metrics', owner: 'Lisa Park', workspace: 'Human Resources', isPublished: false, visualizations: [sampleVisualizations[1]] },
      { name: 'Product Launch Performance', description: 'New product sales velocity and market penetration analysis', owner: 'David Kim', workspace: 'Product Team', isPublished: true, visualizations: [sampleVisualizations[0]] },
      { name: 'IT Infrastructure Monitoring', description: 'Server uptime, incident tracking, and SLA compliance', owner: 'Alex Turner', workspace: 'IT Operations', isPublished: false, visualizations: [] },
      { name: 'Executive KPI Scorecard', description: 'C-level dashboard with company-wide KPIs and OKR tracking', owner: 'John Doe', workspace: 'My Workspace', isPublished: true, visualizations: sampleVisualizations },
      { name: 'Regional Sales Comparison', description: 'Compare sales performance across different geographic regions', owner: 'Maria Garcia', workspace: 'Sales Team', isPublished: true, visualizations: [sampleVisualizations[0], sampleVisualizations[2]] },
    ];
    reportData.forEach(r => this.createReport(r));

    // 5 Enterprise Dashboards
    const dashboardData = [
      { name: 'Executive Dashboard', description: 'High-level business metrics and KPIs for leadership', owner: 'John Doe', workspace: 'My Workspace', reports: [] },
      { name: 'Sales Operations Dashboard', description: 'Real-time sales pipeline and forecast dashboard', owner: 'Jane Smith', workspace: 'Sales Team', reports: [] },
      { name: 'Marketing Analytics Hub', description: 'Unified view of all marketing campaigns and channels', owner: 'Sarah Wilson', workspace: 'Marketing', reports: [] },
      { name: 'Finance Overview', description: 'Cash flow, revenue, and expense tracking dashboard', owner: 'Robert Chen', workspace: 'Finance', reports: [] },
      { name: 'Operations Control Center', description: 'Supply chain, inventory, and logistics monitoring', owner: 'Mike Johnson', workspace: 'Operations', reports: [] },
    ];
    dashboardData.forEach(d => this.createDashboard(d));

    // 10 Enterprise Datasets
    const datasetData = [
      { name: 'Enterprise Sales Data', description: 'Historical sales transactions from CRM system', source: 'SQL Server', owner: 'Data Engineering', size: '2.5 GB', status: 'active' as const },
      { name: 'Customer 360 Dataset', description: 'Unified customer view from multiple touchpoints', source: 'Azure Synapse', owner: 'Marketing Team', size: '1.8 GB', status: 'active' as const },
      { name: 'Financial Ledger Data', description: 'General ledger and journal entries', source: 'Oracle', owner: 'Finance Team', size: '4.2 GB', status: 'active' as const },
      { name: 'HR Employee Records', description: 'Employee demographics, payroll, and performance data', source: 'Workday API', owner: 'HR Analytics', size: '890 MB', status: 'active' as const },
      { name: 'Product Catalog', description: 'Complete product hierarchy and pricing data', source: 'PostgreSQL', owner: 'Product Team', size: '156 MB', status: 'active' as const },
      { name: 'Web Analytics Data', description: 'Website traffic, conversions, and user behavior', source: 'Google Analytics', owner: 'Digital Team', size: '3.1 GB', status: 'active' as const },
      { name: 'Supply Chain Logistics', description: 'Shipping, inventory levels, and supplier performance', source: 'SAP', owner: 'Operations', size: '1.4 GB', status: 'active' as const },
      { name: 'Social Media Metrics', description: 'Engagement, reach, and sentiment across platforms', source: 'REST API', owner: 'Social Media Team', size: '420 MB', status: 'active' as const },
      { name: 'IoT Sensor Readings', description: 'Manufacturing equipment telemetry and alerts', source: 'Azure IoT Hub', owner: 'Engineering', size: '8.7 GB', status: 'refreshing' as const },
      { name: 'Market Research Surveys', description: 'Customer satisfaction and NPS survey results', source: 'Excel', owner: 'Research Team', size: '95 MB', status: 'active' as const },
    ];
    datasetData.forEach(d => this.createDataset(d));

    // 6 Enterprise Workspaces
    const workspaceData = [
      { name: 'My Workspace', description: 'Personal workspace', members: 1, isDefault: true },
      { name: 'Sales Team', description: 'Sales analytics and reporting workspace', members: 12, isDefault: false },
      { name: 'Marketing', description: 'Marketing analytics and campaign tracking', members: 8, isDefault: false },
      { name: 'Finance', description: 'Financial reporting and budget analysis', members: 6, isDefault: false },
      { name: 'Operations', description: 'Supply chain and operations analytics', members: 10, isDefault: false },
      { name: 'Human Resources', description: 'HR analytics and workforce planning', members: 5, isDefault: false },
    ];
    workspaceData.forEach(w => this.createWorkspace(w));

    // 10 Notifications
    const notificationData = [
      { title: 'Welcome to Power BI', message: 'Your enterprise account has been activated with full Pro features.', type: 'success' as const },
      { title: 'Dataset Refresh Completed', message: 'Enterprise Sales Data has been refreshed successfully with 2.5M new records.', type: 'info' as const },
      { title: 'Report Shared With You', message: 'Sarah Wilson shared "Marketing Campaign ROI Tracker" with you.', type: 'info' as const },
      { title: 'Scheduled Refresh Failed', message: 'IoT Sensor Readings dataset refresh failed. Check connection settings.', type: 'error' as const },
      { title: 'New Workspace Member', message: 'Alex Turner joined the Operations workspace.', type: 'info' as const },
      { title: 'Dashboard Comment', message: 'Robert Chen commented on "Executive Dashboard": "Q4 numbers look great!"', type: 'info' as const },
      { title: 'Data Alert Triggered', message: 'Sales in North region exceeded $100K threshold.', type: 'warning' as const },
      { title: 'Report Published', message: 'Executive KPI Scorecard has been published to the organization.', type: 'success' as const },
      { title: 'Subscription Renewal', message: 'Your Power BI Pro trial expires in 28 days. Upgrade to continue.', type: 'warning' as const },
      { title: 'New Feature Available', message: 'AI-powered insights are now available for your datasets.', type: 'info' as const },
    ];
    notificationData.forEach(n => this.createNotification(n));
  }
}

export const dataService = new DataService();

// Initialize sample data on first load
dataService.initializeSampleData();
