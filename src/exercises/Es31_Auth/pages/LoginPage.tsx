import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import type { AuthUser } from '../types/auth';
import StatusModal from '../components/StatusModal';

interface LoginPageProps {
  onLoginSuccess: (token: string, user: AuthUser) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uiState, setUiState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });

  const navigate = useNavigate();

  const openModal = (type: 'success' | 'error', title: string, message: string, actionLabel?: string, onAction?: () => void) => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      actionLabel,
      onAction,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!email.trim() || !password) {
      openModal('error', 'Campi incompleti', 'Tutti i campi sono obbligatori per poter effettuare l\'accesso.');
      setUiState('error');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      openModal('error', 'Email non valida', 'Inserisci un indirizzo email nel formato corretto (es. nome@esempio.com).');
      setUiState('error');
      return;
    }

    setUiState('loading');

    try {
      const response = await authService.login({ email, password });
      onLoginSuccess(response.accessToken, response.user);
      setUiState('success');
      
      // Open success modal
      openModal(
        'success',
        'Accesso Eseguito!',
        `Benvenuto in SecureAuth, ${response.user.fullName}! La tua sessione è ora attiva.`,
        'Vai alla Dashboard',
        () => navigate('/es31/private')
      );
    } catch (err: any) {
      setUiState('error');
      openModal(
        'error',
        'Errore di Accesso',
        err.message || 'Le credenziali fornite non sono valide o si è verificato un problema di connessione con il server.'
      );
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        background: 'radial-gradient(circle at 50% 50%, var(--accent-bg) 0%, transparent 65%)',
        minHeight: 'calc(100vh - 70px)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px 32px',
          background: 'var(--social-bg)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          textAlign: 'left',
          animation: 'fade-slide-in 0.3s ease-out',
        }}
      >
        <h2 style={{ color: 'var(--text-h)', textAlign: 'center', marginBottom: '8px', fontWeight: '700', fontSize: '1.8rem' }}>
          Accedi
        </h2>
        <p style={{ color: 'var(--text)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '32px' }}>
          Inserisci le tue credenziali per accedere all'area riservata
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-h)', marginBottom: '8px' }}>
              Indirizzo Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={uiState === 'loading'}
              placeholder="mario.rossi@example.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text-h)',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-h)', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={uiState === 'loading'}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text-h)',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={uiState === 'loading'}
            style={{
              marginTop: '12px',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: uiState === 'loading' ? 'not-allowed' : 'pointer',
              opacity: uiState === 'loading' ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(170, 59, 255, 0.2)',
            }}
          >
            {uiState === 'loading' ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                Elaborazione...
              </>
            ) : (
              'Accedi'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text)', marginTop: '24px', marginBottom: 0 }}>
          Non hai ancora un account?{' '}
          <Link to="/es31/register" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>
            Registrati ora
          </Link>
        </p>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fade-slide-in {
            from { transform: translateY(12px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        actionLabel={modalConfig.actionLabel}
        onAction={modalConfig.onAction}
      />
    </div>
  );
}
