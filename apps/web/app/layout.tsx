import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pathr — Like Strava for driving',
  description: 'Record your trips, discover scenic routes, and build a personal map',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

