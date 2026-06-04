'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';

export default function Es33Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();

  const getLinkStyle = (href: string) => {
    const isActive = href === '/es33' ? pathname === '/es33' : pathname.startsWith(href);
    return {
      textDecoration: 'none',
      color: isActive ? '#000' : '#666',
      borderBottom: isActive ? '2px solid #000' : '2px solid transparent',
      padding: '4px 0',
      fontSize: '0.88rem',
      fontWeight: isActive ? '600' : '400',
      transition: 'all 0.15s',
    };
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
        color: '#222',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Minimal Navbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#000', letterSpacing: '-0.3px' }}>
            NEXT_ROUTING_LAB
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/es33" style={getLinkStyle('/es33')}>
              Dashboard
            </Link>
            <Link href="/es33/risorse/utenti" style={getLinkStyle('/es33/risorse')}>
              Risorse
            </Link>
            <Link href="/es33/impostazioni" style={getLinkStyle('/es33/impostazioni')}>
              Impostazioni
            </Link>
          </div>
        </div>
        <Link
          href="/"
          style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '0.8rem',
            border: '1px solid #e0e0e0',
            padding: '4px 10px',
            borderRadius: '4px',
            transition: 'all 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#000';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.color = '#666';
          }}
        >
          ← Home Esercizi
        </Link>
      </nav>

      {/* Main Area: Two Columns */}
      <div style={{ flex: 1, display: 'flex', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Left Column: Next.js Routing Inspector */}
        <aside
          style={{
            width: '280px',
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
            padding: '24px',
            boxSizing: 'border-box',
            fontSize: '0.82rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: '700', color: '#000' }}>
              🔍 ROUTE INSPECTOR
            </h3>
            <p style={{ color: '#666', fontSize: '0.78rem', lineHeight: '1.4' }}>
              Ispezione dello stato del router client-side in Next.js App Router.
            </p>
          </div>

          {/* Current Path */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontWeight: '600', color: '#444' }}>Pathname:</span>
            <code
              style={{
                backgroundColor: '#e8e8e8',
                padding: '6px 8px',
                borderRadius: '4px',
                color: '#111',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
              }}
            >
              {pathname}
            </code>
          </div>

          {/* Path Params */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontWeight: '600', color: '#444' }}>useParams():</span>
            <pre
              style={{
                backgroundColor: '#e8e8e8',
                padding: '6px 8px',
                borderRadius: '4px',
                color: '#111',
                fontSize: '0.72rem',
                margin: 0,
                overflowX: 'auto',
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(params, null, 2)}
            </pre>
          </div>

          {/* Explain Next Link */}
          <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
            <span style={{ fontWeight: '600', color: '#444' }}>Next.js Link System:</span>
            <p style={{ color: '#555', margin: 0, fontSize: '0.78rem' }}>
              Il componente <code>&lt;Link&gt;</code> estende il tag HTML <code>&lt;a&gt;</code> per fornire prefetching e navigazione client-side.
            </p>
            <ul style={{ margin: 0, paddingLeft: '16px', color: '#555', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Nessun caricamento dell'intera pagina (SPA behavior).</li>
              <li>Prefetch automatico delle rotte in background per prestazioni immediate.</li>
              <li>Stato del componente preservato tra le transizioni.</li>
            </ul>
          </div>
        </aside>

        {/* Right Column: Content */}
        <main
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            padding: '24px 32px',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {children}
        </main>

      </div>
    </div>
  );
}
