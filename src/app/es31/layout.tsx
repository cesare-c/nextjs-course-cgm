'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { localStorageHelper } from '../../exercises/Es31_Auth/helpers/localStorageHelper';
import type { AuthUser } from '../../exercises/Es31_Auth/types/auth';
import AuthNavbar from '../../exercises/Es31_Auth/components/AuthNavbar';
import { AuthContext } from './AuthContext';

export default function Es31Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(localStorageHelper.getAuthUser());
    setIsMounted(true);
  }, []);

  const handleLoginSuccess = (token: string, loggedUser: AuthUser) => {
    localStorageHelper.setAuthData(token, loggedUser);
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorageHelper.clearAuthData();
    setUser(null);
    router.push('/es31/login');
  };

  if (!isMounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
        }}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ user, login: handleLoginSuccess, logout: handleLogout }}>
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
          {children}
        </div>
      </div>
    </AuthContext.Provider>
  );
}
