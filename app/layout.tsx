import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { GameProvider } from '@/context/GameContext';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Historical Proximity',
  description:
    'A daily puzzle game about historical time. Place events on the timeline — how close can you get?',
  openGraph: {
    title: 'Historical Proximity',
    description: 'A daily historical timeline puzzle game.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        overscroll-none on body prevents iOS/Android pull-to-refresh
        which was triggering page reload when dragging the slider upward.
      */}
      <body className="overscroll-none">
        <ThemeProvider>
          <GameProvider>
            <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
              <Header />
              {/* px-4 sm:px-6 gives comfortable side padding on all screen sizes */}
              <main className="flex-1 flex flex-col items-center px-4 sm:px-6">
                {children}
              </main>
            </div>
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
