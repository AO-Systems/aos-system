
export interface User {
  id: string;
  name: string;
  role: 'user' | 'admin';
  balance: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Record {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  userName?: string;
  status: 'new' | 'in-progress' | 'completed';
  response?: string;
  responseTimestamp?: string;
}
