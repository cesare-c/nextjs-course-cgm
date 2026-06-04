'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockActivities, mockUsers } from '../../data/mockData';

export default function ActivitiesListPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'pending'>('all');

  const filteredActivities = mockActivities.filter((act) => {
    return statusFilter === 'all' || act.status === statusFilter;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completato';
      case 'in_progress':
        return 'In Corso';
      default:
        return 'In Attesa';
    }
  };

  const getUserName = (userId: number) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user ? user.fullName : 'Sconosciuto';
  };

  return (
    <div>
      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '0.82rem', color: '#666' }}>
          Trovate: <strong>{filteredActivities.length}</strong> attività
        </div>
        <select
          value={statusFilter}
          onChange={(e: any) => setStatusFilter(e.target.value)}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#333',
            fontSize: '0.8rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">Tutti gli Stati</option>
          <option value="completed">Completati</option>
          <option value="in_progress">In Corso</option>
          <option value="pending">In Attesa</option>
        </select>
      </div>

      {/* Table list */}
      {filteredActivities.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Codice</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Titolo</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Durata</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Utente Assegnato</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Stato</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Next.js Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((act) => (
              <tr key={act.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 4px', color: '#666', fontFamily: 'monospace' }}>{act.id}</td>
                <td style={{ padding: '10px 4px', fontWeight: '500' }}>{act.title}</td>
                <td style={{ padding: '10px 4px', color: '#555' }}>{act.duration}</td>
                <td style={{ padding: '10px 4px' }}>
                  <Link
                    href={`/es33/risorse/utenti/${act.assignedUserId}`}
                    style={{
                      color: '#0066cc',
                      textDecoration: 'none',
                      fontWeight: '500',
                    }}
                  >
                    👤 {getUserName(act.assignedUserId)}
                  </Link>
                </td>
                <td style={{ padding: '10px 4px', color: '#555' }}>{getStatusLabel(act.status)}</td>
                <td style={{ padding: '10px 4px' }}>
                  <Link
                    href={`/es33/risorse/attivita/${act.id}`}
                    style={{
                      color: '#0066cc',
                      textDecoration: 'none',
                      fontFamily: 'monospace',
                      fontWeight: '500',
                    }}
                  >
                    /attivita/{act.id}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '24px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            color: '#666',
            fontSize: '0.85rem',
          }}
        >
          Nessuna attività trovata corrispondente ai filtri.
        </div>
      )}
    </div>
  );
}
