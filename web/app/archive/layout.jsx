import ArchiveShell from '../../components/ArchiveShell';
import ArchiveNav from '../../components/ArchiveNav';
import SignOutButton from '../../components/SignOutButton';

export const metadata = { title: 'Red Moon — Archive' };

export default function ArchiveLayout({ children }) {
  return (
    <div className="relative">
      {/* faint red glow over the whole archive */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,59,48,0.06),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-8">
        <ArchiveShell>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.4em] text-blood">
                RED MOON
              </p>
              <h1 className="text-2xl font-extrabold">
                <span className="text-gradient-red">The Archive</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ArchiveNav />
              <SignOutButton />
            </div>
          </div>
          {children}
        </ArchiveShell>
      </div>
    </div>
  );
}
