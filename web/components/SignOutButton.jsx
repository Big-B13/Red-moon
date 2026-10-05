'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getFirebase } from '../lib/firebase';
import { useArchive } from './ArchiveShell';

export default function SignOutButton() {
  const { user } = useArchive();
  const router = useRouter();

  if (!user) return null; // demo mode — nothing to sign out of

  return (
    <button
      onClick={async () => {
        const fb = getFirebase();
        if (fb) await signOut(fb.auth);
        router.replace('/');
      }}
      className="rounded-md border border-blood/40 px-3 py-1.5 text-xs text-ember transition hover:bg-blood/10"
    >
      Sign out
    </button>
  );
}
