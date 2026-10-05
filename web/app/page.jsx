'use client';

// Project Red Moon's public front IS Brian's original portfolio —
// the complete, unmodified Website-Finallised site, which lives in
// /public as static files. This route just hands over instantly.

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.replace('/index.html');
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <p className="text-sm text-neutral-500">
        Opening the portfolio…{' '}
        <a href="/index.html" className="text-neon underline">
          continue
        </a>
      </p>
    </div>
  );
}
