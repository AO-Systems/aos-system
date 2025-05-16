
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { User, Record } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { UserListSection } from "@/components/admin/UserListSection";
import { UserDetailsSection } from "@/components/admin/UserDetailsSection";
import { SystemRecordsSection } from "@/components/admin/SystemRecordsSection";
import { ResponseDialog } from "@/components/admin/ResponseDialog";

const AdminDashboard = () => {
  const { getAllUsers, updateBalance } = useAuth();
  const { records, addRecord, respondToRecord } = useRecords();
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

  return (
    <DashboardLayout requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* User List Section */}
          <UserListSection 
            users={users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
          />

          {/* User Details */}
          <div className="w-full md:w-3/5 space-y-6">
            <UserDetailsSection
              selectedUser={selectedUser}
              records={records}
              newBalance={newBalance}
              setNewBalance={setNewBalance}
              handleUpdateBalance={handleUpdateBalance}
              newRecord={newRecord}
              setNewRecord={setNewRecord}
              handleAddRecord={handleAddRecord}
              onOpenResponseDialog={handleOpenResponseDialog}
            />
          </div>
        </div>
        
        {/* All Records Section */}
        <SystemRecordsSection
          records={records}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onOpenResponseDialog={handleOpenResponseDialog}
        />
      </div>

      {/* Response Dialog */}
      <ResponseDialog
        open={responseDialogOpen}
        setOpen={setResponseDialogOpen}
        selectedRecord={selectedRecord}
        responseText={responseText}
        setResponseText={setResponseText}
        responseStatus={responseStatus}
        setResponseStatus={setResponseStatus}
        handleSubmitResponse={handleSubmitResponse}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
