'use client';

import Link from 'next/link';
import { mockUsers, mockActivities } from './data/mockData';

export default function DashboardPage() {
  const latestUsers = [...mockUsers]
    .sort((a, b) => b.joinDate.localeCompare(a.joinDate))
    .slice(0, 5);

  const latestActivities = [...mockActivities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#000', margin: '0 0 8px 0' }}>
          Dashboard Risorse
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#666', margin: 0, lineHeight: '1.5' }}>
          Questo pannello riassume le risorse del sistema. Tutti i collegamenti sottostanti utilizzano il client-side routing di Next.js (<code>&lt;Link&gt;</code>) per navigare istantaneamente.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        
        {/* Utenti Recenti */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#000', margin: 0 }}>
              Utenti Recenti
            </h2>
            <Link href="/es33/risorse/utenti" style={{ fontSize: '0.78rem', color: '#0066cc', textDecoration: 'none' }}>
              Vedi tutti →
            </Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '6px 4px', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '6px 4px', fontWeight: '600' }}>Nome</th>
                <th style={{ padding: '6px 4px', fontWeight: '600' }}>Next.js Link</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px 4px', color: '#666', fontFamily: 'monospace' }}>{user.id}</td>
                  <td style={{ padding: '8px 4px', fontWeight: '500' }}>{user.fullName}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <Link
                      href={`/es33/risorse/utenti/${user.id}`}
                      style={{
                        color: '#0066cc',
                        textDecoration: 'none',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                      }}
                    >
                      /utenti/{user.id}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attività Recenti */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#000', margin: 0 }}>
              Attività Recenti
            </h2>
            <Link href="/es33/risorse/attivita" style={{ fontSize: '0.78rem', color: '#0066cc', textDecoration: 'none' }}>
              Vedi tutte →
            </Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '6px 4px', fontWeight: '600' }}>Codice</th>
                <th style={{ padding: '6px 4px', fontWeight: '600' }}>Titolo</th>
                <th style={{ padding: '6px 4px', fontWeight: '600' }}>Next.js Link</th>
              </tr>
            </thead>
            <tbody>
              {latestActivities.map((act) => (
                <tr key={act.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px 4px', color: '#666', fontFamily: 'monospace' }}>{act.id}</td>
                  <td style={{ padding: '8px 4px', fontWeight: '500' }}>{act.title}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <Link
                      href={`/es33/risorse/attivita/${act.id}`}
                      style={{
                        color: '#0066cc',
                        textDecoration: 'none',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                      }}
                    >
                      /attivita/{act.id}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
