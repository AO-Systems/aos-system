
import React from "react";
import { Record } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";

interface ResponseDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRecord: Record | null;
  responseText: string;
  setResponseText: (text: string) => void;
  responseStatus: 'new' | 'in-progress' | 'completed';
  setResponseStatus: (status: 'new' | 'in-progress' | 'completed') => void;
  handleSubmitResponse: () => void;
}

export const ResponseDialog = ({
  open,
  setOpen,
  selectedRecord,
  responseText,
  setResponseText,
  responseStatus,
  setResponseStatus,
  handleSubmitResponse,
}: ResponseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Respond to Request</DialogTitle>
          <DialogDescription>
            {selectedRecord?.userName}'s request from {selectedRecord ? formatDistanceToNow(new Date(selectedRecord.timestamp), { addSuffix: true }) : ''}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-600">{selectedRecord?.content}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="response">Your Response</Label>
            <Textarea
              id="response"
              placeholder="Enter your response..."
              className="min-h-[120px]"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Update Status</Label>
            <Select
              value={responseStatus}
              onValueChange={(value) => setResponseStatus(value as 'new' | 'in-progress' | 'completed')}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitResponse} disabled={!responseText.trim()}>
            Submit Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
