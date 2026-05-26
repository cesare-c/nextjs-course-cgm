import { useState } from 'react';

interface RequestTest {
  id: number;
  title: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
  description: string;
  initialState?: string;
  requestBody?: string;
  responseStatus: string;
  responseBody: string;
  dbDiff: string;
}

const testsData: RequestTest[] = [
  {
    id: 1,
    title: '1. GET Lista Completa',
    method: 'GET',
    url: 'http://localhost:3001/tasks',
    description: 'Recupera tutti i task inseriti nel database mock.',
    initialState: 'db.json contiene 4 task iniziali (ID 1-4).',
    responseStatus: '200 OK',
    responseBody: JSON.stringify([
      { id: "1", nome: "Mario Rossi", titolo: "Configurare Ambiente", stato: "completato" },
      { id: "2", nome: "Anna Bianchi", titolo: "Implementare UI", stato: "in_corso" },
      { id: "3", nome: "Luca Verdi", titolo: "Definire API", stato: "da_fare" },
      { id: "4", nome: "Giulia Neri", titolo: "Testare Applicazione", stato: "da_fare" }
    ], null, 2),
    dbDiff: 'Nessuna modifica apportata a db.json.'
  },
  {
    id: 2,
    title: '2. GET Dettaglio Singolo Task',
    method: 'GET',
    url: 'http://localhost:3001/tasks/1',
    description: 'Recupera un singolo task in base all\'ID specificato nel percorso.',
    initialState: '4 task presenti nel database.',
    responseStatus: '200 OK',
    responseBody: JSON.stringify({
      id: "1",
      nome: "Mario Rossi",
      titolo: "Configurare Ambiente",
      stato: "completato"
    }, null, 2),
    dbDiff: 'Nessuna modifica apportata a db.json.'
  },
  {
    id: 3,
    title: '3. GET Lista Paginata',
    method: 'GET',
    url: 'http://localhost:3001/tasks?_page=1&_limit=2',
    description: 'Limita la risposta a una pagina specifica utilizzando i filtri di paginazione nativi di json-server.',
    initialState: '4 task presenti nel database.',
    responseStatus: '200 OK',
    responseBody: JSON.stringify([
      { id: "1", nome: "Mario Rossi", titolo: "Configurare Ambiente", stato: "completato" },
      { id: "2", nome: "Anna Bianchi", titolo: "Implementare UI", stato: "in_corso" }
    ], null, 2),
    dbDiff: 'Nessuna modifica apportata (vengono restituiti solo i primi due task).'
  },
  {
    id: 4,
    title: '4. GET Lista Filtrata',
    method: 'GET',
    url: 'http://localhost:3001/tasks?stato=da_fare',
    description: 'Filtra i record restituendo solo quelli che corrispondono al valore del campo specificato.',
    initialState: '4 task presenti, di cui 2 con stato "da_fare".',
    responseStatus: '200 OK',
    responseBody: JSON.stringify([
      { id: "3", nome: "Luca Verdi", titolo: "Definire API", stato: "da_fare" },
      { id: "4", nome: "Giulia Neri", titolo: "Testare Applicazione", stato: "da_fare" }
    ], null, 2),
    dbDiff: 'Nessuna modifica apportata.'
  },
  {
    id: 5,
    title: '5. GET Lista Filtrata e Paginata',
    method: 'GET',
    url: 'http://localhost:3001/tasks?stato=da_fare&_page=1&_limit=1',
    description: 'Combina i parametri di filtro e paginazione per estrarre sottoinsiemi mirati.',
    initialState: '4 task presenti nel database.',
    responseStatus: '200 OK',
    responseBody: JSON.stringify([
      { id: "3", nome: "Luca Verdi", titolo: "Definire API", stato: "da_fare" }
    ], null, 2),
    dbDiff: 'Nessuna modifica apportata (viene restituito solo il primo dei due elementi "da_fare").'
  },
  {
    id: 6,
    title: '6. POST Creazione Nuovo Elemento',
    method: 'POST',
    url: 'http://localhost:3001/tasks',
    description: 'Aggiunge un nuovo record nel database mock. La risposta restituisce l\'elemento creato con l\'ID assegnato.',
    initialState: '4 task presenti nel database.',
    requestBody: JSON.stringify({
      id: "5",
      nome: "Francesco Russo",
      titolo: "Deploy in Produzione",
      stato: "da_fare"
    }, null, 2),
    responseStatus: '201 Created',
    responseBody: JSON.stringify({
      id: "5",
      nome: "Francesco Russo",
      titolo: "Deploy in Produzione",
      stato: "da_fare"
    }, null, 2),
    dbDiff: 'Aggiunto con successo il record con ID 5 in db.json.'
  },
  {
    id: 7,
    title: '7. PATCH Modifica Parziale',
    method: 'PATCH',
    url: 'http://localhost:3001/tasks/3',
    description: 'Modifica solo i campi passati nel body della richiesta su un record esistente (in questo caso aggiorna lo stato).',
    initialState: '5 task presenti. Il task 3 ha lo stato originale "da_fare".',
    requestBody: JSON.stringify({
      stato: "in_corso"
    }, null, 2),
    responseStatus: '200 OK',
    responseBody: JSON.stringify({
      id: "3",
      nome: "Luca Verdi",
      titolo: "Definire API",
      stato: "in_corso"
    }, null, 2),
    dbDiff: 'In db.json, lo stato del task con ID 3 è passato da "da_fare" a "in_corso".'
  },
  {
    id: 8,
    title: '8. DELETE Cancellazione',
    method: 'DELETE',
    url: 'http://localhost:3001/tasks/4',
    description: 'Rimuove definitivamente un record dal database in base all\'ID specificato.',
    initialState: '5 task presenti.',
    responseStatus: '200 OK',
    responseBody: '{} (Body vuoto)',
    dbDiff: 'Il task con ID 4 (Giulia Neri) è stato rimosso definitivamente da db.json.'
  }
];

export default function TaskApiDocumentation() {
  const [selectedTestId, setSelectedTestId] = useState<number>(1);
  const activeTest = testsData.find(t => t.id === selectedTestId) || testsData[0];

  const getMethodBadgeColor = (method: 'GET' | 'POST' | 'PATCH' | 'DELETE') => {
    switch (method) {
      case 'GET': return { bg: 'rgba(46, 204, 113, 0.15)', text: '#2ecc71' };
      case 'POST': return { bg: 'rgba(52, 152, 219, 0.15)', text: '#3498db' };
      case 'PATCH': return { bg: 'rgba(241, 196, 15, 0.15)', text: '#f1c40f' };
      case 'DELETE': return { bg: 'rgba(231, 76, 60, 0.15)', text: '#e74c3c' };
    }
  };

  const badgeColor = getMethodBadgeColor(activeTest.method);

  return (
    <div style={{
      fontFamily: 'var(--sans)',
      color: 'var(--text)',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* Informazioni di Setup Server */}
      <div style={{
        backgroundColor: 'var(--code-bg)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        fontSize: '0.9rem'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-h)', fontWeight: '600' }}>
          Configurazione Ambiente Mock Server (`json-server`)
        </h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', lineHeight: '1.4' }}>
          Il server mock è integrato direttamente in <strong>`my-app`</strong>. È configurato per funzionare in locale tramite il comando <code>npm run server</code> (oppure tramite <code>npm run dev:all</code> per avviarlo insieme al client), monitorando il file <code>server/db.json</code> sulla porta <strong>3001</strong>.
        </p>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          <span>📂 <strong>Cartella:</strong> my-app/server</span>
          <span>🔌 <strong>Porta:</strong> 3001</span>
          <span>⚡ <strong>Script:</strong> <code>npm run dev:all</code></span>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', marginBottom: '20px', fontStyle: 'italic' }}>
        Clicca sulle schede sottostanti per visualizzare le chiamate REST verificate tramite Postman.
      </p>

      {/* Pannello Principale con sidebar e dettagli */}
      <div style={{
        display: 'flex',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        backgroundColor: 'var(--bg)',
        overflow: 'hidden',
        minHeight: '380px',
        boxShadow: 'var(--shadow)',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row'
      }}>
        {/* Sidebar Selezione Chiamate */}
        <div style={{
          width: window.innerWidth < 768 ? '100%' : '260px',
          borderRight: window.innerWidth < 768 ? 'none' : '1px solid var(--border)',
          borderBottom: window.innerWidth < 768 ? '1px solid var(--border)' : 'none',
          backgroundColor: 'var(--code-bg)',
          padding: '10px 0'
        }}>
          {testsData.map(test => {
            const isSelected = test.id === selectedTestId;
            const mColor = getMethodBadgeColor(test.method);
            return (
              <button
                key={test.id}
                onClick={() => setSelectedTestId(test.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px 16px',
                  background: isSelected ? 'var(--bg)' : 'transparent',
                  border: 'none',
                  borderLeft: isSelected ? '4px solid var(--accent)' : '4px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                  boxSizing: 'border-box'
                }}
              >
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  backgroundColor: mColor.bg,
                  color: mColor.text,
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {test.method}
                </span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? '600' : '500',
                  color: isSelected ? 'var(--text-h)' : 'var(--text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {test.title.split('. ')[1]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Area Dettagli Richiesta/Risposta */}
        <div style={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Chiamata URL e Stato */}
          <div style={{ display: 'flex', justifySelf: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                backgroundColor: badgeColor.bg,
                color: badgeColor.text
              }}>
                {activeTest.method}
              </span>
              <code style={{
                fontSize: '0.85rem',
                backgroundColor: 'var(--code-bg)',
                padding: '4px 8px',
                borderRadius: '4px',
                color: 'var(--text-h)',
                wordBreak: 'break-all'
              }}>
                {activeTest.url}
              </code>
            </div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: activeTest.responseStatus.startsWith('2') ? '#2ecc71' : '#e74c3c'
            }}>
              Status: {activeTest.responseStatus}
            </div>
          </div>

          {/* Descrizione del test */}
          <p style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>
            {activeTest.description}
          </p>

          {/* Stato Iniziale e Delta Database */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            fontSize: '0.8rem',
            backgroundColor: 'var(--code-bg)',
            padding: '12px',
            borderRadius: '6px'
          }}>
            <div>
              <strong style={{ color: 'var(--text-h)' }}>Stato Iniziale:</strong>
              <p style={{ margin: '4px 0 0 0' }}>{activeTest.initialState}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-h)' }}>Modifica db.json (Delta):</strong>
              <p style={{ margin: '4px 0 0 0', color: activeTest.dbDiff.includes('Aggiunto') || activeTest.dbDiff.includes('passato') || activeTest.dbDiff.includes('rimosso') ? 'var(--accent)' : 'var(--text)' }}>
                {activeTest.dbDiff}
              </p>
            </div>
          </div>

          {/* Request Body (se presente) */}
          {activeTest.requestBody && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-h)' }}>
                Request Body (Payload JSON):
              </div>
              <pre style={{
                margin: 0,
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: 'var(--code-bg)',
                border: '1px solid var(--border)',
                fontSize: '0.8rem',
                color: '#e06c75',
                overflowX: 'auto'
              }}>
                {activeTest.requestBody}
              </pre>
            </div>
          )}

          {/* Response Body */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-h)' }}>
              Response Body (Dati Ricevuti):
            </div>
            <pre style={{
              margin: 0,
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--code-bg)',
              border: '1px solid var(--border)',
              fontSize: '0.8rem',
              color: 'var(--text-h)',
              overflowX: 'auto',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <code>{activeTest.responseBody}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
