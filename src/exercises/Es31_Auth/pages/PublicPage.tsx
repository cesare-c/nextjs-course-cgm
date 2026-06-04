import Link from 'next/link';

export default function PublicPage() {
  return (
    <div
      style={{
        flex: 1,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center',
        animation: 'fade-slide-in 0.4s ease-out',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #aa3bff 0%, #00d2ff 100%)',
          color: '#fff',
          fontSize: '2.2rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          boxShadow: '0 4px 15px rgba(170, 59, 255, 0.3)',
        }}
      >
        🔓
      </div>
      <h2 style={{ color: 'var(--text-h)', fontSize: '2.2rem', marginBottom: '16px', fontWeight: '800' }}>
        Portale Principale (Main)
      </h2>
      <p style={{ color: 'var(--text)', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '650px', marginBottom: '40px' }}>
        Benvenuto nel portale dimostrativo dell'esercizio **Giorno 31**. Questa sezione è accessibile liberamente. Registrati o accedi per sbloccare l'area protetta con controlli di sicurezza basati su JWT.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '750px',
          marginBottom: '40px',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'var(--social-bg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            transition: 'transform 0.2s',
          }}
        >
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '12px' }}>🔐</span>
          <strong style={{ color: 'var(--text-h)', display: 'block', fontSize: '1.1rem', marginBottom: '8px' }}>Area Riservata</strong>
          <span style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
            I contenuti sensibili sono protetti da token JWT persistiti in Local Storage con controlli automatici di sessione.
          </span>
        </div>

        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'var(--social-bg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            transition: 'transform 0.2s',
          }}
        >
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '12px' }}>⚡</span>
          <strong style={{ color: 'var(--text-h)', display: 'block', fontSize: '1.1rem', marginBottom: '8px' }}>JSON-server-auth</strong>
          <span style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
            Il server mock gestisce autenticazione JWT, validazione credenziali, hashing crittografico e persistenza dati.
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <a
          href="/es31/login"
          style={{
            textDecoration: 'none',
            color: '#fff',
            background: 'var(--accent)',
            padding: '12px 32px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(170, 59, 255, 0.25)',
            transition: 'all 0.2s',
          }}
        >
          Accedi
        </a>
        <a
          href="/es31/register"
          style={{
            textDecoration: 'none',
            color: 'var(--text-h)',
            background: 'transparent',
            border: '1px solid var(--border)',
            padding: '12px 32px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--social-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Registrati
        </a>
      </div>
    </div>
  );
}
