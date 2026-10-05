# 🔥 Red Moon — Firebase setup (15 minutes, 100% free)

One Firebase project powers the archive: **Auth** (login) and **Firestore**
(journal/data entries, people files, the link vault). Both are fully covered
by the free **Spark** plan — no credit card, no Blaze upgrade.

> **Files & videos are NOT stored in Firebase.** New Firebase projects can't
> create a Storage bucket without the Blaze plan (billing account). So the
> vault is a **link catalog**: videos live as *unlisted* uploads on YouTube,
> files on Google Drive/Dropbox, and Firestore just remembers the links and
> plays them inline. See `web/README`-section or the in-app hints.

> You already have project `dnd-game-2` for the D&D game. Red Moon gets its
> **own new project** so the private archive has its own lock.

## 1 · Create the project

1. Go to <https://console.firebase.google.com> → **Add project**
2. Name: `red-moon` → Google Analytics can stay **off** → Create

## 2 · Enable Authentication

1. Sidebar → **Build → Authentication** → **Get started**
2. Sign-in method → **Email/Password** → Enable → Save
3. Tab **Users** → **Add user** → your email + a strong password
4. **Copy the UID** shown next to your new user — you need it for the rules

## 3 · Create Firestore

1. Sidebar → **Build → Firestore Database** → **Create database**
2. Start in **production mode** → location **europe-west1** (Belgium) → Enable

## 4 · Skip Storage ❌

Don't create Cloud Storage — that's the paid-billing part we route around
with the link vault. (`storage.rules` is kept in this folder only in case
you ever upgrade to Blaze and want real uploads.)

## 5 · Register the web app & get your config

1. Project overview → ⚙️ **Project settings** → **Your apps** → **`</>` Web**
2. Nickname `red-moon-web` (Hosting checkbox optional) → Register
3. Copy the config values into `web/.env.local`
   (copy `web/.env.local.example` and fill it in)
4. Restart `npm run dev`

## 6 · Deploy the security rules

In `firestore.rules`, replace `PASTE_YOUR_UID_HERE` with the UID from
step 2. Then either:

- **Paste it in the console** (Firestore → Rules tab → Publish), or
- Use the CLI from this folder:

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # pick the red-moon project
firebase deploy --only firestore:rules
```

## 7 · Test

1. `npm run dev` → click the faint **●** in the nav → log in
2. The archive should now save real entries
3. Signed out? `/archive/` should push you back to `/login/`

## Data map

| Where | What |
|---|---|
| Firestore `entries` | journal + data entries (`title, kind, about, body, createdAt`) |
| Firestore `people` | personal files (`name, relation, notes, createdAt`) |
| Firestore `media` | the link vault (`title, url, note, provider, kind, embed/direct, createdAt`) |
| YouTube (unlisted) | the actual videos — free, plays inside the archive |
| Google Drive / Dropbox | the actual files — free tiers, linked from the vault |

## How to add a video (once live)

1. Upload the video on YouTube → visibility **Unlisted** (not Private,
   not Public)
2. Copy the link → archive → **Files & Videos** → paste → Add
3. It now plays inside the vault. Only people who can log in ever see the
   link exists.
