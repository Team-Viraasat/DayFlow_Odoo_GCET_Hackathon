import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  department: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  needsOnboarding?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (emailOrId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Mock users database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'john.doe@dayflow.com',
    password: 'password123',
    name: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    phone: '+1-555-0123',
    address: '123 Main St, San Francisco, CA',
    needsOnboarding: false,
  },
  {
    id: '2',
    employeeId: 'EMP002',
    email: 'jane.smith@dayflow.com',
    password: 'password123',
    name: 'Jane Smith',
    role: 'admin',
    department: 'Human Resources',
    phone: '+1-555-0124',
    address: '456 Oak Ave, San Francisco, CA',
    needsOnboarding: false,
  },
  {
    id: '3',
    employeeId: 'EMP003',
    email: 'new.employee@dayflow.com',
    password: 'temp123',
    name: 'New Employee',
    role: 'employee',
    department: 'Marketing',
    needsOnboarding: true,
  },
  {
    id: '4',
    employeeId: 'EMP004',
    email: 'alice.johnson@dayflow.com',
    password: 'password123',
    name: 'Alice Johnson',
    role: 'employee',
    department: 'Sales',
    phone: '+1-555-0125',
    address: '789 Pine St, San Francisco, CA',
    needsOnboarding: false,
  },
  {
    id: '5',
    employeeId: 'EMP005',
    email: 'bob.wilson@dayflow.com',
    password: 'password123',
    name: 'Bob Wilson',
    role: 'employee',
    department: 'Engineering',
    phone: '+1-555-0126',
    address: '321 Elm St, San Francisco, CA',
    needsOnboarding: false,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('dayflow_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (emailOrId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check registered users first
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (registeredUsers) {
      const users = JSON.parse(registeredUsers);
      const registeredUser = users.find(
        (u: any) => (u.email === emailOrId || u.employeeId === emailOrId) && u.password === password
      );
      
      if (registeredUser) {
        const { password: _, ...userWithoutPassword } = registeredUser;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('dayflow_user', JSON.stringify(userWithoutPassword));
        return { success: true };
      }
    }

    // Fallback to mock users
    const user = MOCK_USERS.find(
      u => (u.email === emailOrId || u.employeeId === emailOrId) && u.password === password
    );

    if (!user) {
      return { success: false, error: 'Invalid credentials. Please check your Employee ID/Email and password.' };
    }

    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('dayflow_user', JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dayflow_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('dayflow_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}