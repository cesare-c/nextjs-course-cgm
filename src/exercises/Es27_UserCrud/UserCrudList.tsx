import type { User } from '../../types/userDay27';
import { formatFullName } from '../../helpers/userHelpers';

interface UserCrudListProps {
  users: User[];
  total: number;
  currentPage: number;
  limit: number;
  filter: 'all' | 'active' | 'inactive';
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  onPageChange: (page: number) => void;
  onSelectUser: (id: number | string) => void;
  onDeleteUser: (id: number | string) => Promise<void>;
  isActionInProgress: boolean;
}

export default function UserCrudList({
  users,
  total,
  currentPage,
  limit,
  filter,
  onFilterChange,
  onPageChange,
  onSelectUser,
  onDeleteUser,
  isActionInProgress
}: UserCrudListProps) {
  const totalPages = Math.ceil(total / limit) || 1;

  const headerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '15px',
    flexWrap: 'wrap' as const
  };

  const controlsContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const
  };

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg)',
    color: 'var(--text-h)',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer'
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

  const tableContainerStyle = {
    overflowX: 'auto' as const,
    border: '1px solid var(--border)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.9rem',
    textAlign: 'left' as const
  };

  const thStyle = {
    padding: '12px 16px',
    borderBottom: '2px solid var(--border)',
    color: 'var(--text-h)',
    fontWeight: '600',
    backgroundColor: 'var(--code-bg)'
  };

  const trStyle = {
    borderBottom: '1px solid var(--border)',
    transition: 'background-color 0.2s'
  };

  const tdStyle = {
    padding: '12px 16px',
    color: 'var(--text)',
    verticalAlign: 'middle'
  };

  const badgeStyle = (isActive: boolean) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    backgroundColor: isActive ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
    color: isActive ? '#2ecc71' : '#e74c3c'
  });

  const actionButtonStyle = (type: 'view' | 'delete') => {
    let color = 'var(--text)';
    if (type === 'view') color = 'var(--accent)';
    if (type === 'delete') color = '#ff4d4f';

    return {
      padding: '4px 8px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: '600',
      color,
      transition: 'opacity 0.2s'
    };
  };

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    padding: '10px 0',
    fontSize: '0.85rem'
  };

  const pageButtonStyle = {
    padding: '6px 12px',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    backgroundColor: 'var(--bg)',
    color: 'var(--text-h)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: '500'
  };

  return (
    <div>
      {/* Header and Controls */}
      <div style={headerContainerStyle}>
        <div style={controlsContainerStyle}>
          {/* Status Filter */}
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-h)' }}>
            Filtra per Stato:
          </label>
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
            style={selectStyle}
            disabled={isActionInProgress}
          >
            <option value="all">Tutti gli utenti</option>
            <option value="active">Solo attivi</option>
            <option value="inactive">Solo non attivi</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Avatar</th>
              <th style={thStyle}>Nome Completo</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Stato</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const initials = [user.firstName[0], user.lastName[0]].filter(Boolean).join('').toUpperCase();
              return (
                <tr key={user.id} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-bg)',
                      border: '1px solid var(--accent-border)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}>
                      {initials}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: '600', color: 'var(--text-h)' }}>
                    {formatFullName(user)}
                  </td>
                  <td style={tdStyle}>@{user.username}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(user.isActive)}>
                      {user.isActive ? 'Attivo' : 'Non Attivo'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                      <button
                        onClick={() => onSelectUser(user.id)}
                        style={actionButtonStyle('view')}
                        title="Vedi Dettaglio"
                        disabled={isActionInProgress}
                      >
                        Vedi
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        style={actionButtonStyle('delete')}
                        title="Elimina"
                        disabled={isActionInProgress}
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={paginationStyle}>
        <span style={{ color: 'var(--text)' }}>
          Pagina <strong>{currentPage}</strong> di <strong>{totalPages}</strong> (Totale utenti: {total})
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isActionInProgress}
            style={{
              ...pageButtonStyle,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            &larr; Prec
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isActionInProgress}
            style={{
              ...pageButtonStyle,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Succ &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
