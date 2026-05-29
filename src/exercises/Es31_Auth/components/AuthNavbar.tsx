import { NavLink, Link } from 'react-router-dom';
import type { AuthUser } from '../types/auth';

interface AuthNavbarProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export default function AuthNavbar({ user, onLogout }: AuthNavbarProps) {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    color: isActive ? 'var(--accent)' : 'var(--text)',
    background: isActive ? 'var(--accent-bg)' : 'transparent',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
    transition: 'all 0.2s',
  });

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        backgroundColor: 'var(--social-bg)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Left: Branding & Main Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🔐 <span style={{ background: 'linear-gradient(135deg, var(--accent), #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SecureAuth</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <NavLink to="/es31" style={linkStyle} end>
            🏠 Main
          </NavLink>
          <NavLink to="/es31/pubblica2" style={linkStyle}>
            📖 Architettura
          </NavLink>
          <NavLink to="/es31/pubblica3" style={linkStyle}>
            💡 Q&A
          </NavLink>
          <NavLink to="/es31/private" style={linkStyle}>
            🔒 Privata
          </NavLink>
        </div>
      </div>

      {/* Right: User profile, guest actions, and Home Esercizi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid var(--border)', paddingRight: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: '500' }}>
              Benvenuto, <strong style={{ color: 'var(--text-h)' }}>{user.fullName}</strong>
            </span>
            <button
              onClick={onLogout}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #ef4444',
                backgroundColor: 'transparent',
                color: '#ef4444',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              Esci
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border)', paddingRight: '16px' }}>
            <NavLink
              to="/es31/login"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text)',
                padding: '6px 12px',
                fontSize: '0.82rem',
                fontWeight: '600',
                borderRadius: '6px',
                background: isActive ? 'var(--accent-bg)' : 'transparent',
                transition: 'all 0.2s',
              })}
            >
              🔑 Accedi
            </NavLink>
            <NavLink
              to="/es31/register"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text)',
                padding: '6px 12px',
                fontSize: '0.82rem',
                fontWeight: '600',
                borderRadius: '6px',
                background: isActive ? 'var(--accent-bg)' : 'transparent',
                transition: 'all 0.2s',
              })}
            >
              📝 Registrati
            </NavLink>
          </div>
        )}

        <Link
          to="/"
          style={{
            color: 'var(--text)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            border: '1px solid var(--border)',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'var(--bg)',
            fontWeight: '600',
            transition: 'all 0.2s',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--social-bg)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ↩️ Home Esercizi
        </Link>
      </div>
    </nav>
  );
}
