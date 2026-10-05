'use client';

import { useEffect, useState } from 'react';
import { getFirebase } from '../../lib/firebase';
import { watchMedia, addMedia, removeMedia, parseMediaUrl } from '../../lib/archiveDb';
import { useArchive } from '../ArchiveShell';

const PROVIDER_LABEL = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  drive: 'Google Drive',
  dropbox: 'Dropbox',
  other: 'Link',
};

const DEMO_ITEMS = [
  {
    id: 'demo-1',
    title: 'Sample — how a video lands here',
    note: 'Upload to YouTube as UNLISTED, paste the link, and it plays right inside the archive. This demo clip is Big Buck Bunny (CC).',
    provider: 'youtube',
    kind: 'video',
    embed: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
    url: 'https://youtu.be/aqz-KE-bpKQ',
    createdAt: null,
  },
];

function MediaPreview({ item }) {
  if (item.provider === 'youtube' || item.provider === 'vimeo' || item.provider === 'drive') {
    if (!item.embed) return <Placeholder icon="🔗" />;
    return (
      <iframe
        src={item.embed}
        title={item.title}
        className="aspect-video w-full bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (item.kind === 'video' && item.direct) {
    return <video controls preload="metadata" src={item.direct} className="aspect-video w-full bg-black" />;
  }
  if (item.kind === 'image' && item.direct) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.direct} alt={item.title} className="aspect-video w-full object-cover" />;
  }
  if (item.kind === 'audio' && item.direct) {
    return (
      <div className="flex aspect-video items-center justify-center bg-ink p-4">
        <audio controls src={item.direct} className="w-full" />
      </div>
    );
  }
  return <Placeholder icon="📄" />;
}

function Placeholder({ icon }) {
  return (
    <div className="flex aspect-video items-center justify-center bg-ink text-4xl">
      {icon}
    </div>
  );
}

export default function FilesClient() {
  const { demo } = useArchive();
  const [items, setItems] = useState(demo ? DEMO_ITEMS : []);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (demo) return;
    const fb = getFirebase();
    if (!fb) return;
    return watchMedia(fb.db, setItems);
  }, [demo]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const parsed = parseMediaUrl(link);
    if (!parsed) {
      setError('That doesn’t look like a valid link. Paste the full URL (https://…).');
      return;
    }
    setBusy(true);
    let host = '';
    try {
      host = new URL(link.trim()).hostname.replace(/^www\./, '');
    } catch { /* parseMediaUrl already validated */ }
    const data = {
      title: title.trim() || host || '(untitled)',
      url: link.trim(),
      note: note.trim(),
      ...parsed,
    };
    try {
      if (demo) {
        setItems((prev) => [{ id: `demo-${Date.now()}`, ...data, createdAt: null }, ...prev]);
      } else {
        const fb = getFirebase();
        await addMedia(fb.db, data);
      }
      setTitle('');
      setLink('');
      setNote('');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (demo) {
      setItems((prev) => prev.filter((m) => m.id !== id));
      return;
    }
    const fb = getFirebase();
    await removeMedia(fb.db, id);
  }

  return (
    <div>
      {/* Add link */}
      <form
        onSubmit={onSubmit}
        className="mb-4 rounded-xl border border-white/10 bg-panel p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-white">Add to the vault</h2>
            <p className="mt-1 max-w-lg text-xs leading-relaxed text-neutral-500">
              Videos: upload to <strong className="text-neutral-300">YouTube as “Unlisted”</strong> and
              paste the link — it plays right here. Files: paste a{' '}
              <strong className="text-neutral-300">Google Drive</strong> (sharing:
              “anyone with the link”) or <strong className="text-neutral-300">Dropbox</strong> link.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,1.4fr]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
          />
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://youtube.com/watch?v=… or drive/dropbox link *"
            required
            className="rounded-lg border border-white/10 bg-ink px-3 py-2.5 font-mono text-xs text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
          />
        </div>
        <div className="mt-3 flex gap-3">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional — what is this, who's in it…)"
            className="flex-1 rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-blood px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember disabled:opacity-50"
          >
            {busy ? 'Adding…' : 'Add'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-blood">{error}</p>}
      </form>

      <p className="mb-8 font-mono text-[10px] text-neutral-600">
        NO STORAGE BUCKET NEEDED — links are cataloged in Firestore; the files
        themselves live on YouTube/Drive/Dropbox (all free).
      </p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <article
            key={m.id}
            className="overflow-hidden rounded-xl border border-white/10 bg-panel"
          >
            <MediaPreview item={m} />
            <div className="flex items-start justify-between gap-2 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{m.title}</p>
                {m.note && (
                  <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{m.note}</p>
                )}
                <p className="mt-1.5 font-mono text-[10px] text-neutral-600">
                  {PROVIDER_LABEL[m.provider] || 'Link'} · {m.kind.toUpperCase()}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 text-sm">
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white"
                  title="Open source"
                >
                  ↗
                </a>
                <button
                  onClick={() => onDelete(m.id)}
                  className="text-neutral-700 hover:text-blood"
                  title="Remove from vault"
                >
                  ✕
                </button>
              </div>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-panel p-8 text-center text-sm text-neutral-500 sm:col-span-2 lg:col-span-3">
            The vault is empty.
          </p>
        )}
      </div>
    </div>
  );
}
