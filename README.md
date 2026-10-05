# 🌙 Project Red Moon

**One site, two faces.** The public face is Brian's school portfolio — with a new
arcade wing showing his games. The hidden face: behind a login sits a private
archive of journal entries, data entries, personal files (on himself and
others), and videos — backed by one Firebase project.

> The portfolio never links to the archive. The only door is the faint **●**
> in the navigation bar and footer.

## What got combined

| Source repo | Became |
|---|---|
| `Big-B01/Website-Finallised-` (portfolio) | **IS the front** — the complete original site served untouched from `/public` (all 11 pages: index, about, projects, contact, bigb\*, poetry, internship, posters + every image + Audio). Red Moon adds just two nav items: **Games** and the hidden **●** |
| `Big-B13/Omerta-game` | 🌆 playable at `/games/omerta/` |
| `Big-B13/Omerta-game-2` | 🕴️ playable at `/games/omerta-2/` |
| `Big-B13/dnd-for-my-girl-V2` | 🎲 playable at `/games/dnd/` — keeps its own Firebase saves (`dnd-game-2`) |
| `Big-B13/Volleyball-draft` | 🏐 playable at `/games/volleyball/` — needs its RTDB config filled in to sync |
| `Big-B13/Legacy` (journal experiment) | The *concept* behind the archive: journal, people files, vault — rebuilt as `/archive/` with Firebase sync (Legacy's React source lives in `repos/Legacy/source` for reference) |

## Repo layout

```
redmoon/
├── repos/                  # the original projects, untouched (reference)
├── firebase/               # ⭐ start here — setup guide + security rules
│   ├── README.md           #   15-minute Firebase walkthrough
│   ├── firebase.json
│   ├── firestore.rules     #   only the archivist's UID can read/write
│   └── storage.rules
└── web/                    # the Next.js + Tailwind app
    ├── public/             # ⭐ THE ORIGINAL PORTFOLIO, full copy
    │   ├── index.html, about.html, projects.html, contact.html,
    │   ├── bigb*.html, poetry.html, internship.html, posters…
    │   ├── style.css, bigb.css, script.js, images/, Audio/
    │   ├── play/           # the 4 games as self-contained static builds
    │   └── media/          # spare media
    ├── app/
    │   ├── page.jsx        # instant handover → /index.html
    │   ├── games/          # the Arcade (+ /games/[slug] shell)
    │   ├── login/          # the door (●)
    │   └── archive/        # dashboard · journal · people · link vault
    ├── components/ lib/    # the Red Moon machinery (nav, auth, archive)
    └── .env.local          # your Firebase config (filled ✓)
```

## Run it

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

Until `.env.local` is filled in, `/archive/` runs in **demo mode** so the UI
can be explored without a backend. Follow `firebase/README.md` to make it real.

## Deploy it

The app is a static export (`output: 'export'`), so it can live on
**GitHub Pages** or **Firebase Hosting**:

```bash
cd web
npm run build      # → writes web/out/
```

Deploy `web/out/` anywhere static files are served. Firebase env values go in
`.env.local` before building (they get baked into the bundle — normal for
Firebase web apps; the *rules* are the security).

## Status & next steps

- [x] Full skeleton: public portfolio + arcade + login + archive (demo mode)
- [x] Files & Videos = link vault (unlisted YouTube / Drive / Dropbox) — Storage needs paid billing, so no uploads live in Firebase
- [ ] Firebase project created, `.env.local` filled, rules deployed with UID
- [ ] Port Legacy's deeper features (encrypted secrets, voice notes, prompts)
- [ ] Poetry/BigB alter-ego pages from the old portfolio
- [ ] Gallery content for school modules (posters, internship evidence)
- [ ] Fill Volleyball-draft's Firebase config so draft sync works
- [ ] Pick the host (Pages vs Firebase Hosting) & deploy
