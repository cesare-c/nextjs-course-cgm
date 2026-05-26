import { useState, useEffect, useCallback } from 'react';
import type { User, UserInput } from '../../types/userDay28';
import { userServiceDay28 } from '../../services/userServiceDay28';
import UserCrudListDay28 from './UserCrudList';
import UserCrudDetailDay28 from './UserCrudDetail';
import UserCrudFormDay28 from './UserCrudForm';
import MessageModal from '../../shared/MessageModal';

type ViewMode = 'list' | 'detail' | 'create' | 'edit';
type UIState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

const LIMIT = 5; // 5 users per page

export default function UserCrudContainerDay28() {
  // Navigation State
  const [view, setView] = useState<ViewMode>('list');
  const [selectedUserId, setSelectedUserId] = useState<number | string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // List State
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // UI States
  const [uiState, setUiState] = useState<UIState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Simulator Toggles for developer/testing
  const [simulateError, setSimulateError] = useState<boolean>(false);

  // Message Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    showCancel?: boolean;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info',
    showCancel?: boolean,
    onConfirm?: () => void,
    confirmLabel?: string,
    cancelLabel?: string
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      showCancel,
      onConfirm,
      confirmLabel,
      cancelLabel
    });
  };

  // Fetch paginated, filtered users
  const loadUsers = useCallback(async () => {
    setUiState('loading');
    setErrorMessage(null);
    try {
      const result = await userServiceDay28.fetchUsers(currentPage, LIMIT, filter, simulateError);
      setUsers(result.users);
      setTotal(result.total);
      
      if (result.users.length === 0) {
        setUiState('empty');
      } else {
        setUiState('success');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Errore sconosciuto nel recupero degli utenti.');
      setUiState('error');
    }
  }, [currentPage, filter, simulateError]);

  // Load user list on page or filter change
  useEffect(() => {
    if (view === 'list') {
      loadUsers();
    }
  }, [view, loadUsers]);

  // Fetch detailed user
  const fetchSingleUser = async (id: number | string) => {
    setUiState('loading');
    setErrorMessage(null);
    try {
      const user = await userServiceDay28.fetchUserById(id, simulateError);
      setSelectedUser(user);
      setSelectedUserId(id);
      setView('detail');
      setUiState('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossibile caricare il dettaglio dell\'utente.');
      setUiState('error');
    }
  };

  // Create handler
  const handleCreateUserSubmit = async (input: UserInput) => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await userServiceDay28.createUser(input, simulateError);
      setView('list');
      setCurrentPage(1); // Go to first page to see new user or filter appropriately
      showModal('Operazione Completata', 'Utente creato con successo!', 'success');
    } catch (err: any) {
      showModal('Errore', `Impossibile creare l'utente: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Edit handler
  const handleEditUserSubmit = async (input: UserInput) => {
    if (selectedUserId === null) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const updatedUser = await userServiceDay28.updateUser(selectedUserId, input, simulateError);
      setSelectedUser(updatedUser);
      setView('detail');
      showModal('Operazione Completata', 'Utente aggiornato con successo!', 'success');
    } catch (err: any) {
      showModal('Errore', `Impossibile aggiornare l'utente: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handler
  const handleDeleteUser = async (id: number | string) => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await userServiceDay28.deleteUser(id, simulateError);
      setView('list');
      // If we deleted the last item on the page, go to previous page
      const newTotal = total - 1;
      const totalPages = Math.ceil(newTotal / LIMIT) || 1;
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      } else {
        loadUsers();
      }
      showModal('Operazione Completata', 'Utente eliminato con successo!', 'success');
    } catch (err: any) {
      showModal('Errore', `Impossibile eliminare l'utente: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
      setSelectedUser(null);
      setSelectedUserId(null);
    }
  };

  // Reset Database
  const handleResetDb = async () => {
    showModal(
      'Ripristina Database',
      'Sei sicuro di voler ripristinare il database allo stato iniziale?',
      'info',
      true,
      async () => {
        setUiState('loading');
        await userServiceDay28.resetDatabase();
        setCurrentPage(1);
        setFilter('all');
        setView('list');
        loadUsers();
      },
      'Ripristina',
      'Annulla'
    );
  };

  // Reset error page trigger
  const handleRetry = () => {
    if (view === 'list') {
      loadUsers();
    } else if (selectedUserId !== null) {
      fetchSingleUser(selectedUserId);
    } else {
      setView('list');
    }
  };

  // Component UI state screens rendering
  const renderUIState = (content: React.ReactNode) => {
    if (uiState === 'loading') {
      return (
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--accent)' }}>
          <div className="spinner" style={{
            display: 'inline-block',
            width: '36px',
            height: '36px',
            border: '3px solid var(--accent-bg)',
            borderTop: '3px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '15px'
          }}></div>
          <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500', color: 'var(--text)' }}>
            Recupero dati in corso...
          </p>
        </div>
      );
    }

    if (uiState === 'error') {
      return (
        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(255, 77, 79, 0.05)',
          border: '1px solid #ffccc7',
          borderRadius: '8px',
          textAlign: 'center',
          margin: '20px auto',
          maxWidth: '500px'
        }}>
          <h4 style={{ color: '#ff4d4f', margin: '0 0 10px 0', fontSize: '1.05rem' }}>Si è verificato un errore</h4>
          <p style={{ color: 'var(--text)', fontSize: '0.9rem', marginBottom: '16px' }}>{errorMessage}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {view !== 'list' && (
              <button 
                onClick={() => { setView('list'); setUiState('idle'); }} 
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Torna alla Lista
              </button>
            )}
            <button 
              onClick={handleRetry}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              Riprova
            </button>
          </div>
        </div>
      );
    }

    if (uiState === 'empty' && view === 'list') {
      return (
        <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text)' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '1rem', fontStyle: 'italic' }}>
            Nessun utente corrisponde ai criteri di ricerca.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button 
              onClick={() => { setFilter('all'); setCurrentPage(1); }} 
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              Rimuovi Filtri
            </button>
            <button 
              onClick={() => setView('create')} 
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Crea Utente
            </button>
          </div>
        </div>
      );
    }

    return content;
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'var(--sans)',
      color: 'var(--text)'
    }}>
      {/* Simulation / Admin panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 18px',
        backgroundColor: 'var(--code-bg)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        marginBottom: '24px',
        fontSize: '0.8rem',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <strong style={{ color: 'var(--text-h)' }}>Testing States:</strong>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '500' }}>
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Simula errore di rete
          </label>
        </div>

        <button 
          onClick={handleResetDb} 
          style={{
            padding: '4px 10px',
            backgroundColor: 'transparent',
            color: 'var(--text-h)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}
        >
          Ripristina Database Mock
        </button>
      </div>

      {/* Main View Manager */}
      <div style={{
        minHeight: '200px',
        padding: '20px',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        backgroundColor: 'var(--bg)',
        boxShadow: 'var(--shadow)'
      }}>
        {renderUIState(
          <>
            {view === 'list' && (
              <UserCrudListDay28
                users={users}
                total={total}
                currentPage={currentPage}
                limit={LIMIT}
                filter={filter}
                onFilterChange={(f) => { setFilter(f); setCurrentPage(1); }}
                onPageChange={setCurrentPage}
                onSelectUser={fetchSingleUser}
                onAddUser={() => setView('create')}
                onEditUser={async (id) => {
                  setUiState('loading');
                  try {
                    const u = await userServiceDay28.fetchUserById(id, simulateError);
                    setSelectedUser(u);
                    setSelectedUserId(id);
                    setView('edit');
                    setUiState('success');
                  } catch (err: any) {
                    setErrorMessage(err.message || 'Impossibile caricare l\'utente per la modifica.');
                    setUiState('error');
                  }
                }}
                onDeleteUser={async (id) => {
                  const userToDelete = users.find((u) => u.id === id);
                  const username = userToDelete ? `@${userToDelete.username}` : 'questo utente';
                  showModal(
                    'Elimina Utente',
                    `Sei sicuro di voler eliminare l'utente ${username}? L'azione è irreversibile.`,
                    'error',
                    true,
                    () => handleDeleteUser(id),
                    'Elimina',
                    'Annulla'
                  );
                }}
                isActionInProgress={isSaving}
              />
            )}

            {view === 'detail' && selectedUser && (
              <UserCrudDetailDay28
                user={selectedUser}
                onBack={() => { setView('list'); setSelectedUser(null); setSelectedUserId(null); }}
                onEdit={() => setView('edit')}
                onDelete={() => handleDeleteUser(selectedUser.id)}
                isDeleting={isSaving}
              />
            )}

            {(view === 'create' || view === 'edit') && (
              <UserCrudFormDay28
                initialUser={view === 'edit' && selectedUser ? selectedUser : undefined}
                onSubmit={view === 'edit' ? handleEditUserSubmit : handleCreateUserSubmit}
                onCancel={() => {
                  if (view === 'edit') {
                    setView('detail');
                  } else {
                    setView('list');
                  }
                }}
                isSaving={isSaving}
              />
            )}
          </>
        )}
      </div>

      <MessageModal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
        onConfirm={modal.onConfirm}
        confirmLabel={modal.confirmLabel}
        cancelLabel={modal.cancelLabel}
      />

      {/* CSS Animation Injection */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
