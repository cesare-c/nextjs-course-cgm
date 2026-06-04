import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Monitor scroll for back-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Es 34', href: '#es-34', title: 'E-Commerce Day 34' },
    { label: 'Es 33', href: '#es-33', title: 'Dashboard & Resources Day 33' },
    { label: 'Es 31', href: '#es-31', title: 'Auth & Router Day 31' },
    { label: 'Es 28', href: '#es-28', title: 'User CRUD Day 28' },
    { label: 'Es 27', href: '#es-27', title: 'User CRUD' },
    { label: 'Es 26', href: '#es-26', title: 'API Docs' },
    { label: 'Es 25', href: '#es-25', title: 'User List' },
    { label: 'Es 24', href: '#es-24', title: 'Registration' },
    { label: 'Es 23', href: '#es-23', title: 'Tasks Async' },
    { label: 'Es 22', href: '#es-22', title: 'Tasks' },
    { label: 'Es 21', href: '#es-21', title: 'Profiles' },
    { label: 'Es 20', href: '#es-20', title: 'Default Counter' },
  ];

  const handlePrevLinks = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const handleNextLinks = () => {
    if (startIndex < navLinks.length - 4) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const visibleLinks = navLinks.slice(startIndex, startIndex + 4);

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxSizing: 'border-box',
          background: 'var(--navbar-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'var(--text-h)',
            fontWeight: '700',
            fontSize: '1.2rem',
            letterSpacing: '-0.5px',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent) 0%, #3498db 100%)',
              color: '#fff',
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(170, 59, 255, 0.3)',
            }}
          >
            &lt;/&gt;
          </span>
          <span style={{ transition: 'color 0.3s' }}>
            Cesare <span style={{ color: 'var(--accent)' }}>Dev</span>
          </span>
        </a>

        {/* Internal Navigation Anchors with Sliding Window */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--social-bg, rgba(244, 243, 236, 0.5))',
            padding: '4px 8px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
          }}
          className="nav-menu"
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrevLinks}
            disabled={startIndex === 0}
            style={{
              background: 'none',
              border: 'none',
              cursor: startIndex === 0 ? 'not-allowed' : 'pointer',
              color: startIndex === 0 ? 'var(--border)' : 'var(--text)',
              opacity: startIndex === 0 ? 0.3 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'all 0.2s',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (startIndex > 0) {
                e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
                e.currentTarget.style.color = 'var(--accent)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = startIndex === 0 ? 'var(--border)' : 'var(--text)';
            }}
            title="Precedenti"
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Links container */}
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              gap: '6px',
              alignItems: 'center',
              width: '280px',
              justifyContent: 'center',
            }}
          >
            {visibleLinks.map((link) => (
              <li key={link.href} style={{ animation: 'fade-slide-in 0.2s ease-out forwards' }}>
                <a
                  href={link.href}
                  title={link.title}
                  style={{
                    textDecoration: 'none',
                    color: 'var(--text)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    display: 'block',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-h)';
                    e.currentTarget.style.backgroundColor = 'var(--bg)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Arrow Button */}
          <button
            onClick={handleNextLinks}
            disabled={startIndex >= navLinks.length - 4}
            style={{
              background: 'none',
              border: 'none',
              cursor: startIndex >= navLinks.length - 4 ? 'not-allowed' : 'pointer',
              color: startIndex >= navLinks.length - 4 ? 'var(--border)' : 'var(--text)',
              opacity: startIndex >= navLinks.length - 4 ? 0.3 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'all 0.2s',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (startIndex < navLinks.length - 4) {
                e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
                e.currentTarget.style.color = 'var(--accent)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = startIndex >= navLinks.length - 4 ? 'var(--border)' : 'var(--text)';
            }}
            title="Successivi"
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Action Area (Theme toggle & GitHub) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text)',
              transition: 'all 0.2s',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--text-h)';
              e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Cambia tema chiaro/scuro"
            title={`Attiva tema ${theme === 'light' ? 'scuro' : 'chiaro'}`}
          >
            {theme === 'light' ? (
              // Sun Icon (when light, to switch to dark)
              <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              // Moon Icon (when dark, to switch to light)
              <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--text-h)';
              e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Vai a GitHub"
            aria-label="Profilo GitHub"
          >
            <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
        </div>

        {/* Responsive adjustments injection */}
        <style>{`
          @media (max-width: 680px) {
            .nav-menu {
              display: none !important; /* Hide anchors on small mobile layout to prevent clutter */
            }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-slide-in {
            from {
              opacity: 0.4;
              transform: scale(0.96);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </nav>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg)',
            color: 'var(--accent)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'fade-in-up 0.25s ease-out forwards',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.backgroundColor = 'var(--bg)';
          }}
          aria-label="Torna in alto"
          title="Torna in alto"
        >
          <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}
