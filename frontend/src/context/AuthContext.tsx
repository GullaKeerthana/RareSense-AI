import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import type { Token, UserPublic, UserRole } from '../api/types'

interface AuthContextValue {
  user: UserPublic | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<UserPublic>
  register: (fullName: string, email: string, password: string, role: UserRole) => Promise<UserPublic>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function loadStoredUser(): UserPublic | null {
  const raw = localStorage.getItem('raresense_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserPublic
  } catch {
    return null
  }
}

function persistSession(token: Token) {
  localStorage.setItem('raresense_token', token.access_token)
  localStorage.setItem('raresense_user', JSON.stringify(token.user))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(loadStoredUser)

  const login = async (email: string, password: string) => {
    const { data } = await api.post<Token>('/auth/login', { email, password })
    persistSession(data)
    setUser(data.user)
    return data.user
  }

  const register = async (fullName: string, email: string, password: string, role: UserRole) => {
    const { data } = await api.post<Token>('/auth/register', {
      full_name: fullName,
      email,
      password,
      role,
    })
    persistSession(data)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('raresense_token')
    localStorage.removeItem('raresense_user')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
