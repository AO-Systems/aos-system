
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

const UserDashboard = () => {
  const { user } = useAuth();
  const { getUserRecords, addRecord } = useRecords();
  const [newRequest, setNewRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRecords = user ? getUserRecords(user.id) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newRequest.trim()) return;
    
    setIsSubmitting(true);
    
    // Add new record
    addRecord(user.id, newRequest);
    
    // Reset form
    setNewRequest("");
    setIsSubmitting(false);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>Welcome, {user.name}</CardTitle>
              <CardDescription>
                Access your records and submit new requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Your current balance</p>
                  <p className="text-3xl font-bold">${user.balance.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Records submitted</p>
                  <p className="text-3xl font-bold text-center">{userRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit New Request */}
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle>Submit Request</CardTitle>
              <CardDescription>
                Create a new record or request
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="request">Request Details</Label>
                  <Textarea
                    id="request"
                    placeholder="Enter your request details..."
                    value={newRequest}
                    onChange={(e) => setNewRequest(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-ember-600 hover:bg-ember-700" 
                  disabled={isSubmitting}
                >
                  Submit Request
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Request History</CardTitle>
            <CardDescription>
              View all your previous submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your recent requests</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRecords.length > 0 ? (
                  userRecords.sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  ).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.content}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                      No records found. Submit your first request above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
