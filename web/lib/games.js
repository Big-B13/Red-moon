// The Arcade — every game lives as a self-contained static build
// inside /public/play/<slug>/ and is embedded through the game shell.

export const GAMES = [
  {
    slug: 'omerta',
    title: 'Omertà: The Five Boroughs, 1955',
    emoji: '🌆',
    tagline: 'Mafia strategy — Godfather II × Empire of Sin × OpenFront.io.',
    description:
      'Take turf, build safehouses and docks, bribe the precinct and move the Don’s compound. Pure single-player strategy in a single HTML file.',
    tech: 'Vanilla JS engine + custom canvas UI, bundled by a Python build script.',
    src: '/play/omerta/index.html',
    repo: 'https://github.com/Big-B13/Omerta-game',
  },
  {
    slug: 'omerta-2',
    title: 'Omertà — The Climb (1955)',
    emoji: '🕴️',
    tagline: 'Start as a soldier with one racket. Climb to Don — if the family lets you.',
    description:
      'The sequel: weekly moves, racket economics, recruitable made men with specialties, truces, hits and counting rooms against six rival families.',
    tech: 'Vanilla JS engine + New York map generator, single-file build.',
    src: '/play/omerta-2/index.html',
    repo: 'https://github.com/Big-B13/Omerta-game-2',
  },
  {
    slug: 'dnd',
    title: 'Tales of the Dungeon Master',
    emoji: '🎲',
    tagline: 'A choice-driven D&D story game. Every decision is permanent.',
    description:
      '129 branching scenes, deep character creation, real d20 mechanics and a Telltale-style Chronicle. Progress syncs through Firebase across devices.',
    tech: 'Vanilla JS + Firebase Realtime Database (project dnd-game-2, europe-west1).',
    src: '/play/dnd/index.html',
    repo: 'https://github.com/Big-B13/dnd-for-my-girl-V2',
  },
  {
    slug: 'volleyball',
    title: 'The Blind Draft — Volleyball Online',
    emoji: '🏐',
    tagline: 'Real-time multiplayer draft night for 3 captains, snake format, big reveal.',
    description:
      'Captains draft blind from their own devices — nicknames and stats only — with live picks for everyone watching and a dramatic reveal at the end.',
    tech: 'Vanilla JS + Firebase Realtime Database. (Needs its config filled in to sync.)',
    src: '/play/volleyball/index.html',
    repo: 'https://github.com/Big-B13/Volleyball-draft',
  },
];
