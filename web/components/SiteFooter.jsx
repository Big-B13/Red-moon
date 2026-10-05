import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-xs text-neutral-500">
      <p>© 2026 Brian “BigB” van den Berg · Portfolio built with Red Moon</p>
      <p className="mt-2">
        <a
          href="https://github.com/Big-B13"
          target="_blank"
          rel="noreferrer"
          className="hover:text-neon"
        >
          GitHub
        </a>
        <span className="mx-2 text-neutral-700">·</span>
        <Link href="/login/" className="text-neutral-700 hover:text-blood" title="Red Moon">
          ● under the red moon
        </Link>
      </p>
    </footer>
  );
}
