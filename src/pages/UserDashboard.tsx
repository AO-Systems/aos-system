
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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
              View all your previous submissions and responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRecords.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {userRecords
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((record) => (
                      <AccordionItem key={record.id} value={record.id}>
                        <AccordionTrigger className="py-4 px-1 hover:no-underline">
                          <div className="flex flex-1 items-center justify-between pr-4">
                            <div className="flex-1 text-left truncate mr-4">{record.content}</div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(record.status)}
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2 pb-4 px-4 space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700">Your Request:</h4>
                              <p className="mt-1 text-gray-600">{record.content}</p>
                              <p className="mt-1 text-xs text-gray-400">
                                Submitted {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                            
                            {record.response && (
                              <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-700">Admin Response:</h4>
                                <p className="mt-1 text-gray-600">{record.response}</p>
                                {record.responseTimestamp && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    Responded {formatDistanceToNow(new Date(record.responseTimestamp), { addSuffix: true })}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No records found. Submit your first request above.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
