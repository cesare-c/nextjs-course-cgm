import type { Metadata } from 'next';
import '../index.css';
import '../App.css';

export const metadata: Metadata = {
  title: 'Cesare Dev - Corso React & Next.js',
  description: 'Progetto didattico di sviluppo React, TypeScript e Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
