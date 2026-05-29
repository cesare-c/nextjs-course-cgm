export default function PublicPage3() {
  const faqs = [
    { q: 'Come funziona la persistenza del token?', a: 'Il token JWT emesso dal mock backend viene memorizzato in modo persistente in LocalStorage. Al ricaricamento del browser, l\'helper legge il token e ripristina la sessione.' },
    { q: 'Cosa succede se il token scade?', a: 'Il client-side intercetta le risposte 401 Unauthorized e cancella i dati locali, costringendo l\'utente a effettuare nuovamente l\'accesso tramite redirect automatico.' },
    { q: 'Le pagine Pubblica 2 e 3 necessitano di login?', a: 'No, l\'accesso è libero e garantito a chiunque in qualsiasi momento, a differenza dell\'area Privata.' }
  ];

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
          background: 'linear-gradient(135deg, #00d2ff 0%, #3b82f6 100%)',
          color: '#fff',
          fontSize: '2.2rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)',
        }}
      >
        💡
      </div>
      <h2 style={{ color: 'var(--text-h)', fontSize: '2.2rem', marginBottom: '16px', fontWeight: '800' }}>
        Domande & Risposte (Q&A)
      </h2>
      <p style={{ color: 'var(--text)', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '650px', marginBottom: '40px' }}>
        Risposte alle domande più frequenti sui meccanismi di autenticazione JWT, persistenza locale e sessioni dell'applicazione.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '750px',
          textAlign: 'left',
        }}
      >
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              padding: '20px 24px',
              borderRadius: '12px',
              background: 'var(--social-bg)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <strong style={{ color: 'var(--text-h)', display: 'block', fontSize: '1.05rem', marginBottom: '8px' }}>
              ❓ {faq.q}
            </strong>
            <span style={{ fontSize: '0.92rem', color: 'var(--text)', lineHeight: '1.6' }}>
              {faq.a}
            </span>
          </div>
        ))}
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
