
import React from "react";
import { Record } from "@/types/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStatusBadge } from "@/utils/statusBadge";

interface SystemRecordsSectionProps {
  records: Record[];
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onOpenResponseDialog: (record: Record) => void;
}

export const SystemRecordsSection = ({
  records,
  statusFilter,
  setStatusFilter,
  onOpenResponseDialog,
}: SystemRecordsSectionProps) => {
  const filteredRecords = React.useMemo(() => {
    let filtered = records;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [records, statusFilter]);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle>System Records</CardTitle>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          View and respond to all records across all users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>AOID</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map(record => (
                <TableRow key={record.id} className={record.status === 'new' ? 'bg-blue-50' : ''}>
                  <TableCell className="font-medium">{record.userName}</TableCell>
                  <TableCell>{record.userId}</TableCell>
                  <TableCell>
                    {record.content}
                    {record.response && (
                      <div className="mt-1 text-xs text-gray-500 italic">
                        Response: {record.response.substring(0, 30)}{record.response.length > 30 ? '...' : ''}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onOpenResponseDialog(record)}
                    >
                      {record.response ? "Edit Response" : "Respond"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
