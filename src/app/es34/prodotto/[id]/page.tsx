'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart, Product } from '../../CartContext';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Prodotto non trovato nel catalogo');
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontSize: '0.9rem', color: '#666' }}>
        Caricamento dettagli prodotto in corso...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: '20px', border: '1px dashed #ff0000', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#ff0000' }}>Prodotto non trovato</h3>
        <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '16px' }}>{error || 'Il prodotto richiesto non esiste.'}</p>
        <Link href="/es34" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.82rem' }}>
          Torna al Catalogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.85rem' }}>
      <Link href="/es34" style={{ color: '#666', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Torna al catalogo prodotti
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <span style={{ fontSize: '3rem' }}>{product.emoji || '📦'}</span>
        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#888', fontWeight: '700', letterSpacing: '0.5px' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '4px 0 0 0', color: '#000' }}>
            {product.name}
          </h1>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600', width: '150px' }}>ID Prodotto:</td>
            <td style={{ padding: '10px 0', fontFamily: 'monospace' }}>{product.id}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Descrizione:</td>
            <td style={{ padding: '10px 0', lineHeight: '1.4', color: '#333' }}>{product.description}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Categoria:</td>
            <td style={{ padding: '10px 0' }}>{product.category}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 0', fontWeight: '600' }}>Prezzo Unitario:</td>
            <td style={{ padding: '10px 0', fontSize: '1.1rem', fontWeight: '700', color: '#000' }}>
              {product.price.toFixed(2)} €
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={() => addToCart(product)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #000',
            backgroundColor: '#000',
            color: '#fff',
            fontSize: '0.9rem',
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
          Aggiungi al Carrello 🛒
        </button>
      </div>
    </div>
  );
}
