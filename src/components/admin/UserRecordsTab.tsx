
import React from "react";
import { User, Record } from "@/types/auth";
import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { getStatusBadge } from "@/utils/statusBadge";

interface UserRecordsTabProps {
  selectedUser: User;
  records: Record[];
  onOpenResponseDialog: (record: Record) => void;
}

export const UserRecordsTab = ({ selectedUser, records, onOpenResponseDialog }: UserRecordsTabProps) => {
  return (
    <div className="max-h-[300px] overflow-y-auto">
      <Table>
        <TableCaption>User's request history</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records
            .filter(record => record.userId === selectedUser.id)
            .sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
            .map(record => (
              <TableRow key={record.id}>
                <TableCell>{record.content}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenResponseDialog(record);
                    }}
                  >
                    {record.response ? "Edit Response" : "Respond"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
