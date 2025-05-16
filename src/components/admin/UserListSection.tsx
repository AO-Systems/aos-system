
import React from "react";
import { User } from "@/types/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface UserListSectionProps {
  users: User[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export const UserListSection = ({
  users,
  searchTerm,
  setSearchTerm,
  selectedUser,
  onSelectUser,
}: UserListSectionProps) => {
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                onClick={() => onSelectUser(user)}
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
  );
};
