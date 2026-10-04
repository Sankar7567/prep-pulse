import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PrepPulse AI — Your next move starts here',
  description: 'AI-powered career coaching, ATS resume optimization, mock interviews, and bite-sized career learning.',
  applicationName: 'PrepPulse AI',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'PrepPulse AI' }
};
export const viewport: Viewport = { themeColor: '#f7f8fc', width: 'device-width', initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
