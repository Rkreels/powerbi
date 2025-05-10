
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface CreateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateReportDialog: React.FC<CreateReportDialogProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [reportName, setReportName] = useState("New Sales Report");
  const [datasetSelection, setDatasetSelection] = useState("sales");

  const handleCreateReport = () => {
    onClose();
    navigate('/report');
    toast({
      title: "New report created",
      description: `You are now editing ${reportName}.`,
      duration: 3000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new report</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid gap-4">
            <div>
              <label htmlFor="report-name" className="text-sm font-medium block mb-1">Report name</label>
              <input
                id="report-name"
                className="w-full p-2 border rounded-md"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="report-dataset" className="text-sm font-medium block mb-1">Dataset</label>
              <select
                id="report-dataset"
                className="w-full p-2 border rounded-md"
                value={datasetSelection}
                onChange={(e) => setDatasetSelection(e.target.value)}
              >
                <option value="sales">Sales Dataset</option>
                <option value="marketing">Marketing Dataset</option>
                <option value="finance">Finance Dataset</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Template</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                  <div className="text-xs font-medium">Sales Analysis</div>
                </div>
                <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="w-full h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded mb-2"></div>
                  <div className="text-xs font-medium">Marketing Dashboard</div>
                </div>
                <div className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer">
                  <div className="w-full h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 flex items-center justify-center">
                    <Plus size={24} className="text-gray-400" />
                  </div>
                  <div className="text-xs font-medium">Blank Report</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateReport}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportDialog;
