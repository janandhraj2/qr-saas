'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getToken()) {
      api('/api/auth/me/').then(setUser)
        .catch(() => localStorage.removeItem('jar_token'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (username, password) => {
    const d = await api('/api/auth/login/', { method: 'POST', body: { username, password }, auth: false });
    localStorage.setItem('jar_token', d.token);
    setUser(d.user);
    return d.user;
  };

  const register = async (payload) => {
    const d = await api('/api/auth/register/', { method: 'POST', body: payload, auth: false });
    localStorage.setItem('jar_token', d.token);
    setUser(d.user);
    return d.user;
  };

  const logout = () => { localStorage.removeItem('jar_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
