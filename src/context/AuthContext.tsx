import { createContext, useContext, useState } from "react";

type Role = "admin" | "employee";

type Profile = {
  id: string;
  email: string;
  role: Role;
  needs_onboarding: boolean;
};

type AuthContextType = {
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem("demo_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const loading = false;

  const signIn = (email: string, _password: string) => {
    // SIMPLE DEMO RULES
    const role: Role = email.includes("admin") ? "admin" : "employee";

    const demoProfile: Profile = {
      id: "demo-user",
      email,
      role,
      needs_onboarding: false,
    };

    localStorage.setItem("demo_profile", JSON.stringify(demoProfile));
    setProfile(demoProfile);
  };

  const signOut = () => {
    localStorage.removeItem("demo_profile");
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
