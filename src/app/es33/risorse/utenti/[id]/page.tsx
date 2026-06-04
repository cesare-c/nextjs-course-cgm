'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockUsers } from '../../../data/mockData';

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? Number(params.id) : NaN;
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return (
      <div style={{ padding: '20px', border: '1px dashed #ccc', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#ff0000' }}>Utente non trovato</h3>
        <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '16px' }}>L'utente #{params?.id} non esiste nel database statico.</p>
        <Link href="/es33/risorse/utenti" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.82rem' }}>
          Torna alla Lista
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.85rem' }}>
      <Link href="/es33/risorse/utenti" style={{ color: '#666', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Torna alla lista utenti
      </Link>

      <h1 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 16px 0', color: '#000' }}>
        Scheda Utente
      </h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600', width: '150px' }}>ID Utente:</td>
            <td style={{ padding: '10px 0', fontFamily: 'monospace' }}>{user.id}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Avatar:</td>
            <td style={{ padding: '10px 0', fontSize: '1.2rem' }}>{user.avatar}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Nome Completo:</td>
            <td style={{ padding: '10px 0' }}>{user.fullName}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Ruolo:</td>
            <td style={{ padding: '10px 0', color: '#333' }}>{user.role}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Email:</td>
            <td style={{ padding: '10px 0', color: '#0066cc' }}>{user.email}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Stato Account:</td>
            <td style={{ padding: '10px 0', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700' }}>
              {user.status}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Data di Registrazione:</td>
            <td style={{ padding: '10px 0', color: '#555' }}>{user.joinDate}</td>
          </tr>
        </tbody>
      </table>

      {/* Dynamic Routing Notes */}
      <div style={{ backgroundColor: '#fcfcfc', border: '1px solid #e0e0e0', padding: '16px', borderRadius: '4px', fontSize: '0.8rem', lineHeight: '1.4' }}>
        <h4 style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#000' }}>ℹ️ Dynamic Routing Details</h4>
        <ul style={{ margin: 0, paddingLeft: '16px', color: '#555', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Rotta fisica: <code>app/es33/risorse/utenti/[id]/page.tsx</code></li>
          <li>Parametro estratto (string): <code>id = "{params?.id}"</code></li>
          <li>Conversione per confronto: <code>Number("{params?.id}")</code> &rarr; <code>{id}</code></li>
          <li>Corrispondenza mock database: <code>user.id === {id}</code></li>
        </ul>
      </div>
    </div>
  );
}
