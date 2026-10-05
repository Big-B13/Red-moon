'use client';

// This chrome only appears on Red Moon's own pages (Games, Login,
// Archive). The public front is Brian's original static portfolio,
// so these links point back to those .html pages.

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/index.html', label: 'Home', match: '/index.html' },
  { href: '/about.html', label: 'About', match: '/about.html' },
  { href: '/projects.html', label: 'Projects', match: '/projects.html' },
  { href: '/games/', label: 'Games', match: '/games/' },
  { href: '/contact.html', label: 'Contact', match: '/contact.html' },
];

export default function SiteNav() {
  const pathname = usePathname() || '/';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a href="/index.html" className="text-lg font-bold tracking-tight text-gradient">
          Brian
        </a>

        <ul className="flex items-center gap-1 text-sm">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.match);
            const external = l.href.endsWith('.html');
            const cls = `rounded-md px-3 py-1.5 transition-colors ${
              active
                ? 'bg-white/10 text-neon'
                : 'text-neutral-400 hover:text-white'
            }`;
            return (
              <li key={l.href}>
                {external ? (
                  <a href={l.href} className={cls}>
                    {l.label}
                  </a>
                ) : (
                  <Link href={l.href} className={cls}>
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
          {/* The quiet door to the Red Moon archive */}
          <li>
            <Link
              href="/login/"
              title="Red Moon"
              className="ml-2 rounded-md px-2 py-1.5 text-neutral-700 transition-colors hover:text-blood"
            >
              ●
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
