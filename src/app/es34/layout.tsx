'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { CartProvider, useCart } from './CartContext';

export default function Es34Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Es34LayoutContent>{children}</Es34LayoutContent>
    </CartProvider>
  );
}

function Es34LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const { totalItems } = useCart();

  const getLinkStyle = (href: string) => {
    const isActive = href === '/es34' ? pathname === '/es34' : pathname.startsWith(href);
    return {
      textDecoration: 'none',
      color: isActive ? '#000' : '#666',
      borderBottom: isActive ? '2px solid #000' : '2px solid transparent',
      padding: '4px 0',
      fontSize: '0.88rem',
      fontWeight: isActive ? '600' : '400',
      transition: 'all 0.15s',
    };
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
        color: '#222',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Minimal E-Commerce Navbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#000', letterSpacing: '-0.3px' }}>
            🛍️ NEXT_STORE_LAB
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/es34" style={getLinkStyle('/es34')}>
              Catalogo Prodotti
            </Link>
            <Link href="/es34/carrello" style={getLinkStyle('/es34/carrello')}>
              Carrello {totalItems > 0 ? `(${totalItems})` : ''}
            </Link>
          </div>
        </div>
        <Link
          href="/"
          style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '0.8rem',
            border: '1px solid #e0e0e0',
            padding: '4px 10px',
            borderRadius: '4px',
            transition: 'all 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#000';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.color = '#666';
          }}
        >
          ← Home Esercizi
        </Link>
      </nav>

      {/* Main Area: Centered layout */}
      <main
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          padding: '32px 24px',
          boxSizing: 'border-box',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
