import './globals.css';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { AuthProvider } from '../components/AuthProvider';

export const metadata = {
  title: 'Brian van den Berg — Portfolio',
  description:
    'Creative Business student — content production, media, podcasting, and games.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-ink text-neutral-200 antialiased">
        <AuthProvider>
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
