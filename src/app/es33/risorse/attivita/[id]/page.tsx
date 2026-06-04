'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockActivities, mockUsers } from '../../../data/mockData';

export default function ActivityDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const act = mockActivities.find((a) => a.id === id);
  const user = act ? mockUsers.find((u) => u.id === act.assignedUserId) : null;

  if (!act) {
    return (
      <div style={{ padding: '20px', border: '1px dashed #ccc', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#ff0000' }}>Attività non trovata</h3>
        <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '16px' }}>L'attività #{params?.id} non esiste nel database statico.</p>
        <Link href="/es33/risorse/attivita" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.82rem' }}>
          Torna alla Lista
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.85rem' }}>
      <Link href="/es33/risorse/attivita" style={{ color: '#666', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Torna alla lista attività
      </Link>

      <h1 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 16px 0', color: '#000' }}>
        Scheda Attività
      </h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600', width: '150px' }}>Codice Attività:</td>
            <td style={{ padding: '10px 0', fontFamily: 'monospace' }}>{act.id}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Titolo:</td>
            <td style={{ padding: '10px 0' }}>{act.title}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Stato:</td>
            <td style={{ padding: '10px 0', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700' }}>
              {act.status}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Descrizione:</td>
            <td style={{ padding: '10px 0', lineHeight: '1.4', color: '#333' }}>{act.description}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Data Creazione:</td>
            <td style={{ padding: '10px 0', color: '#555' }}>{act.date}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Tempo Impiegato:</td>
            <td style={{ padding: '10px 0', color: '#555' }}>{act.duration}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Assegnato a:</td>
            <td style={{ padding: '10px 0' }}>
              {user ? (
                <Link
                  href={`/es33/risorse/utenti/${user.id}`}
                  style={{
                    color: '#0066cc',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  {user.fullName} ({user.role})
                </Link>
              ) : (
                'Non assegnato'
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Dynamic Routing Notes */}
      <div style={{ backgroundColor: '#fcfcfc', border: '1px solid #e0e0e0', padding: '16px', borderRadius: '4px', fontSize: '0.8rem', lineHeight: '1.4' }}>
        <h4 style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#000' }}>ℹ️ Dynamic Routing Details</h4>
        <ul style={{ margin: 0, paddingLeft: '16px', color: '#555', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Rotta fisica: <code>app/es33/risorse/attivita/[id]/page.tsx</code></li>
          <li>Parametro estratto (string): <code>id = "{params?.id}"</code></li>
          <li>Associazione utente: <code>Link &rarr; /es33/risorse/utenti/{act.assignedUserId}</code></li>
        </ul>
      </div>
    </div>
  );
}
