import { useState } from 'react';

export default function DefaultExercise() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Conteggio: {count}</p>
      <button 
        onClick={() => setCount((c) => c - 1)} 
        style={{ 
          marginRight: '10px', 
          padding: '8px 16px',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          backgroundColor: 'var(--bg)',
          color: 'var(--text-h)',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
      >
        -
      </button>
      <button 
        onClick={() => setCount((c) => c + 1)} 
        style={{ 
          padding: '8px 16px',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          backgroundColor: 'var(--bg)',
          color: 'var(--text-h)',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
      >
        +
      </button>
    </div>
  );
}
