import { useState } from 'react';
import type { User } from '../../types/userDay27';
import { formatFullName } from '../../helpers/userHelpers';

interface UserCrudDetailProps {
  user: User;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export default function UserCrudDetail({ user, onBack, onEdit, onDelete, isDeleting }: UserCrudDetailProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const cardStyle = {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow)',
    maxWidth: '500px',
    margin: '0 auto',
    boxSizing: 'border-box' as const
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: user.isActive ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
    color: user.isActive ? '#2ecc71' : '#e74c3c',
    marginBottom: '16px'
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.9rem'
  };

  const labelStyle = {
    color: 'var(--text)',
    fontWeight: '500'
  };

  const valueStyle = {
    color: 'var(--text-h)',
    fontWeight: '600',
    textAlign: 'right' as const
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
    gap: '10px',
    flexWrap: 'wrap' as const
  };

  const primaryButtonStyle = {
    padding: '8px 16px',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'opacity 0.2s'
  };

  const dangerButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'opacity 0.2s'
  };

  const secondaryButtonStyle = {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500'
  };

  const initials = [user.firstName[0], user.lastName[0]].filter(Boolean).join('').toUpperCase();

  return (
    <div style={cardStyle}>
      {/* Header Profile Circle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-bg)',
          border: '1px solid var(--accent-border)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '12px'
        }}>
          {initials || '?'}
        </div>
        <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-h)', fontSize: '1.3rem' }}>
          {formatFullName(user)}
        </h3>
        <p style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: '0.9rem' }}>
          @{user.username}
        </p>
        <span style={badgeStyle}>{user.isActive ? 'Attivo' : 'Non Attivo'}</span>
      </div>

      {/* Details Table */}
      <div>
        <div style={rowStyle}>
          <span style={labelStyle}>ID Utente</span>
          <span style={valueStyle}>{user.id}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Username</span>
          <span style={valueStyle}>{user.username}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Email</span>
          <span style={valueStyle}>{user.email}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Nome</span>
          <span style={valueStyle}>{user.firstName}</span>
        </div>
        {user.middleName && (
          <div style={rowStyle}>
            <span style={labelStyle}>Secondo Nome</span>
            <span style={valueStyle}>{user.middleName}</span>
          </div>
        )}
        <div style={rowStyle}>
          <span style={labelStyle}>Cognome</span>
          <span style={valueStyle}>{user.lastName}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {!showConfirmDelete ? (
        <div style={buttonGroupStyle}>
          <button onClick={onBack} style={secondaryButtonStyle} disabled={isDeleting}>
            &larr; Torna alla Lista
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onEdit} style={primaryButtonStyle} disabled={isDeleting}>
              Modifica
            </button>
            <button onClick={() => setShowConfirmDelete(true)} style={dangerButtonStyle} disabled={isDeleting}>
              Elimina
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          border: '1px solid #ffccc7',
          backgroundColor: 'rgba(255, 77, 79, 0.05)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#ff4d4f', fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>
            Sei sicuro di voler eliminare questo utente? L'operazione è irreversibile.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button 
              onClick={() => setShowConfirmDelete(false)} 
              style={secondaryButtonStyle} 
              disabled={isDeleting}
            >
              Annulla
            </button>
            <button 
              onClick={onDelete} 
              style={{ ...dangerButtonStyle, backgroundColor: '#d9363e' }} 
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminazione...' : 'Conferma ed Elimina'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
