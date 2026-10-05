import Link from 'next/link';
import { GAMES } from '../../lib/games';

export const metadata = { title: 'The Arcade — Brian van den Berg' };

export default function Games() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="font-mono text-xs tracking-[0.3em] text-neutral-500">
        {'// THE ARCADE'}
      </p>
      <h1 className="mt-2 text-4xl font-extrabold text-gradient">Games I built</h1>
      <p className="mt-3 max-w-2xl text-neutral-400">
        Every game here runs right in your browser — click one to play. Each is
        a self-contained build, so nothing is installed and nothing breaks.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {GAMES.map((g) => (
          <article
            key={g.slug}
            className="flex flex-col rounded-xl border border-white/10 bg-panel p-6 transition hover:border-neon/50"
          >
            <div className="text-4xl">{g.emoji}</div>
            <h2 className="mt-4 text-xl font-bold text-white">{g.title}</h2>
            <p className="mt-1 text-sm text-neon">{g.tagline}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">
              {g.description}
            </p>
            <p className="mt-3 font-mono text-[11px] text-neutral-600">{g.tech}</p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href={`/games/${g.slug}/`}
                className="rounded-lg bg-neon px-4 py-2 text-sm font-semibold text-black transition hover:bg-aqua"
              >
                ▶ Play
              </Link>
              <a
                href={g.repo}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-neutral-500 hover:text-white"
              >
                Source ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
