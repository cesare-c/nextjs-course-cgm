import type { AuthUser } from '../types/auth';

interface PrivatePageProps {
  user: AuthUser | null;
}

export default function PrivatePage({ user }: PrivatePageProps) {
  if (!user) return null;

  // Real-world simulated logs
  const simulatedLogs = [
    { event: 'Token JWT Generato', status: 'Successo', time: 'Meno di un minuto fa', code: '200 OK' },
    { event: 'Autenticazione Utente', status: 'Verificato', time: '1 minuto fa', code: 'AUTH_SUCCESS' },
    { event: 'Recupero Dati Profilo', status: 'Autorizzato', time: '1 minuto fa', code: 'GET /users/me' },
    { event: 'Controllo Guard di Autorizzazione Rotta', status: 'Superato', time: 'Giusto ora', code: 'ACCESS_GRANTED' },
  ];

  return (
    <div
      style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        animation: 'fade-slide-in 0.4s ease-out',
        boxSizing: 'border-box',
      }}
    >
      {/* Dashboard Top Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '24px 32px',
          background: 'linear-gradient(135deg, var(--social-bg) 0%, rgba(170, 59, 255, 0.05) 100%)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, #00d2ff 100%)',
              color: '#fff',
              fontSize: '1.8rem',
              fontWeight: '700',
              boxShadow: '0 4px 15px rgba(170, 59, 255, 0.25)',
            }}
          >
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-h)', fontWeight: '700' }}>
              Area Amministrativa
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text)' }}>
              Bentornato, <strong style={{ color: 'var(--accent)' }}>{user.fullName}</strong>. Gestisci il tuo profilo e monitora gli accessi della sessione.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            Sessione Attiva (JWT)
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        <div style={{ padding: '20px', background: 'var(--social-bg)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'left' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Livello di Sicurezza</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '1.8rem', color: 'var(--text-h)', fontWeight: '700' }}>Livello 1</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#10b981' }}>Utente Autorizzato Standard</p>
        </div>

        <div style={{ padding: '20px', background: 'var(--social-bg)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'left' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Query al Database</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '1.8rem', color: 'var(--text-h)', fontWeight: '700' }}>3 Richieste</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text)' }}>Hit dati mock in cache</p>
        </div>

        <div style={{ padding: '20px', background: 'var(--social-bg)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'left' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Durata Token</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '1.8rem', color: 'var(--text-h)', fontWeight: '700' }}>1 Ora</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text)' }}>Logout automatico alla scadenza</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Left Column: Account Details */}
        <div
          style={{
            background: 'var(--social-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-h)', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Dettagli Profilo
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>NOME COMPLETO</span>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-h)', fontWeight: '600', marginTop: '2px' }}>{user.fullName}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>USERNAME</span>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-h)', fontWeight: '600', marginTop: '2px' }}>@{user.username}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>INDIRIZZO EMAIL</span>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-h)', fontWeight: '600', marginTop: '2px' }}>{user.email}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>HASH PASSWORD MOCK</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'monospace', marginTop: '2px', wordBreak: 'break-all' }}>
                $2b$10$tZ92u8N3vO9... [Firma Crittografica JWT]
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security Audits */}
        <div
          style={{
            background: 'var(--social-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-h)', fontWeight: '700', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Log di Sicurezza (Sessione)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {simulatedLogs.map((log, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-h)', fontWeight: '600' }}>{log.event}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginTop: '2px' }}>{log.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981',
                      fontWeight: '600',
                    }}
                  >
                    {log.status}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text)', marginTop: '4px', fontFamily: 'monospace' }}>{log.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-slide-in {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
