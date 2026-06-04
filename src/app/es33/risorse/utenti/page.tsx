'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockUsers } from '../../data/mockData';

export default function UsersListPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');

  const filteredUsers = mockUsers.filter((user) => {
    return statusFilter === 'all' || user.status === statusFilter;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Attivo';
      case 'suspended':
        return 'Sospeso';
      default:
        return 'In Attesa';
    }
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
          Trovati: <strong>{filteredUsers.length}</strong> utenti
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
          <option value="active">Attivi</option>
          <option value="suspended">Sospesi</option>
          <option value="pending">In Attesa</option>
        </select>
      </div>

      {/* Table list */}
      {filteredUsers.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Nome</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Ruolo</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Stato</th>
              <th style={{ padding: '8px 4px', fontWeight: '600' }}>Next.js Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 4px', color: '#666', fontFamily: 'monospace' }}>{user.id}</td>
                <td style={{ padding: '10px 4px', fontWeight: '500' }}>
                  <span style={{ marginRight: '6px' }}>{user.avatar}</span>
                  {user.fullName}
                </td>
                <td style={{ padding: '10px 4px', color: '#555' }}>{user.email}</td>
                <td style={{ padding: '10px 4px', color: '#555' }}>{user.role}</td>
                <td style={{ padding: '10px 4px', color: '#555' }}>{getStatusLabel(user.status)}</td>
                <td style={{ padding: '10px 4px' }}>
                  <Link
                    href={`/es33/risorse/utenti/${user.id}`}
                    style={{
                      color: '#0066cc',
                      textDecoration: 'none',
                      fontFamily: 'monospace',
                      fontWeight: '500',
                    }}
                  >
                    /utenti/{user.id}
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
          Nessun utente trovato corrispondente ai filtri.
        </div>
      )}
    </div>
  );
}
