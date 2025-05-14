
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

// Sample users data
const USERS: User[] = [
  { id: "user1", name: "John Doe", role: "user", balance: 500 },
  { id: "user2", name: "Jane Smith", role: "user", balance: 750 },
  { id: "admin1", name: "Admin User", role: "admin", balance: 0 },
];

interface AuthContextType extends AuthState {
  login: (id: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (userId: string, newBalance: number) => void;
  getUser: (userId: string) => User | undefined;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const login = async (id: string, name: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = USERS.find(u => u.id === id && u.name === name);
      
      if (user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        // Save to sessionStorage
        sessionStorage.setItem('emberUser', JSON.stringify(user));
        return true;
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Invalid credentials. Please try again.",
        });
        
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "An error occurred during login.",
      });
      
      toast({
        title: "Login error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    sessionStorage.removeItem('emberUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateBalance = (userId: string, newBalance: number) => {
    const updatedUsers = USERS.map(user => 
      user.id === userId ? { ...user, balance: newBalance } : user
    );
    
    // Update state if the current user is the one being modified
    if (state.user && state.user.id === userId) {
      setState(prev => ({
        ...prev,
        user: { ...prev.user!, balance: newBalance },
      }));
    }

    // In a real app, this would be an API call
    toast({
      title: "Balance updated",
      description: `User balance has been updated to ${newBalance}.`,
    });
  };

  const getUser = (userId: string) => {
    return USERS.find(user => user.id === userId);
  };

  const getAllUsers = () => {
    return [...USERS];
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateBalance,
        getUser,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
