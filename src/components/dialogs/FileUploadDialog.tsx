import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Database } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ isOpen, onClose }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been processed and is ready to use`,
        });
        onClose();
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Data File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg mb-2">Drag and drop your file here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <input
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button asChild disabled={uploading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploading ? 'Uploading...' : 'Choose File'}
              </label>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <FileText className="mx-auto mb-2 text-green-600" />
              <p className="text-xs">CSV Files</p>
            </div>
            <div>
              <Database className="mx-auto mb-2 text-blue-600" />
              <p className="text-xs">Excel Files</p>
            </div>
            <div>
              <FileText className="mx-auto mb-2 text-orange-600" />
              <p className="text-xs">JSON Files</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};