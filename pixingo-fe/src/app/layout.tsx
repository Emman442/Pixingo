import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Pixingo | AI Puzzle Arena',
  description: 'The future of puzzle games powered by AI semantic consensus.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <Providers
        >
          <main className="relative z-10">
            {children}
          </main>
          <Toaster />
        </Providers>

      </body>
    </html>
  );
}
