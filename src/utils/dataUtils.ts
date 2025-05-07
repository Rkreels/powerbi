
import { toast } from "@/hooks/use-toast";

// Define common types used throughout the application
export interface Dataset {
  id: string;
  name: string;
  lastRefreshed: string;
  size: string;
  owner: string;
  created: string;
  tables: number;
  status: 'online' | 'scheduled' | 'offline';
  type: 'Import' | 'DirectQuery' | 'Composite';
}

export interface DataTable {
  id: string;
  name: string;
  columns: Column[];
  rows: number;
  size: string;
}

export interface Column {
  name: string;
  dataType: DataType;
  description?: string;
  isKey?: boolean;
  isHidden?: boolean;
  format?: string;
}

export type DataType = 'Text' | 'Number' | 'Decimal' | 'Currency' | 'Date' | 'DateTime' | 'Boolean' | 'Binary' | 'Calculated';

export interface Relationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'OneToMany' | 'OneToOne' | 'ManyToMany';
  isActive: boolean;
}

export interface Measure {
  id: string;
  name: string;
  expression: string;
  table: string;
  format?: string;
  description?: string;
}

// Format a number for display (e.g., 1234 -> 1,234)
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

// Format currency values
export const formatCurrency = (num: number, currencyCode = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
};

// Format percentage values
export const formatPercentage = (num: number, decimalPlaces = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(num / 100);
};

// Format date values
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Validate DAX expressions (simplified version)
export const validateDaxExpression = (expression: string): { isValid: boolean; error?: string } => {
  // This is a very simplified validation
  // In a real implementation, this would be a much more complex parser
  if (!expression.trim()) {
    return { isValid: false, error: "Expression cannot be empty" };
  }

  // Check for basic syntax elements
  const hasEquals = expression.includes('=');
  const hasParenthesesBalance = (expression.match(/\(/g) || []).length === (expression.match(/\)/g) || []).length;
  
  if (!hasEquals) {
    return { isValid: false, error: "Expression must include an equals sign (=)" };
  }
  
  if (!hasParenthesesBalance) {
    return { isValid: false, error: "Parentheses are not balanced" };
  }
  
  return { isValid: true };
};

// Parse and validate data from a CSV string
export const parseCsv = (csv: string): { headers: string[]; data: any[] } => {
  try {
    const lines = csv.split("\n");
    const headers = lines[0].split(",").map(header => header.trim());
    
    const data = lines.slice(1).map(line => {
      if (!line.trim()) return null;
      
      const values = line.split(",");
      const row: any = {};
      
      headers.forEach((header, i) => {
        let value = values[i] ? values[i].trim() : '';
        
        // Try to convert to number if possible
        if (!isNaN(Number(value)) && value !== '') {
          row[header] = Number(value);
        } else {
          row[header] = value;
        }
      });
      
      return row;
    }).filter(row => row !== null);
    
    return { headers, data };
  } catch (error) {
    toast({
      title: "Error parsing CSV",
      description: "The CSV file is not properly formatted.",
      variant: "destructive",
    });
    
    return { headers: [], data: [] };
  }
};

// Convert data for download as CSV
export const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle strings with commas
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Download content as a file
export const downloadFile = (content: string, fileName: string, contentType: string): void => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

// Sample datasets for demo purposes
export const getSampleDatasets = (): Dataset[] => {
  return [
    {
      id: 'ds-1',
      name: 'Sales Data',
      lastRefreshed: '1 hour ago',
      size: '4.2 MB',
      owner: 'John Smith',
      created: 'Jan 15, 2025',
      tables: 5,
      status: 'online',
      type: 'Import'
    },
    {
      id: 'ds-2',
      name: 'Marketing Analytics',
      lastRefreshed: '2 days ago',
      size: '1.8 MB',
      owner: 'Maria Chen',
      created: 'Mar 20, 2025',
      tables: 3,
      status: 'online',
      type: 'DirectQuery'
    },
    {
      id: 'ds-3',
      name: 'Financial Dashboard Data',
      lastRefreshed: 'Yesterday',
      size: '6.5 MB',
      owner: 'John Smith',
      created: 'Apr 5, 2025',
      tables: 8,
      status: 'online',
      type: 'Import'
    },
    {
      id: 'ds-4',
      name: 'Customer Insights',
      lastRefreshed: '3 days ago',
      size: '2.3 MB',
      owner: 'Robert Johnson',
      created: 'Mar 12, 2025',
      tables: 4,
      status: 'online',
      type: 'Composite'
    },
    {
      id: 'ds-5',
      name: 'HR Analytics',
      lastRefreshed: '5 hours ago',
      size: '1.1 MB',
      owner: 'Sarah Miller',
      created: 'Apr 18, 2025',
      tables: 2,
      status: 'scheduled',
      type: 'Import'
    }
  ];
};

// Get sample data tables for demo purposes
export const getSampleTables = (): DataTable[] => {
  return [
    {
      id: 'table-1',
      name: 'Sales',
      columns: [
        { name: 'SaleId', dataType: 'Text', isKey: true },
        { name: 'Date', dataType: 'Date', format: 'MM/DD/YYYY' },
        { name: 'ProductId', dataType: 'Text' },
        { name: 'Quantity', dataType: 'Number' },
        { name: 'UnitPrice', dataType: 'Currency' },
        { name: 'Amount', dataType: 'Currency' },
        { name: 'CustomerId', dataType: 'Text' },
      ],
      rows: 15432,
      size: '2.4 MB'
    },
    {
      id: 'table-2',
      name: 'Products',
      columns: [
        { name: 'ProductId', dataType: 'Text', isKey: true },
        { name: 'ProductName', dataType: 'Text' },
        { name: 'Category', dataType: 'Text' },
        { name: 'SubCategory', dataType: 'Text' },
        { name: 'Cost', dataType: 'Currency' },
        { name: 'Price', dataType: 'Currency' },
      ],
      rows: 520,
      size: '0.8 MB'
    },
    {
      id: 'table-3',
      name: 'Customers',
      columns: [
        { name: 'CustomerId', dataType: 'Text', isKey: true },
        { name: 'CustomerName', dataType: 'Text' },
        { name: 'Email', dataType: 'Text' },
        { name: 'City', dataType: 'Text' },
        { name: 'State', dataType: 'Text' },
        { name: 'Country', dataType: 'Text' },
        { name: 'CustomerType', dataType: 'Text' },
      ],
      rows: 3450,
      size: '1.2 MB'
    },
    {
      id: 'table-4',
      name: 'Geography',
      columns: [
        { name: 'City', dataType: 'Text' },
        { name: 'State', dataType: 'Text' },
        { name: 'Country', dataType: 'Text' },
        { name: 'Region', dataType: 'Text' },
        { name: 'Population', dataType: 'Number' },
      ],
      rows: 215,
      size: '0.3 MB'
    },
    {
      id: 'table-5',
      name: 'Calendar',
      columns: [
        { name: 'Date', dataType: 'Date', isKey: true },
        { name: 'Year', dataType: 'Number' },
        { name: 'Quarter', dataType: 'Number' },
        { name: 'Month', dataType: 'Number' },
        { name: 'MonthName', dataType: 'Text' },
        { name: 'Day', dataType: 'Number' },
        { name: 'DayOfWeek', dataType: 'Number' },
        { name: 'WeekdayName', dataType: 'Text' },
        { name: 'IsHoliday', dataType: 'Boolean' },
      ],
      rows: 1826,
      size: '0.5 MB'
    }
  ];
};

// Get sample relationships for demo purposes
export const getSampleRelationships = (): Relationship[] => {
  return [
    {
      id: 'rel-1',
      fromTable: 'Sales',
      fromColumn: 'ProductId',
      toTable: 'Products',
      toColumn: 'ProductId',
      type: 'OneToMany',
      isActive: true
    },
    {
      id: 'rel-2',
      fromTable: 'Sales',
      fromColumn: 'CustomerId',
      toTable: 'Customers',
      toColumn: 'CustomerId',
      type: 'OneToMany',
      isActive: true
    },
    {
      id: 'rel-3',
      fromTable: 'Sales',
      fromColumn: 'Date',
      toTable: 'Calendar',
      toColumn: 'Date',
      type: 'OneToMany',
      isActive: true
    },
    {
      id: 'rel-4',
      fromTable: 'Customers',
      fromColumn: 'City',
      toTable: 'Geography',
      toColumn: 'City',
      type: 'ManyToMany',
      isActive: false
    },
    {
      id: 'rel-5',
      fromTable: 'Customers',
      fromColumn: 'State',
      toTable: 'Geography',
      toColumn: 'State',
      type: 'ManyToMany',
      isActive: true
    }
  ];
};

// Get sample measures for demo purposes
export const getSampleMeasures = (): Measure[] => {
  return [
    {
      id: 'measure-1',
      name: 'Total Sales',
      expression: 'SUM(Sales[Amount])',
      table: 'Sales',
      format: 'Currency',
      description: 'Sum of all sales amounts'
    },
    {
      id: 'measure-2',
      name: 'Total Quantity',
      expression: 'SUM(Sales[Quantity])',
      table: 'Sales',
      description: 'Sum of all quantities sold'
    },
    {
      id: 'measure-3',
      name: 'Average Sale',
      expression: 'AVERAGE(Sales[Amount])',
      table: 'Sales',
      format: 'Currency'
    },
    {
      id: 'measure-4',
      name: 'Profit',
      expression: 'SUMX(Sales, Sales[Quantity] * RELATED(Products[Price]) - Sales[Quantity] * RELATED(Products[Cost]))',
      table: 'Sales',
      format: 'Currency',
      description: 'Total profit calculation based on quantity, price and cost'
    },
    {
      id: 'measure-5',
      name: 'YTD Sales',
      expression: 'TOTALYTD(SUM(Sales[Amount]), Calendar[Date])',
      table: 'Sales',
      format: 'Currency',
      description: 'Year-to-date sales calculation'
    }
  ];
};
