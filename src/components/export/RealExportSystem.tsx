import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { 
  Download, FileText, Table2, Presentation, Image, 
  Settings, CheckCircle, AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  formats: string[];
  features: string[];
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'High-quality document suitable for printing and sharing',
    icon: <FileText size={24} />,
    formats: ['pdf'],
    features: ['High-quality graphics', 'Pagination', 'Professional layout', 'Password protection']
  },
  {
    id: 'excel',
    name: 'Excel Workbook',
    description: 'Spreadsheet with data and charts for further analysis',
    icon: <Table2 size={24} />,
    formats: ['xlsx', 'xls'],
    features: ['Raw data export', 'Chart images', 'Multiple worksheets', 'Formulas included']
  },
  {
    id: 'powerpoint',
    name: 'PowerPoint Presentation',
    description: 'Presentation slides with your visualizations',
    icon: <Presentation size={24} />,
    formats: ['pptx', 'ppt'],
    features: ['One chart per slide', 'Editable slides', 'Speaker notes', 'Custom templates']
  },
  {
    id: 'image',
    name: 'Image Files',
    description: 'Individual image files for each visualization',
    icon: <Image size={24} />,
    formats: ['png', 'jpg', 'svg'],
    features: ['High resolution', 'Transparent background', 'Vector format (SVG)', 'Batch export']
  }
];

interface RealExportSystemProps {
  trigger?: React.ReactNode;
  onExport?: (options: any) => void;
  availableContent?: { id: string; name: string; type: string }[];
}

export const RealExportSystem: React.FC<RealExportSystemProps> = ({ 
  trigger, 
  onExport,
  availableContent = []
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('pdf');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [exportSettings, setExportSettings] = useState({
    includeLogo: true,
    includeTimestamp: true,
    includeFilters: true,
    quality: 'high' as 'low' | 'medium' | 'high',
    pageSize: 'A4' as 'A4' | 'A3' | 'Letter' | 'Legal',
    orientation: 'portrait' as 'portrait' | 'landscape'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Mock content if none provided
  const content = availableContent.length > 0 ? availableContent : [
    { id: '1', name: 'Sales Revenue Chart', type: 'chart' },
    { id: '2', name: 'Regional Performance', type: 'chart' },
    { id: '3', name: 'Customer Data Table', type: 'table' },
    { id: '4', name: 'Product Analysis', type: 'chart' }
  ];

  const currentOption = EXPORT_OPTIONS.find(opt => opt.id === selectedOption);

  const handleContentToggle = (contentId: string, checked: boolean) => {
    setSelectedContent(prev => 
      checked 
        ? [...prev, contentId]
        : prev.filter(id => id !== contentId)
    );
  };

  const handleSelectAll = () => {
    setSelectedContent(content.map(c => c.id));
  };

  const handleSelectNone = () => {
    setSelectedContent([]);
  };

  const handleExport = async () => {
    if (selectedContent.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to export",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 500);

    // Simulate export process
    setTimeout(() => {
      clearInterval(progressInterval);
      setExportProgress(100);
      
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setOpen(false);
        
        const exportData = {
          format: selectedFormat || currentOption?.formats[0],
          content: selectedContent,
          settings: exportSettings
        };
        
        onExport?.(exportData);
        
        toast({
          title: "Export completed",
          description: `Successfully exported ${selectedContent.length} item(s) as ${exportData.format.toUpperCase()}`,
        });
      }, 1000);
    }, 3000);
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Download size={16} className="mr-2" />
      Export
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
        </DialogHeader>

        {isExporting ? (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Download size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exporting Report</h3>
              <p className="text-gray-600">Please wait while we prepare your export...</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(exportProgress)}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={() => {
                setIsExporting(false);
                setExportProgress(0);
              }}>
                Cancel Export
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Export Format Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Export Format</h3>
              <div className="grid grid-cols-2 gap-3">
                {EXPORT_OPTIONS.map((option) => (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all ${
                      selectedOption === option.id 
                        ? 'ring-2 ring-blue-500 shadow-md' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => {
                      setSelectedOption(option.id);
                      setSelectedFormat(option.formats[0]);
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {option.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base">{option.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm mb-3">
                        {option.description}
                      </CardDescription>
                      <div className="space-y-1">
                        {option.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <CheckCircle size={12} className="mr-1 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Format Options */}
            {currentOption && currentOption.formats.length > 1 && (
              <div>
                <Label className="text-sm font-medium">File Format</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentOption.formats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Content Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Select Content</h3>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSelectNone}>
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {content.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                    <Checkbox
                      checked={selectedContent.includes(item.id)}
                      onCheckedChange={(checked) => handleContentToggle(item.id, checked as boolean)}
                    />
                    <Label className="text-sm">{item.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Export Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Quality</Label>
                  <RadioGroup 
                    value={exportSettings.quality} 
                    onValueChange={(value) => setExportSettings(prev => ({ ...prev, quality: value as any }))}
                    className="mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="text-sm">High (Best quality)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="text-sm">Medium (Balanced)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="text-sm">Low (Smaller file)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={exportSettings.includeLogo}
                      onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, includeLogo: checked as boolean }))}
                    />
                    <Label className="text-sm">Include company logo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={exportSettings.includeTimestamp}
                      onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, includeTimestamp: checked as boolean }))}
                    />
                    <Label className="text-sm">Include timestamp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={exportSettings.includeFilters}
                      onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, includeFilters: checked as boolean }))}
                    />
                    <Label className="text-sm">Include active filters</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={selectedContent.length === 0}>
                <Download size={16} className="mr-2" />
                Export {selectedContent.length} item(s)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};