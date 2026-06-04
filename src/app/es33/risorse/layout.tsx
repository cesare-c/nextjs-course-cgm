'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RisorseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getTabStyle = (href: string) => {
    const isActive = pathname.startsWith(href);
    return {
      textDecoration: 'none',
      color: isActive ? '#000' : '#666',
      padding: '8px 12px',
      fontSize: '0.85rem',
      fontWeight: isActive ? '600' : '400',
      borderBottom: isActive ? '2px solid #000' : '2px solid transparent',
      transition: 'all 0.15s ease',
      display: 'inline-block',
      boxSizing: 'border-box' as const,
    };
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Tabs Menu */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          borderBottom: '1px solid #eee',
          marginBottom: '20px',
        }}
      >
        <Link href="/es33/risorse/utenti" style={getTabStyle('/es33/risorse/utenti')}>
          Utenti
        </Link>
        <Link href="/es33/risorse/attivita" style={getTabStyle('/es33/risorse/attivita')}>
          Attività
        </Link>
      </div>

      {/* Nested Route Pages */}
      <div>{children}</div>
    </div>
  );
}
