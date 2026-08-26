import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('pc_store_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('pc_store_token') || '');
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const savedToken = localStorage.getItem('pc_store_token');
      const headers = {};
      if (savedToken) {
        headers['Authorization'] = `Bearer ${savedToken}`;
      }
      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('pc_store_user', JSON.stringify(data.user));
          if (data.token) {
            setToken(data.token);
            localStorage.setItem('pc_store_token', data.token);
          }
        } else {
          // If server says no session but we have a user cached, don't immediately clear unless 401
        }
      }
    } catch (err) {
      console.error('Failed to check auth state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrEmail, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('pc_store_token', data.token);
    }
    localStorage.setItem('pc_store_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setUser(data.user);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('pc_store_token', data.token);
    }
    localStorage.setItem('pc_store_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setToken('');
    localStorage.removeItem('pc_store_token');
    localStorage.removeItem('pc_store_user');
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('pc_store_user', JSON.stringify(merged));
      return merged;
    });
  };

  const isAdmin = user && (user.role === 'admin' || user.is_admin === 1 || user.is_admin === true);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      refreshUser: fetchCurrentUser,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

