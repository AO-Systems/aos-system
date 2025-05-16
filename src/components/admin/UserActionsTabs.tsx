
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface UserActionsTabsProps {
  newBalance: string;
  setNewBalance: (value: string) => void;
  handleUpdateBalance: () => void;
  newRecord: string;
  setNewRecord: (value: string) => void;
  handleAddRecord: () => void;
}

export const UserActionsTabs = ({
  newBalance,
  setNewBalance,
  handleUpdateBalance,
  newRecord,
  setNewRecord,
  handleAddRecord,
}: UserActionsTabsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="balance">Update Balance</Label>
        <div className="flex mt-1.5 gap-2">
          <Input
            id="balance"
            type="number"
            step="0.01"
            value={newBalance}
            onChange={e => setNewBalance(e.target.value)}
          />
          <Button 
            className="bg-ember-600 hover:bg-ember-700"
            onClick={handleUpdateBalance}
          >
            Update
          </Button>
        </div>
      </div>
      
      <div className="pt-2">
        <Label htmlFor="record">Add Record</Label>
        <Textarea
          id="record"
          className="mt-1.5"
          placeholder="Enter record details..."
          value={newRecord}
          onChange={e => setNewRecord(e.target.value)}
          rows={3}
        />
        <Button 
          className="w-full mt-2 bg-ember-600 hover:bg-ember-700"
          onClick={handleAddRecord}
          disabled={!newRecord.trim()}
        >
          Add Record
        </Button>
      </div>
    </div>
  );
};
