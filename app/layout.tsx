import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Board Scraper',
  description: 'A tool to scrape job listings from various remote job boards',
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