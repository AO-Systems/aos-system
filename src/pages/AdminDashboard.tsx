
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { User, Record } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { getAllUsers, updateBalance } = useAuth();
  const { records, addRecord, respondToRecord, updateRecordStatus } = useRecords();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [newBalance, setNewBalance] = useState("");
  const [newRecord, setNewRecord] = useState("");
  const [responseText, setResponseText] = useState("");
  const [responseStatus, setResponseStatus] = useState<'new' | 'in-progress' | 'completed'>('completed');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);

  const users = getAllUsers();
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecords = useMemo(() => {
    let filtered = records;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [records, statusFilter]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setNewBalance(user.balance.toString());
    setNewRecord("");
    setSelectedRecord(null);
  };

  const handleUpdateBalance = () => {
    if (!selectedUser || !newBalance.trim()) return;
    
    const balance = parseFloat(newBalance);
    
    if (isNaN(balance)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
      return;
    }
    
    updateBalance(selectedUser.id, balance);
    
    // Update local selectedUser state
    setSelectedUser({ ...selectedUser, balance });
    
    toast({
      title: "Balance Updated",
      description: `${selectedUser.name}'s balance has been updated to $${balance.toFixed(2)}`,
    });
  };

  const handleAddRecord = () => {
    if (!selectedUser || !newRecord.trim()) return;
    
    addRecord(selectedUser.id, newRecord);
    setNewRecord("");
    
    toast({
      title: "Record Added",
      description: `Record added for ${selectedUser.name}.`,
    });
  };

  const handleOpenResponseDialog = (record: Record) => {
    setSelectedRecord(record);
    setResponseText(record.response || "");
    setResponseStatus(record.status);
    setResponseDialogOpen(true);
  };

  const handleSubmitResponse = () => {
    if (!selectedRecord || !responseText.trim()) return;
    
    respondToRecord(selectedRecord.id, responseText, responseStatus);
    setResponseDialogOpen(false);
    
    toast({
      title: "Response Sent",
      description: `Your response to ${selectedRecord.userName} has been sent.`,
    });
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

  return (
    <DashboardLayout requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* User List Section */}
          <Card className="w-full md:w-2/5">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all system users
              </CardDescription>
              <div className="pt-2">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>AOID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow 
                      key={user.id} 
                      className={
                        selectedUser?.id === user.id 
                        ? "bg-ember-50 cursor-pointer" 
                        : "cursor-pointer hover:bg-gray-50"
                      }
                      onClick={() => handleSelectUser(user)}
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-ember-100 text-ember-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>${user.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* User Details */}
          <div className="w-full md:w-3/5 space-y-6">
            {selectedUser ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedUser.name}</CardTitle>
                        <CardDescription>
                          AOID: {selectedUser.id} | Role: {selectedUser.role}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className="text-2xl font-bold">${selectedUser.balance.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="records">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="records">User Records</TabsTrigger>
                        <TabsTrigger value="actions">Admin Actions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="records" className="mt-4 space-y-4">
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
                                          handleOpenResponseDialog(record);
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
                      </TabsContent>
                      
                      <TabsContent value="actions" className="mt-4 space-y-4">
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
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Select a user from the list to view details and perform actions
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* All Records Section */}
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
                          onClick={() => handleOpenResponseDialog(record)}
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
      </div>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
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
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitResponse} disabled={!responseText.trim()}>
              Submit Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;
