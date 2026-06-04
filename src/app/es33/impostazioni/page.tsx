'use client';

import { useState } from 'react';

export default function ImpostazioniPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [themeMode, setThemeMode] = useState('system');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Salvataggio...');
    setTimeout(() => {
      setSaveStatus('Impostazioni salvate con successo!');
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 500);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.85rem' }}>
      <header style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#000', margin: '0 0 4px 0' }}>
          Impostazioni Esercizio 33
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#666', margin: 0 }}>
          Modifica le opzioni locali del portale. Questa pagina illustra la conservazione dello stato durante le transizioni di rotta (Next.js client-side navigation).
        </p>
      </header>

      <form onSubmit={handleSave} style={{ border: '1px solid #e0e0e0', padding: '24px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Notifiche */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
          <input
            type="checkbox"
            id="notifications"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="notifications" style={{ fontWeight: '600', cursor: 'pointer' }}>
            Abilita Notifiche Giornaliere E-mail
          </label>
        </div>

        {/* Autosave */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
          <input
            type="checkbox"
            id="autosave"
            checked={autoSave}
            onChange={() => setAutoSave(!autoSave)}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="autosave" style={{ fontWeight: '600', cursor: 'pointer' }}>
            Abilita Salvataggio Automatico
          </label>
        </div>

        {/* Elementi per pagina */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="items" style={{ fontWeight: '600' }}>Elementi per pagina</label>
          <select
            id="items"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontSize: '0.8rem',
              maxWidth: '200px',
            }}
          >
            <option value="5">5 elementi</option>
            <option value="10">10 elementi</option>
            <option value="20">20 elementi</option>
          </select>
        </div>

        {/* Tema */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="theme" style={{ fontWeight: '600' }}>Tema Grafico</label>
          <select
            id="theme"
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontSize: '0.8rem',
              maxWidth: '200px',
            }}
          >
            <option value="system">Sistema (Default)</option>
            <option value="light">Tema Chiaro</option>
            <option value="dark">Tema Scuro</option>
          </select>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              border: '1px solid #000',
              backgroundColor: '#000',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Salva Impostazioni
          </button>
          {saveStatus && (
            <span style={{ fontSize: '0.78rem', color: '#0066cc', fontWeight: '500' }}>
              {saveStatus}
            </span>
          )}
        </div>

      </form>
    </div>
  );
}
