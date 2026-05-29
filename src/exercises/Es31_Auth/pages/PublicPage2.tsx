export default function PublicPage2() {
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #aa3bff 100%)',
          color: '#fff',
          fontSize: '2.2rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
        }}
      >
        📖
      </div>
      <h2 style={{ color: 'var(--text-h)', fontSize: '2.2rem', marginBottom: '16px', fontWeight: '800' }}>
        Architettura di Sicurezza
      </h2>
      <p style={{ color: 'var(--text)', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '650px', marginBottom: '40px' }}>
        Analisi dei pilastri tecnologici impiegati per realizzare il sistema di isolamento e di verifica delle credenziali dell'esercizio.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '750px',
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
          }}
        >
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '12px' }}>🔒</span>
          <strong style={{ color: 'var(--text-h)', display: 'block', fontSize: '1.1rem', marginBottom: '8px' }}>Sicurezza JWT</strong>
          <span style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
            Il JSON Web Token viene trasmesso via header HTTP {'Authorization: Bearer <token>'} in ciascuna chiamata REST per identificare e autorizzare l'utente.
          </span>
        </div>

        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'var(--social-bg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '12px' }}>🛰️</span>
          <strong style={{ color: 'var(--text-h)', display: 'block', fontSize: '1.1rem', marginBottom: '8px' }}>Route Guarding</strong>
          <span style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
            I componenti `ProtectedRoute` e `PublicOnlyRoute` filtrano le rotte in tempo reale intercettando lo stato globale del token dell'utente.
          </span>
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
