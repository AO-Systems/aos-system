
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Record } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Sample records data with status field
const INITIAL_RECORDS: Record[] = [
  { id: "rec1", userId: "user1", content: "Initial balance deposit", timestamp: "2023-01-15T10:30:00Z", status: "completed", response: "Deposit confirmed", responseTimestamp: "2023-01-15T11:45:00Z" },
  { id: "rec2", userId: "user1", content: "Monthly report submitted", timestamp: "2023-02-05T14:22:00Z", status: "completed", response: "Report reviewed and approved", responseTimestamp: "2023-02-06T09:15:00Z" },
  { id: "rec3", userId: "user2", content: "Project completion request", timestamp: "2023-02-10T09:45:00Z", status: "new" },
];

interface RecordsContextType {
  records: Record[];
  getUserRecords: (userId: string) => Record[];
  addRecord: (userId: string, content: string) => void;
  respondToRecord: (recordId: string, response: string, status: 'new' | 'in-progress' | 'completed') => void;
  updateRecordStatus: (recordId: string, status: 'new' | 'in-progress' | 'completed') => void;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export const RecordsProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<Record[]>(INITIAL_RECORDS);
  const { toast } = useToast();
  const { getAllUsers } = useAuth();

  // Add user names to records for display purposes
  useEffect(() => {
    const users = getAllUsers();
    const recordsWithNames = records.map(record => {
      const user = users.find(u => u.id === record.userId);
      return {
        ...record,
        userName: user?.name || 'Unknown User',
      };
    });
    setRecords(recordsWithNames);
  }, [getAllUsers]);

  const getUserRecords = (userId: string) => {
    return records.filter(record => record.userId === userId);
  };

  const addRecord = (userId: string, content: string) => {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    
    const newRecord: Record = {
      id: `rec${records.length + 1}${Date.now()}`, // Simple ID generation
      userId,
      content,
      timestamp: new Date().toISOString(),
      userName: user?.name || 'Unknown User',
      status: 'new',
    };
    
    setRecords(prev => [...prev, newRecord]);
    
    toast({
      title: "Record added",
      description: "Your record has been successfully added.",
    });
  };

  const respondToRecord = (recordId: string, response: string, status: 'new' | 'in-progress' | 'completed') => {
    setRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            response, 
            status,
            responseTimestamp: new Date().toISOString() 
          } 
        : record
    ));

    toast({
      title: "Response sent",
      description: "Your response has been recorded.",
    });
  };

  const updateRecordStatus = (recordId: string, status: 'new' | 'in-progress' | 'completed') => {
    setRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status } 
        : record
    ));

    toast({
      title: "Status updated",
      description: `Record status changed to ${status}.`,
    });
  };

  return (
    <RecordsContext.Provider
      value={{
        records,
        getUserRecords,
        addRecord,
        respondToRecord,
        updateRecordStatus
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecords = () => {
  const context = useContext(RecordsContext);
  if (context === undefined) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }
  return context;
};
