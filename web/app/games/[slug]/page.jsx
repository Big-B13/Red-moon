import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GAMES } from '../../../lib/games';

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export default function GamePage({ params }) {
  const game = GAMES.find((g) => g.slug === params.slug);
  if (!game) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/games/" className="text-sm text-neutral-500 hover:text-neon">
            ← Arcade
          </Link>
          <h1 className="text-lg font-bold text-white">
            {game.emoji} {game.title}
          </h1>
        </div>
        <div className="flex gap-4 text-sm">
          <a href={game.src} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neon">
            Open fullscreen ↗
          </a>
          <a href={game.repo} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white">
            Source ↗
          </a>
        </div>
      </div>

      <iframe
        src={game.src}
        title={game.title}
        className="h-[calc(100dvh-12rem)] min-h-[480px] w-full rounded-xl border border-white/10 bg-black"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
