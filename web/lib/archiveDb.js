// ── Red Moon · archive data helpers ──────────────────────────────
// Firestore layout:
//   entries/{id}   journal + data entries  { title, kind, about, body, createdAt }
//   people/{id}    personal files on Brian and others { name, relation, notes, createdAt }
//   media/{id}     the link vault          { title, url, note, provider, kind,
//                                            embed | direct, createdAt }
//
// NOTE: Firebase Storage is intentionally not used — on the free Spark
// plan new projects can't create a Storage bucket. The vault catalogs
// links (unlisted YouTube, Google Drive, Dropbox…) and plays them inline.

import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// ── entries (journal + data) ──────────────────────────────────────
export function watchEntries(db, cb) {
  const q = query(collection(db, 'entries'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export function addEntry(db, data) {
  return addDoc(collection(db, 'entries'), { ...data, createdAt: serverTimestamp() });
}

export function removeEntry(db, id) {
  return deleteDoc(doc(db, 'entries', id));
}

// ── people (personal files) ───────────────────────────────────────
export function watchPeople(db, cb) {
  const q = query(collection(db, 'people'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export function addPerson(db, data) {
  return addDoc(collection(db, 'people'), { ...data, createdAt: serverTimestamp() });
}

export function removePerson(db, id) {
  return deleteDoc(doc(db, 'people', id));
}

// ── media (the link vault) ────────────────────────────────────────
export function watchMedia(db, cb) {
  const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export function addMedia(db, data) {
  return addDoc(collection(db, 'media'), { ...data, createdAt: serverTimestamp() });
}

export function removeMedia(db, id) {
  return deleteDoc(doc(db, 'media', id));
}

function guessKind(path) {
  const p = path.toLowerCase();
  if (/\.(mp4|webm|mov|m4v)$/.test(p)) return 'video';
  if (/\.(png|jpe?g|gif|webp|avif)$/.test(p)) return 'image';
  if (/\.(mp3|wav|ogg|m4a|flac)$/.test(p)) return 'audio';
  return null;
}

/**
 * Turns a pasted link into a playable/embeddable media record.
 * Returns null when the input isn't a URL.
 *   YouTube           → iframe embed            (unlisted works!)
 *   Vimeo             → iframe embed
 *   Google Drive file → /preview iframe          (needs "anyone with link")
 *   Dropbox           → raw=1 direct bytes       (video/audio/img play inline)
 *   Direct file URL   → native <video>/<img>/<audio> by extension
 *   anything else     → plain link card
 */
export function parseMediaUrl(raw) {
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;
  const host = url.hostname.replace(/^www\./, '');

  // YouTube (watch, youtu.be, shorts, embed)
  let ytId = null;
  if (host === 'youtu.be') {
    ytId = url.pathname.slice(1).split('/')[0];
  } else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
    if (url.pathname === '/watch') ytId = url.searchParams.get('v');
    else {
      const seg = url.pathname.split('/');
      if (['shorts', 'embed', 'live'].includes(seg[1])) ytId = seg[2];
    }
  }
  if (ytId) {
    return { provider: 'youtube', kind: 'video', embed: `https://www.youtube.com/embed/${ytId}` };
  }

  // Vimeo
  if (host === 'vimeo.com') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    if (id && /^\d+$/.test(id)) {
      return { provider: 'vimeo', kind: 'video', embed: `https://player.vimeo.com/video/${id}` };
    }
  }

  // Google Drive: /file/d/{id}/view?… → preview iframe
  if (host === 'drive.google.com' || host === 'docs.google.com') {
    const parts = url.pathname.split('/');
    const d = parts.indexOf('d');
    const id = d >= 0 ? parts[d + 1] : null;
    if (id) {
      return { provider: 'drive', kind: guessKind(url.pathname) || 'file', embed: `https://drive.google.com/file/d/${id}/preview` };
    }
    return { provider: 'drive', kind: 'file', embed: null };
  }

  // Dropbox: dl=0 → raw=1 serves the actual bytes
  if (host === 'dropbox.com' || host === 'dl.dropboxusercontent.com') {
    url.searchParams.delete('dl');
    url.searchParams.set('raw', '1');
    return { provider: 'dropbox', kind: guessKind(url.pathname) || 'file', direct: url.toString() };
  }

  // Direct file or unknown page
  return { provider: 'other', kind: guessKind(url.pathname) || 'file', direct: url.toString() };
}
