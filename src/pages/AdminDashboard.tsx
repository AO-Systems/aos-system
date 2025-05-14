
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { User } from "@/types/auth";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const { getAllUsers, updateBalance } = useAuth();
  const { records, addRecord } = useRecords();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newBalance, setNewBalance] = useState("");
  const [newRecord, setNewRecord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const users = getAllUsers();
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setNewBalance(user.balance.toString());
    setNewRecord("");
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
                                <TableHead>Time</TableHead>
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
                                    <TableCell>
                                      {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
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
          <CardHeader>
            <CardTitle>System Records</CardTitle>
            <CardDescription>
              View all records across all users
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
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records
                    .sort((a, b) => 
                      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    )
                    .map(record => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.userName}</TableCell>
                        <TableCell>{record.userId}</TableCell>
                        <TableCell>{record.content}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
