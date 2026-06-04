'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../CartContext';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingCost,
    total,
    totalItems,
  } = useCart();

  const freeShippingThreshold = 29.0;
  const missingForFreeShipping = freeShippingThreshold - subtotal;

  if (totalItems === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#000', margin: '0 0 10px 0' }}>
          Il tuo carrello è vuoto
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px', lineHeight: '1.5' }}>
          Manca almeno un prodotto nel carrello. Aggiungi un articolo per iniziare gli acquisti ed esplorare le offerte!
        </p>
        <Link
          href="/es34"
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'inline-block',
            transition: 'all 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#000';
          }}
        >
          Vai al Catalogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '0.85rem' }}>
      <header style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#000', margin: '0 0 8px 0' }}>
          Carrello Spesa
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#666', margin: 0 }}>
          Rivedi e modifica gli articoli prima di completare l'ordine.
        </p>
      </header>

      {/* Cart items list */}
      <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: '10px 6px', fontWeight: '600' }}>Prodotto</th>
              <th style={{ padding: '10px 6px', fontWeight: '600', textAlign: 'right' }}>Prezzo</th>
              <th style={{ padding: '10px 6px', fontWeight: '600', textAlign: 'center' }}>Quantità</th>
              <th style={{ padding: '10px 6px', fontWeight: '600', textAlign: 'right' }}>Totale</th>
              <th style={{ padding: '10px 6px', fontWeight: '600', textAlign: 'center' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 6px' }}>
                  <Link
                    href={`/es34/prodotto/${item.product.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      const titleEl = e.currentTarget.querySelector('.product-name-link') as HTMLElement;
                      if (titleEl) titleEl.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      const titleEl = e.currentTarget.querySelector('.product-name-link') as HTMLElement;
                      if (titleEl) titleEl.style.textDecoration = 'none';
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{item.product.emoji}</span>
                    <div>
                      <div className="product-name-link" style={{ fontWeight: '600', color: '#000' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>{item.product.category}</div>
                    </div>
                  </Link>
                </td>
                <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                  {item.product.price.toFixed(2)} €
                </td>
                <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      style={{
                        padding: '2px 8px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontWeight: '700',
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '24px', fontWeight: '600', display: 'inline-block' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      style={{
                        padding: '2px 8px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontWeight: '700',
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td style={{ padding: '12px 6px', textAlign: 'right', fontWeight: '600' }}>
                  {(item.product.price * item.quantity).toFixed(2)} €
                </td>
                <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#cc0000',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textDecoration: 'underline',
                    }}
                  >
                    Rimuovi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Summary & Delivery Calculations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Recommendations & Shipping Prompts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {subtotal >= freeShippingThreshold && totalItems >= 4 ? (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '16px',
                borderRadius: '6px',
                color: '#166534',
                lineHeight: '1.4',
              }}
            >
              <h4 style={{ margin: '0 0 4px 0', fontWeight: '700' }}>✨ Spedizione Gratuita Attiva!</h4>
              <p style={{ margin: 0, fontSize: '0.78rem' }}>
                Complimenti, hai speso almeno 29,00 € e inserito almeno 4 prodotti nel carrello! Le spese di spedizione sono interamente a nostro carico.
              </p>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                padding: '16px',
                borderRadius: '6px',
                color: '#92400e',
                lineHeight: '1.4',
              }}
            >
              <h4 style={{ margin: '0 0 4px 0', fontWeight: '700' }}>🚚 Spedizione Gratuita non raggiunta</h4>
              {subtotal < freeShippingThreshold ? (
                <p style={{ margin: '0 0 8px 0', fontSize: '0.78rem' }}>
                  Ti mancano ancora <strong>{missingForFreeShipping.toFixed(2)} €</strong> per superare la soglia di 29,00 €!
                </p>
              ) : null}
              {totalItems < 4 ? (
                <p style={{ margin: '0 0 8px 0', fontSize: '0.78rem' }}>
                  Ti mancano ancora <strong>{4 - totalItems} prodotti</strong> per avere almeno 4 articoli!
                </p>
              ) : null}
              <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: '#b45309' }}>
                La spedizione è gratuita con almeno 29,00 € di spesa e almeno 4 articoli. Attualmente le spese sono di 3,99 € ogni 4 prodotti (Spedizione: {shippingCost.toFixed(2)} €).
              </p>
              <Link
                href="/es34"
                style={{
                  color: '#0066cc',
                  textDecoration: 'underline',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                }}
              >
                Continua lo shopping &rarr;
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={clearCart}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                color: '#666',
                cursor: 'pointer',
                fontSize: '0.78rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#999';
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ccc';
                e.currentTarget.style.color = '#666';
              }}
            >
              Svuota Carrello
            </button>
            <Link
              href="/es34"
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #000',
                backgroundColor: '#fff',
                color: '#000',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '0.78rem',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              Continua lo Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Financial Totals */}
        <div
          style={{
            border: '1px solid #eee',
            borderRadius: '6px',
            padding: '20px',
            backgroundColor: '#fafafa',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '700', color: '#000', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
            Riepilogo Ordine
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#555' }}>Subtotale Articoli ({totalItems}):</span>
            <span style={{ fontWeight: '500' }}>{subtotal.toFixed(2)} €</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#555' }}>Costi Spedizione:</span>
            {shippingCost === 0 ? (
              <span style={{ color: '#166534', fontWeight: '700' }}>Gratis</span>
            ) : (
              <span style={{ fontWeight: '500' }}>{shippingCost.toFixed(2)} €</span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #ccc',
              paddingTop: '16px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#000' }}>Totale:</span>
            <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#000' }}>{total.toFixed(2)} €</span>
          </div>

          <button
            onClick={() => alert('Grazie! E-commerce simulato con successo.')}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#166534',
              color: '#fff',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#14532d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#166534';
            }}
          >
            Procedi al Pagamento
          </button>
        </div>

      </div>
    </div>
  );
}
