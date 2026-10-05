'use client';

// The door to the Red Moon archive.
//  - Firebase configured + signed in  → real archive
//  - Firebase configured + signed out → redirect to /login
//  - Not configured yet               → setup notice + optional demo preview

import { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

const ArchiveCtx = createContext({ user: null, demo: false });
export const useArchive = () => useContext(ArchiveCtx);

export function DemoBanner() {
  return (
    <div className="mb-6 rounded-lg border border-blood/40 bg-blood/10 px-4 py-2.5 text-xs text-ember">
      ⚠ Demo mode — Firebase isn’t connected yet, so nothing here is saved.
      Fill in <code className="font-mono">.env.local</code> to make the archive real.
    </div>
  );
}

export default function ArchiveShell({ children }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (configured && !loading && !user) router.replace('/login/');
  }, [configured, loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-32 text-sm text-neutral-500">
        Checking the moon…
      </div>
    );
  }

  if (!user && !demo) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-blood/40 bg-blood/10 text-3xl glow-red">
          🌕
        </div>
        <h1 className="text-xl font-bold text-white">This area is private</h1>
        <p className="mt-2 text-sm text-neutral-400">
          {configured
            ? 'Redirecting you to login…'
            : 'The archive behind the red moon is not wired to Firebase yet. Set it up to unlock it for real — or take a look around in demo mode.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {configured ? (
            <Link
              href="/login/"
              className="rounded-lg bg-blood px-5 py-2.5 text-sm font-semibold text-white hover:bg-ember"
            >
              Go to login
            </Link>
          ) : (
            <>
              <button
                onClick={() => setDemo(true)}
                className="rounded-lg bg-blood px-5 py-2.5 text-sm font-semibold text-white hover:bg-ember"
              >
                Preview demo
              </button>
              <Link
                href="/login/"
                className="rounded-lg border border-white/15 px-5 py-2.5 text-sm text-neutral-300 hover:border-white/30"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <ArchiveCtx.Provider value={{ user, demo: !user }}>
      {!user && <DemoBanner />}
      {children}
    </ArchiveCtx.Provider>
  );
}
