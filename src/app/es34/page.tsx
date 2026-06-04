'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart, Product } from './CartContext';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'Tutti' | 'Cancelleria' | 'Elettronica'>('Tutti');
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Impossibile caricare la lista dei prodotti');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'Tutti') return true;
    return p.category === selectedCategory;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '0.9rem', color: '#666' }}>
        Caricamento catalogo in corso...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed #ff0000', borderRadius: '4px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#ff0000' }}>Errore di Connessione</h3>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>{error}</p>
        <p style={{ fontSize: '0.8rem', color: '#888' }}>Assicurati che JSON-Server sia attivo ed in esecuzione sulla porta 3001.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#000', margin: '0 0 8px 0' }}>
          Catalogo E-Commerce
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#666', margin: 0, lineHeight: '1.5' }}>
          Esplora la nostra selezione di articoli minimalisti. I prodotti sono caricati dinamicamente da JSON-Server su API REST.
        </p>
      </header>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
        {(['Tutti', 'Cancelleria', 'Elettronica'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid #000',
              backgroundColor: selectedCategory === cat ? '#000' : 'transparent',
              color: selectedCategory === cat ? '#fff' : '#000',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
          Nessun prodotto disponibile in questa categoria.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #eee',
                borderRadius: '6px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                backgroundColor: '#fff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#aaa';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#eee';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px', textAlign: 'center' }}>
                  {product.emoji || '📦'}
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '600', color: '#000' }}>
                  {product.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    margin: '0 0 16px 0',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f5f5f5',
                  paddingTop: '14px',
                  marginTop: '10px',
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#000' }}>
                  {product.price.toFixed(2)} €
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/es34/prodotto/${product.id}`}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      color: '#333',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: '500',
                      transition: 'all 0.1s',
                      backgroundColor: '#fff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#000';
                      e.currentTarget.style.backgroundColor = '#f9f9f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#ccc';
                      e.currentTarget.style.backgroundColor = '#fff';
                    }}
                  >
                    Dettagli
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      border: '1px solid #000',
                      backgroundColor: '#000',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#000';
                    }}
                  >
                    Aggiungi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
