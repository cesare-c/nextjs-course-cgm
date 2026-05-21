import { useState, useEffect, useRef } from 'react';
import { userService } from '../services/userService';
import type { User } from '../types/user';

type UIStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';
type DataSource = 'none' | 'network' | 'cache';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<UIStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>('none');
  const [cacheTimeRemaining, setCacheTimeRemaining] = useState<number>(0);

  // Reference to track the current active request ID to avoid race conditions
  const requestCounterRef = useRef<number>(0);

  // Interval reference for updating cache validity countdown
  const intervalRef = useRef<number | null>(null);

  // Timer to update the cache remaining time display
  useEffect(() => {
    if (dataSource === 'cache' && status === 'success') {
      const cache = userService.getCache();
      if (cache) {
        const updateTimer = () => {
          const now = Date.now();
          const elapsed = now - cache.timestamp;
          const remaining = Math.max(0, Math.ceil((userService.getCacheDurationMs() - elapsed) / 1000));
          setCacheTimeRemaining(remaining);
          
          if (remaining <= 0) {
            // Cache expired naturally
            setDataSource('none');
            userService.clearCache();
          }
        };

        updateTimer(); // Run once immediately
        intervalRef.current = window.setInterval(updateTimer, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCacheTimeRemaining(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dataSource, status]);

  const loadData = async (forceRefetch = false) => {
    // Increment request ID to uniquely identify this fetch invocation
    const currentRequestId = ++requestCounterRef.current;

    setStatus('loading');
    setErrorMessage(null);

    // If cache is valid and we do not force refetch, load from cache
    const cache = userService.getCache();
    const isCacheValid = userService.isCacheValid(cache);

    if (isCacheValid && !forceRefetch && cache) {
      // Simulate a small delay for UI transition smoothness (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // If another request has started in the meantime, discard this result
      if (currentRequestId !== requestCounterRef.current) {
        return;
      }

      setUsers(cache.users);
      setDataSource('cache');
      setStatus(cache.users.length === 0 ? 'empty' : 'success');
      return;
    }

    // Force invalidation if requested
    if (forceRefetch) {
      userService.clearCache();
    }

    try {
      const rawData = await userService.fetchUsersRaw();

      // Discard result if a newer request has started
      if (currentRequestId !== requestCounterRef.current) {
        return;
      }

      // Step 2: Validation
      const validatedData = userService.validateUsers(rawData);

      // Step 3: Mapping
      const mappedUsers = userService.mapUsers(validatedData);

      // Step 4: Caching
      userService.setCache(mappedUsers);

      setUsers(mappedUsers);
      setDataSource('network');
      setStatus(mappedUsers.length === 0 ? 'empty' : 'success');
    } catch (err: any) {
      // Discard error state if a newer request has started
      if (currentRequestId !== requestCounterRef.current) {
        return;
      }

      // Hide technical errors from the user; display friendly messages instead
      let displayError = 'Impossibile caricare la lista degli utenti. Si è verificato un errore di connessione.';
      if (err.message === 'MOCK_VALIDATION_FAILURE') {
        displayError = 'I dati ricevuti dall\'endpoint mockato non sono validi. Riprova più tardi.';
      }

      setErrorMessage(displayError);
      setDataSource('none');
      setStatus('error');
    }
  };

  const handleClearCache = () => {
    userService.clearCache();
    setDataSource('none');
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#555' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '1rem' }}>
              Nessun dato caricato. Clicca su "Carica Utenti" per iniziare.
            </p>
            <button 
              onClick={() => loadData(false)} 
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              Carica Utenti
            </button>
          </div>
        );
      
      case 'loading':
        return (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: '#007bff' }}>
            <div className="spinner" style={{
              display: 'inline-block',
              width: '30px',
              height: '30px',
              border: '3px solid rgba(0, 123, 255, 0.2)',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '10px'
            }}></div>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Simulazione recupero dati in corso...</p>
          </div>
        );

      case 'error':
        return (
          <div style={{
            padding: '20px',
            backgroundColor: '#fff5f5',
            border: '1px solid #ffcccc',
            borderRadius: '6px',
            color: '#c92a2a',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>{errorMessage}</p>
            <button 
              onClick={() => loadData(false)}
              style={{
                padding: '6px 14px',
                backgroundColor: '#c92a2a',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}
            >
              Riprova
            </button>
          </div>
        );

      case 'empty':
        return (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#666' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '1rem' }}>
              Nessun utente disponibile nel database (Lista Vuota).
            </p>
            <button 
              onClick={() => loadData(true)} 
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              Forza Aggiornamento
            </button>
          </div>
        );

      case 'success':
        return (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', color: '#444' }}>
                  <th style={{ padding: '10px 8px' }}>Avatar</th>
                  <th style={{ padding: '10px 8px' }}>Nome</th>
                  <th style={{ padding: '10px 8px' }}>Email</th>
                  <th style={{ padding: '10px 8px' }}>Ruolo</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#e6f4ea',
                        color: '#137333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        {user.initials}
                      </div>
                    </td>
                    <td style={{ padding: '8px', fontWeight: '500', color: '#333' }}>{user.fullName}</td>
                    <td style={{ padding: '8px', color: '#666' }}>{user.emailAddress}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        backgroundColor: '#f1f3f4',
                        color: '#3c4043',
                        fontWeight: '500'
                      }}>
                        {user.roleName}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '10px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>Lista Utenti</h3>

      {/* Control Panel / Actions */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {status !== 'idle' && (
          <>
            <button 
              onClick={() => loadData(false)} 
              disabled={status === 'loading'}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                opacity: status === 'loading' ? 0.7 : 1
              }}
            >
              Aggiorna (Usa Cache)
            </button>
            <button 
              onClick={() => loadData(true)} 
              disabled={status === 'loading'}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                opacity: status === 'loading' ? 0.7 : 1
              }}
            >
              Forza Re-fetch
            </button>
            {dataSource === 'cache' && (
              <button 
                onClick={handleClearCache}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}
              >
                Invalida Cache
              </button>
            )}
          </>
        )}
      </div>

      {/* Cache Status Badge */}
      {status === 'success' && dataSource !== 'none' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: dataSource === 'cache' ? '#e8f0fe' : '#e6f4ea',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: dataSource === 'cache' ? '#1a73e8' : '#137333',
          marginBottom: '15px',
          border: dataSource === 'cache' ? '1px solid #d2e3fc' : '1px solid #ceead6'
        }}>
          <div>
            <strong>Sorgente:</strong> {dataSource === 'cache' ? 'Cache Locale' : 'Endpoint API (Mock)'} 
            <span style={{ fontSize: '0.75rem', marginLeft: '5px', color: '#666' }}>
              (Chiave: <code>{userService.getCacheKey()}</code>)
            </span>
          </div>
          {dataSource === 'cache' && (
            <div>
              Scade in: <strong>{cacheTimeRemaining}s</strong>
            </div>
          )}
        </div>
      )}

      {/* Main Area */}
      <div style={{ minHeight: '120px', border: '1px solid #eee', borderRadius: '6px', padding: '15px', backgroundColor: '#fafafa' }}>
        {renderContent()}
      </div>

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
