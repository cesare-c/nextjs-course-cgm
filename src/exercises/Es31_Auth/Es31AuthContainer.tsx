import { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { localStorageHelper } from './helpers/localStorageHelper';
import type { AuthUser } from './types/auth';

// Guard components
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

// Components & Pages
import AuthNavbar from './components/AuthNavbar';
import PublicPage from './pages/PublicPage';
import PublicPage2 from './pages/PublicPage2';
import PublicPage3 from './pages/PublicPage3';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivatePage from './pages/PrivatePage';

export default function Es31AuthContainer() {
  const [user, setUser] = useState<AuthUser | null>(() => localStorageHelper.getAuthUser());
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string, loggedUser: AuthUser) => {
    localStorageHelper.setAuthData(token, loggedUser);
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorageHelper.clearAuthData();
    setUser(null);
    navigate('/es31/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      {/* Local Navbar (Full-Width Header) */}
      <AuthNavbar user={user} onLogout={handleLogout} />

      {/* Scrolling Test Credentials Banner */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#fef08a',
          borderBottom: '1px solid #eab308',
          color: '#854d0e',
          fontSize: '0.88rem',
          fontWeight: '600',
          padding: '8px 0',
          overflow: 'hidden',
          position: 'relative',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            paddingLeft: '100%',
            animation: 'marquee-credentials 20s linear infinite',
          }}
        >
          pagina TEST PRIVATA: es31/private &gt;&gt; Indirizzo Email: cesare@example.com Password: Password123
        </div>
        <style>{`
          @keyframes marquee-credentials {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
          }
        `}</style>
      </div>

      {/* Routes Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<PublicPage />} />
          <Route path="/pubblica2" element={<PublicPage2 />} />
          <Route path="/pubblica3" element={<PublicPage3 />} />

          {/* Guest-only Pages */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} />
          </Route>

          {/* Protected Pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<PrivatePage user={user} />} />
          </Route>

          {/* Catch-all Route: redirect to home or login depending on auth */}
          <Route path="*" element={<PublicPage />} />
        </Routes>
      </div>
    </div>
  );
}
