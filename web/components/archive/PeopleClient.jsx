'use client';

import { useEffect, useState } from 'react';
import { getFirebase } from '../../lib/firebase';
import { watchPeople, addPerson, removePerson } from '../../lib/archiveDb';
import { useArchive } from '../ArchiveShell';

const DEMO_PEOPLE = [
  {
    id: 'demo-1',
    name: 'Brian van den Berg',
    relation: 'Me',
    notes: 'The first file in any archive should be your own. Everything about me — versions of myself included — collects here.',
    createdAt: null,
  },
];

export default function PeopleClient() {
  const { demo } = useArchive();
  const [people, setPeople] = useState(demo ? DEMO_PEOPLE : []);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (demo) return;
    const fb = getFirebase();
    if (!fb) return;
    return watchPeople(fb.db, setPeople);
  }, [demo]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const data = {
      name: name.trim(),
      relation: relation.trim(),
      notes: notes.trim(),
    };
    try {
      if (demo) {
        setPeople((prev) => [{ id: `demo-${Date.now()}`, ...data, createdAt: null }, ...prev]);
      } else {
        const fb = getFirebase();
        await addPerson(fb.db, data);
      }
      setName('');
      setRelation('');
      setNotes('');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (demo) {
      setPeople((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    const fb = getFirebase();
    await removePerson(fb.db, id);
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="mb-8 grid gap-3 rounded-xl border border-white/10 bg-panel p-5 sm:grid-cols-[1fr,1fr,2fr,auto]"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name *"
          className="rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
        />
        <input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="Relation (friend, family, me…)"
          className="rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes — what belongs in their file?"
          className="rounded-lg border border-white/10 bg-ink px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-blood/60"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-blood px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-white/10 bg-panel p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blood/30 bg-blood/10 text-sm font-bold text-ember">
                {p.name.slice(0, 1).toUpperCase()}
              </div>
              <button
                onClick={() => onDelete(p.id)}
                title="Delete"
                className="text-neutral-700 transition hover:text-blood"
              >
                ✕
              </button>
            </div>
            <h3 className="mt-3 font-bold text-white">{p.name}</h3>
            {p.relation && (
              <p className="font-mono text-[11px] text-ember">{p.relation}</p>
            )}
            {p.notes && (
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{p.notes}</p>
            )}
          </article>
        ))}
        {people.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-panel p-8 text-center text-sm text-neutral-500 sm:col-span-2 lg:col-span-3">
            No files on anyone yet.
          </p>
        )}
      </div>
    </div>
  );
}
