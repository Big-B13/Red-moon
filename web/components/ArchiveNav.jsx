'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/archive/', label: 'Dashboard' },
  { href: '/archive/journal/', label: 'Journal' },
  { href: '/archive/people/', label: 'People' },
  { href: '/archive/files/', label: 'Files & Videos' },
];

export default function ArchiveNav() {
  const pathname = usePathname() || '';
  return (
    <nav className="flex gap-1 rounded-lg border border-white/10 bg-panel p-1 text-sm">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              active ? 'bg-blood/20 text-ember' : 'text-neutral-500 hover:text-white'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
