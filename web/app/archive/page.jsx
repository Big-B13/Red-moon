import Link from 'next/link';

const SECTIONS = [
  {
    href: '/archive/journal/',
    icon: '📓',
    title: 'Journal',
    body: 'Journal entries and data entries — tagged, dated, and linkable to a person.',
  },
  {
    href: '/archive/people/',
    icon: '👥',
    title: 'People',
    body: 'Personal files — on you, and on the people in your orbit.',
  },
  {
    href: '/archive/files/',
    icon: '🗄️',
    title: 'Files & Videos',
    body: 'The link vault — unlisted YouTube videos and Drive/Dropbox files, played right here. No paid storage needed.',
  },
];

export default function ArchiveDashboard() {
  return (
    <div>
      <p className="max-w-2xl text-sm text-neutral-400">
        Everything in one place. What lives here stays behind the moon — the
        portfolio on the other side never mentions it.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-white/10 bg-panel p-6 transition hover:border-blood/50 glow-red"
          >
            <div className="text-3xl">{s.icon}</div>
            <h2 className="mt-3 font-bold text-white">{s.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{s.body}</p>
            <p className="mt-3 text-sm text-ember">Open →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
