# Complete URL List for Power BI App

## All Available Routes

### Main Navigation Routes

1. **Home Page**
   - URL: `/`
   - Description: Landing page with quick actions, recent content, statistics, and recommended items
   - Features: Create reports/dashboards, browse content, view recent activity

2. **Dashboard**
   - URL: `/dashboard`
   - Description: Interactive sales dashboard with KPI cards and visualizations
   - Features: Real-time data refresh, filtering, export to CSV, share functionality

3. **Report Editor**
   - URL: `/report`
   - Description: Main report creation and editing interface
   - Features: Drag-and-drop canvas, data pane, visualization pane, filter pane, templates

4. **Report Editor (with ID)**
   - URL: `/report/:id`
   - Description: Edit specific report by ID
   - Features: Same as /report but loads existing report data

5. **Datasets**
   - URL: `/datasets`
   - Description: Data source management page
   - Features: Connect to various data sources (Excel, SQL Server, Azure, Online Services), refresh data, manage datasets

6. **Data Model**
   - URL: `/model`
   - Description: Basic data modeling interface
   - Features: Create relationships, define measures, manage data structure

7. **Advanced Data Modeling**
   - URL: `/model/advanced`
   - Description: Advanced data modeling capabilities
   - Features: Create relationships between tables, add calculated columns, define DAX measures, manage table properties

8. **Advanced Visualizations**
   - URL: `/visualizations`
   - Description: Gallery of advanced chart types
   - Features: Waterfall, Funnel, Scatter, Treemap, Gauge, KPI cards, custom visuals

9. **Power Query Editor**
   - URL: `/power-query`
   - Description: Data transformation and ETL interface
   - Features: Applied steps, transformation actions, query performance monitoring

10. **AI Assistant**
    - URL: `/ai-assistant`
    - Description: AI-powered analytics assistant
    - Features: Quick insights, Q&A natural language queries, smart narratives, anomaly detection

11. **Mobile Power BI**
    - URL: `/mobile`
    - Description: Mobile-optimized Power BI interface
    - Features: Touch-friendly navigation, responsive charts, mobile dashboards

12. **Settings**
    - URL: `/settings`
    - Description: Application settings and preferences
    - Features: User preferences, account settings, workspace configuration

13. **Demo**
    - URL: `/demo`
    - Description: Demo and tutorial page
    - Features: Getting started guides, sample reports, tutorials

14. **Not Found (404)**
    - URL: `*` (any unmatched route)
    - Description: 404 error page for non-existent routes

## URL Patterns

- **Static Routes**: Most routes are static and directly accessible
- **Dynamic Routes**: `/report/:id` uses URL parameters for specific report IDs
- **Nested Routes**: `/model/advanced` shows hierarchical navigation

## Navigation Methods

1. **Sidebar Navigation**: Main app navigation through EnhancedPowerBISidebar
2. **Top Bar**: Quick access and search through EnhancedPowerBITopBar
3. **Programmatic Navigation**: Using React Router's `useNavigate` hook
4. **Direct URL Access**: All routes support direct browser URL entry

## External Actions (Not Routes)

- File uploads (handled via dialogs)
- Data exports (downloads files)
- Share links (copies current URL to clipboard)
- Template selection (within report editor)
- Workspace switching (updates context, not URL)

## Total Route Count: 14 unique routes
