'use client';

import { useEffect, useState } from 'react';
import { getFirebase } from '../../lib/firebase';
import { watchEntries, addEntry, removeEntry } from '../../lib/archiveDb';
import { useArchive } from '../ArchiveShell';

const KINDS = [
  { value: 'journal', label: '📓 Journal entry' },
  { value: 'data', label: '🗃️ Data entry' },
];

const DEMO_ENTRIES = [
  {
    id: 'demo-1',
    kind: 'journal',
    title: 'The first entry under the red moon',
    about: '',
    body: 'This is where the real journal lives — the things that don’t belong on the public portfolio. Connect Firebase and this demo entry is replaced by your actual archive.',
    createdAt: null,
  },
];

export default function JournalClient() {
  const { demo } = useArchive();
  const [entries, setEntries] = useState(demo ? DEMO_ENTRIES : []);
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('journal');
  const [about, setAbout] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (demo) return;
    const fb = getFirebase();
    if (!fb) return;
    return watchEntries(fb.db, setEntries);
  }, [demo]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    const data = {
      title: title.trim() || '(untitled)',
      kind,
      about: about.trim(),
      body: body.trim(),
    };
    try {
      if (demo) {
        setEntries((prev) => [{ id: `demo-${Date.now()}`, ...data, createdAt: null }, ...prev]);
      } else {
        const fb = getFirebase();
        await addEntry(fb.db, data);
      }
      setTitle('');
      setAbout('');
      setBody('');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (demo) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      return;
    }
    const fb = getFirebase();
    await removeEntry(fb.db, id);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
      {/* New entry */}
      <form
        onSubmit={onSubmit}
        className="h-fit space-y-3 rounded-xl border border-white/10 bg-panel p-5"
      >
        <h2 className="font-bold text-white">New entry</h2>
        <div className="flex gap-2">
          {KINDS.map((k) => (
            <button
              type="button"
              key={k.value}
              onClick={() => setKind(k.value)}
              className={`rounded-md px-3 py-1.5 text-xs transition ${
                kind === k.value
                  ? 'bg-blood/25 text-ember'
                  : 'border border-white/10 text-neutral-500 hover:text-white'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
        />
        <input
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="About who? (optional — e.g. Brian, Bader…)"
          className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write it down before it fades…"
          rows={7}
          className="w-full resize-y rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm leading-relaxed text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-blood py-2.5 text-sm font-semibold text-white transition hover:bg-ember disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save entry'}
        </button>
      </form>

      {/* Entry list */}
      <div className="space-y-4">
        {entries.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-panel p-8 text-center text-sm text-neutral-500">
            Nothing here yet. The moon keeps quiet until you write.
          </p>
        )}
        {entries.map((e) => (
          <article
            key={e.id}
            className="rounded-xl border border-white/10 bg-panel p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] tracking-wider text-ember">
                  {e.kind === 'data' ? '🗃️ DATA ENTRY' : '📓 JOURNAL'}
                </span>
                <h3 className="mt-1 font-bold text-white">{e.title}</h3>
                {e.about && (
                  <p className="text-xs text-neutral-500">re: {e.about}</p>
                )}
              </div>
              <button
                onClick={() => onDelete(e.id)}
                title="Delete"
                className="text-neutral-700 transition hover:text-blood"
              >
                ✕
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
              {e.body}
            </p>
            <p className="mt-3 font-mono text-[10px] text-neutral-600">
              {e.createdAt?.toDate
                ? e.createdAt.toDate().toLocaleString('nl-NL')
                : 'just now'}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
