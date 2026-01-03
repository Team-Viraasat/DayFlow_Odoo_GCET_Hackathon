import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Session, User } from "@supabase/supabase-js"

type Profile = {
  id: string
  email: string
  role: "admin" | "employee"
  needs_onboarding: boolean
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (loginId: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session on refresh
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  // Load profile whenever user changes
  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!error) {
        setProfile(data)
      }
    }

    loadProfile()
  }, [user])

  const signIn = async (loginIdOrEmail: string, password: string) => {
    let email = loginIdOrEmail

    // If NOT email → treat as employee login_id
    if (!loginIdOrEmail.includes("@")) {
      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("login_id", loginIdOrEmail)
        .single()

      if (error || !data) {
        throw new Error("Invalid Employee ID")
      }

      email = data.email
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error("Invalid credentials")
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, session, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
