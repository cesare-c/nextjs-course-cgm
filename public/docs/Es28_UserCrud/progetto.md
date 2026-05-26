# Architettura del Progetto: User CRUD Enterprise (Esercizio 28)

Questo documento descrive in dettaglio le decisioni architetturali, la struttura del codice e l'implementazione tecnica del modulo **User CRUD** dell'Esercizio 28. Il progetto è stato progettato per dimostrare pattern avanzati di gestione dello stato, feedback UX coerenti e validazione dei dati multilivello (client-side e server-side).

---

## 💡 Filosofia Architetturale
Nello sviluppo di interfacce CRUD enterprise, la stabilità dell'applicazione e la fiducia dell'utente sono i pilastri fondamentali. Per questo motivo, il progetto si basa su tre pattern principali:

1. **Local Copy Pattern (Isolamento dello Stato):** I dati del form di modifica lavorano su una copia locale dello stato. Nessuna modifica si riflette sulla lista principale finché il server non risponde con successo.
2. **Double-Check Confirmation:** Le azioni distruttive (come la cancellazione di un utente) richiedono una conferma esplicita ed irreversibile tramite interfacce modali dedicate.
3. **Multilevel Validation (Validazione Multilivello):** Lo username viene controllato sia sul client prima del submit, sia sul server tramite middleware per prevenire conflitti in scenari concorrenti.

---

## 🛠️ Struttura delle Cartelle del Progetto

```text
my-app/
├── server.cjs                     # Bootstrapper del backend con middleware custom
├── server/
│   └── db.json                    # File database mockato di json-server
└── src/
    ├── exercises/
    │   └── Es28_UserCrud/
    │       ├── UserCrudContainer.tsx # Orchestratore principale dello stato e delle viste
    │       ├── UserCrudList.tsx      # Tabella degli utenti con paginazione e filtri
    │       ├── UserCrudDetail.tsx    # Visualizzazione delle informazioni del singolo utente
    │       ├── UserCrudForm.tsx      # Form controllato per la creazione e modifica
    │       └── components/           # Componenti UI (es. Modali di cancellazione)
    ├── services/
    │   └── userServiceDay28.ts    # Servizio API per le chiamate RESTful (Axios)
    ├── types/
    │   └── userDay28.ts           # Definizioni dei tipi TypeScript (User, UserInput)
    └── helpers/
        └── userHelpers.ts         # Funzioni helper per validazione e formattazione
```

---

## 💻 Backend: Sincronizzazione ed Evitamento Duplicati
Per garantire l'unicità dello `username` a livello di database, abbiamo sostituito l'avvio diretto di `json-server` con un server Node.js personalizzato (`server.cjs`).

### Il Middleware di Unicità (`server.cjs`)
Prima di salvare qualsiasi nuovo utente, il middleware analizza la chiamata `POST` ed esegue una query sul file `db.json` per assicurarsi che non esistano conflitti di username:

```javascript
// server.cjs - Estratto del Middleware
server.post('/users', (req, res, next) => {
  const { username } = req.body;
  if (!username) return next();

  const db = router.db; 
  const users = db.get('users').value() || [];

  const usernameExists = users.some(
    (u) => u.username && u.username.toLowerCase() === username.trim().toLowerCase()
  );

  if (usernameExists) {
    return res.status(400).json({ 
      message: `L'username "${username}" è già in uso.` 
    });
  }
  next();
});
```

---

## 🧬 Componenti Frontend Chiave

### 1. Il Container Orchestratore (`UserCrudContainer.tsx`)
Gestisce lo stato della vista attiva (`list` | `detail` | `create` | `edit`), l'utente selezionato, i messaggi di errore globali e i feedback visivi.

```typescript
// Gestione flessibile degli ID (Stringhe UUID o Numeri)
const [selectedUserId, setSelectedUserId] = useState<number | string | null>(null);
const [view, setView] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
```

### 2. Tabella Utenti (`UserCrudList.tsx`)
Visualizza gli utenti in modalità paginata, consentendo il filtraggio in base allo stato (`Attivo` / `Non Attivo`) ed esponendo le azioni contestuali.
* **Vedi:** Carica i dettagli completi.
* **Modifica:** Carica il form precompilato.
* **Elimina:** Apre il flusso di rimozione controllata.

### 3. Form Controllato ed Isolato (`UserCrudForm.tsx`)
Implementa il *Local Copy Pattern* inizializzando lo stato locale con i dati dell'utente e impedendo modifiche indesiderate allo stato globale in caso di cancellazione dell'operazione.

> ⚠️ **Regola d'Oro:** Non legare mai direttamente i campi di input a referenze di oggetti memorizzati nello stato globale del padre.

---

## 🧪 Strategie di Testing e Validazione

### Validazione Form Client-Side
Controlla i requisiti minimi di lunghezza e formato del testo:
* Nome e Cognome: minimo 2 caratteri.
* Username: minimo 3 caratteri, senza caratteri speciali non consentiti.
* Email: formato regex standard.

### Gestione degli Errori di Rete
Ogni azione asincrona nel servizio è protetta da costrutti `try-catch-finally` per disabilitare i pulsanti di invio durante la chiamata (`isSaving`), mostrando un indicatore di caricamento ed intercettando eventuali errori `400` o `500` provenienti dal server.
