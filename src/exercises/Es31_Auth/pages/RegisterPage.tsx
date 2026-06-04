import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import type { AuthUser } from '../types/auth';
import StatusModal from '../components/StatusModal';

interface RegisterPageProps {
  onRegisterSuccess: (token: string, user: AuthUser) => void;
}

export default function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const router = useRouter();

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!username.trim() || !fullName.trim() || !email.trim() || !password || !confirmPassword) {
      openModal('error', 'Campi incompleti', 'Tutti i campi sono obbligatori per poter completare la registrazione.');
      setUiState('error');
      return;
    }

    if (username.trim().length < 3) {
      openModal('error', 'Username troppo corto', 'Lo username deve contenere almeno 3 caratteri.');
      setUiState('error');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      openModal('error', 'Email non valida', 'Inserisci un indirizzo email nel formato corretto (es. nome@esempio.com).');
      setUiState('error');
      return;
    }

    if (password.length < 6) {
      openModal('error', 'Password troppo debole', 'La password deve contenere almeno 6 caratteri.');
      setUiState('error');
      return;
    }

    if (password !== confirmPassword) {
      openModal('error', 'Password non coincidenti', 'Le password inserite non corrispondono. Riprova.');
      setUiState('error');
      return;
    }

    setUiState('loading');

    try {
      const response = await authService.register({
        email,
        password,
        username,
        fullName
      });
      onRegisterSuccess(response.accessToken, response.user);
      setUiState('success');

      // Open success modal
      openModal(
        'success',
        'Registrazione Completata!',
        `Il tuo account è stato creato con successo. Benvenuto in SecureAuth, ${response.user.fullName}!`,
        'Vai alla Dashboard',
        () => router.push('/es31/private')
      );
    } catch (err: any) {
      setUiState('error');
      openModal(
        'error',
        'Errore di Registrazione',
        err.message || 'Non è stato possibile creare l\'account. L\'indirizzo email potrebbe essere già registrato.'
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
          maxWidth: '440px',
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
          Registrati
        </h2>
        <p style={{ color: 'var(--text)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '32px' }}>
          Crea un nuovo account per accedere alla piattaforma
        </p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-h)', marginBottom: '8px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={uiState === 'loading'}
              placeholder="mrossi"
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
              Nome Completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={uiState === 'loading'}
              placeholder="Mario Rossi"
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
              placeholder="Minimo 6 caratteri"
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
              Conferma Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={uiState === 'loading'}
              placeholder="Ripeti la password"
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
              'Registrati'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text)', marginTop: '24px', marginBottom: 0 }}>
          Hai già un account?{' '}
          <a href="/es31/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>
            Accedi
          </a>
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
