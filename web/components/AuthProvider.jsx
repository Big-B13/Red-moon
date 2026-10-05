'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebase, firebaseConfigured } from '../lib/firebase';

const AuthCtx = createContext({
  user: null,
  loading: true,
  configured: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    const fb = getFirebase();
    if (!fb) return; // demo mode until .env.local is filled in
    return onAuthStateChanged(fb.auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, configured: firebaseConfigured }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
