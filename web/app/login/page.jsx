'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebase } from '../../lib/firebase';
import { useAuth } from '../../components/AuthProvider';

export default function Login() {
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace('/archive/');
  }, [user, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const fb = getFirebase();
      await signInWithEmailAndPassword(fb.auth, email, password);
      router.replace('/archive/');
    } catch (err) {
      setError('Access denied. Wrong credentials — the moon does not open.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24">
      <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full border border-blood/40 bg-[radial-gradient(circle_at_35%_35%,rgba(255,94,77,0.35),rgba(139,0,15,0.15))] text-4xl glow-red">
        🌙
      </div>
      <p className="font-mono text-[10px] tracking-[0.4em] text-blood">RED MOON</p>
      <h1 className="mt-2 text-2xl font-extrabold text-white">Identify yourself</h1>

      {!configured ? (
        <div className="mt-8 w-full rounded-xl border border-white/10 bg-panel p-6 text-sm text-neutral-400">
          <p className="font-semibold text-neutral-200">Firebase isn’t connected yet.</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed">
            <li>Create the Firebase project (Auth + Firestore + Storage).</li>
            <li>
              Copy <code className="text-ember">.env.local.example</code> →{' '}
              <code className="text-ember">.env.local</code> and fill in your config.
            </li>
            <li>Restart the dev server, then come back here.</li>
          </ol>
          <Link
            href="/archive/"
            className="mt-4 inline-block text-xs text-ember hover:underline"
          >
            …or preview the archive in demo mode →
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 w-full space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-panel px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-panel px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
          />
          {error && <p className="text-xs text-blood">{error}</p>}
          <button
            type="submit"
            disabled={busy || loading}
            className="w-full rounded-lg bg-blood py-3 text-sm font-semibold text-white transition hover:bg-ember disabled:opacity-50"
          >
            {busy ? 'Opening…' : 'Enter the archive'}
          </button>
          <p className="text-center text-[11px] text-neutral-600">
            No sign-up here. Accounts are created by the archivist (you) in the
            Firebase console.
          </p>
        </form>
      )}
    </div>
  );
}
