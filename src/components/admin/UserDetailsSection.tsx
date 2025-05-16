
import React from "react";
import { User, Record } from "@/types/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserActionsTabs } from "./UserActionsTabs";
import { UserRecordsTab } from "./UserRecordsTab";

interface UserDetailsSectionProps {
  selectedUser: User | null;
  records: Record[];
  newBalance: string;
  setNewBalance: (value: string) => void;
  handleUpdateBalance: () => void;
  newRecord: string;
  setNewRecord: (value: string) => void;
  handleAddRecord: () => void;
  onOpenResponseDialog: (record: Record) => void;
}

export const UserDetailsSection = ({
  selectedUser,
  records,
  newBalance,
  setNewBalance,
  handleUpdateBalance,
  newRecord,
  setNewRecord,
  handleAddRecord,
  onOpenResponseDialog,
}: UserDetailsSectionProps) => {
  if (!selectedUser) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Select a user from the list to view details and perform actions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
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
            <UserRecordsTab 
              selectedUser={selectedUser}
              records={records}
              onOpenResponseDialog={onOpenResponseDialog}
            />
          </TabsContent>
          
          <TabsContent value="actions" className="mt-4 space-y-4">
            <UserActionsTabs
              newBalance={newBalance}
              setNewBalance={setNewBalance}
              handleUpdateBalance={handleUpdateBalance}
              newRecord={newRecord}
              setNewRecord={setNewRecord}
              handleAddRecord={handleAddRecord}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
