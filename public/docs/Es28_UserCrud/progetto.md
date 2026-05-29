# Progetto: User CRUD App - Guida Interattiva Step-by-Step

Benvenuto nel percorso didattico guidato per lo sviluppo completo dell'applicazione **User CRUD**. In questa guida procederemo in modo incrementale per apprendere le migliori pratiche architetturali, la gestione dello stato in React, l'integrazione di TypeScript e la configurazione del backend mock.

---

## 🗺️ Roadmap delle Macro-Fasi

* **Step 1: Configurazione ambiente + Backend (json-server, db.json, custom middleware)**
  * *Cosa imparerai:* Perché partire dal modello dati, l'impostazione di un server mock per simulare API reali ed il controllo di unicità degli username sul server.
* **Step 2: Modellazione dei Tipi e Helper di Validazione (userDay28.ts, userHelpers.ts)**
  * *Cosa imparerai:* La definizione dei contratti TypeScript per le entità (`User` e `UserInput`) ed helpers per validazione e formattazione.
* **Step 3: Servizio API con Axios (userServiceDay28.ts)**
  * *Cosa imparerai:* Come centralizzare le chiamate REST, gestire le query string per filtri e paginazione ed isolare lo strato di rete.
* **Step 4: Smart Component - Orchestrazione e Stato Globale (UserCrudContainer.tsx)**
  * *Cosa imparerai:* Il pattern Container-Presentational, la macchina a stati per caricamento/errore e il coordinamento delle viste.
* **Step 5: Dumb Component - Tabella Utenti, Filtri e Paginazione (UserCrudList.tsx)**
  * *Cosa imparerai:* Il rendering presentazionale basato esclusivamente su `props`, i controlli di paginazione e i trigger degli eventi del padre.
* **Step 6: Dumb Component - Form di Creazione/Modifica Isolato (UserCrudForm.tsx)**
  * *Cosa imparerai:* L'isolamento dello stato (Local Copy Pattern), touched fields e validazioni real-time in input.
* **Step 7: Dumb Component - Dettaglio Utente e Sicurezza (UserCrudDetail.tsx)** 👈 *Siamo qui*
  * *Cosa imparerai:* La visualizzazione dell'entità singola, il freno cognitivo di sicurezza (doppia conferma) ed il blocco delle azioni concorrenti.

---

## 👉 STEP 1: Configurazione ambiente + Backend

### 1. Perché iniziamo dal Backend?
Nello sviluppo di software professionale, **iniziare definendo le API e il modello dati (il backend) è una regola d'oro**. 
Definire anticipatamente la struttura del database (`db.json`) e i contratti delle chiamate HTTP (le rotte del server) crea un **contratto chiaro**. Consente di:
1. Sapere esattamente quali dati il frontend riceverà e quali dovrà inviare.
2. Evitare di inventare formati di dati temporanei sul client che poi non corrispondono al server, costringendoci a pesanti refactoring.
3. Simulando fin da subito la rete, possiamo testare la resilienza dell'app (es. caricamento lento o errori di rete).

### 2. Struttura del Database Mock (`server/db.json`)
Il database mock è rappresentato da un semplice file JSON gestito da `json-server`. Questo file manterrà la persistenza locale delle operazioni CRUD.

```json
{
  "users": [
    {
      "id": "1",
      "username": "mrossi",
      "email": "mario.rossi@example.com",
      "isActive": true,
      "firstName": "Mario",
      "lastName": "Rossi",
      "middleName": "Luigi"
    }
  ]
}
```

### 3. Struttura del Server Personalizzato (`server.js`)
Per simulare comportamenti reali come la **validazione di unicità dell'username** a livello di database, usiamo un file `server.js` che avvia `json-server` programmabile, intercettando le richieste `POST` per impedire la registrazione di username duplicati.

```javascript
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createApp } from './node_modules/json-server/lib/app.js';

const adapter = new JSONFile('server/db.json');
const db = new Low(adapter, {});
await db.read();

const app = createApp(db);

// Middleware personalizzato per validare l'unicità dell'username lato server
app.middleware.unshift({
  handler: (req, res, next) => {
    if (req.method === 'POST' && req.url.startsWith('/users')) {
      const { username } = req.body || {};
      if (username) {
        const users = db.data.users || [];
        const exists = users.some(
          (u) => u.username && u.username.toLowerCase() === username.trim().toLowerCase()
        );
        if (exists) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: `L'username "${username}" è già in uso.` }));
          return;
        }
      }
    }
    next();
  },
  type: 'mw'
});

app.listen(3001, () => {
  console.log('JSON Server Custom Middleware is running on http://localhost:3001');
});
```

### 💡 Best Practice
* **Validazione su due livelli:** La validazione dello username deve essere fatta sia sul client (per dare un feedback immediato all'utente senza fare chiamate di rete) sia sul server (perché in uno scenario reale più utenti potrebbero tentare di registrarsi contemporaneamente con lo stesso username).
* **Porta dedicata:** Teniamo il backend mock su una porta diversa (es. `3001`) rispetto al frontend React (es. `5173`) per simulare un ambiente multi-origine (CORS).

---

## 🧪 Esercizio dello Step 1
1. Apri il terminale del tuo progetto ed esegui il server mock (solitamente lanciato con `node server.js` o `npm run server`).
2. Utilizzando uno strumento come **Postman**, **Thunder Client** o semplicemente una chiamata `curl` da terminale, effettua una chiamata `POST` all'indirizzo `http://localhost:3001/users` tentando di inserire un utente con lo username `"mrossi"` (che è già presente nel database `db.json`).
3. Verifica che il server risponda correttamente con uno status code `400 Bad Request` e con il messaggio di errore: `L'username "mrossi" è già in uso.`.

---

## 👉 STEP 2: Modellazione dei Tipi e Helper di Validazione

### 1. Obiettivo Concettuale
In un'applicazione TypeScript di livello enterprise, la **Type Safety** (sicurezza dei tipi) e la **separazione delle responsabilità** sono fondamentali. 
* **Perché tipizzare i dati?** Definendo i modelli dati (`User` e `UserInput`), costringiamo il compilatore TypeScript a segnalarci immediatamente errori di programmazione (es. tentativi di scrivere una proprietà inesistente o assegnare un numero a un'email).
* **Perché separare gli helper dai componenti?** Funzioni come `formatFullName` (formattazione) e `validateUserForm` (validazione) sono funzioni **pure** (pure functions). Non hanno bisogno dello stato di React e possono essere testate in isolamento (unit testing) e riutilizzate sia in visualizzazione che nei form senza duplicazione di codice.

### 2. Struttura del File dei Tipi (`src/types/userDay28.ts`)
Creiamo un file per definire l'entità principale salvata a database (`User`) e la sua versione da usare durante la sottomissione dei form (`UserInput`), dove il campo `id` non è ancora presente.

```typescript
export interface User {
  id: number | string;
  username: string;
  email: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  middleName?: string; // Il punto interrogativo indica una proprietà opzionale
}

export interface UserInput {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  isActive?: boolean;
}
```

### 3. Struttura del File Helper (`src/helpers/userHelpers.ts`)
Definiamo le funzioni pure per formattare il nome completo ed eseguire controlli robusti su tutti i campi obbligatori ed opzionali prima di inviare i dati.

```typescript
import type { User, UserInput } from '../types/userDay28';

/**
 * Formatta il nome completo dell'utente includendo il secondo nome se presente.
 */
export function formatFullName(user: User | { firstName: string; lastName: string; middleName?: string }): string {
  const { firstName, lastName, middleName } = user;
  const parts = [
    firstName.trim(),
    middleName && middleName.trim() ? middleName.trim() : '',
    lastName.trim()
  ].filter(Boolean);
  return parts.join(' ');
}

/**
 * Valida i dati inseriti nel form utente e restituisce un dizionario contenente gli errori riscontrati.
 */
export function validateUserForm(input: UserInput): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validazione Username: obbligatorio, lunghezza minima, caratteri ammessi
  if (!input.username || !input.username.trim()) {
    errors.username = 'Username è obbligatorio.';
  } else if (input.username.trim().length < 3) {
    errors.username = 'Username deve contenere almeno 3 caratteri.';
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(input.username.trim())) {
    errors.username = 'Username può contenere solo lettere, numeri, punti, trattini e underscore.';
  }

  // Validazione Email: obbligatoria e formato regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !input.email.trim()) {
    errors.email = 'Email è obbligatoria.';
  } else if (!emailRegex.test(input.email.trim())) {
    errors.email = 'Inserisci un indirizzo email valido.';
  }

  // Validazione Nome
  if (!input.firstName || !input.firstName.trim()) {
    errors.firstName = 'Nome è obbligatorio.';
  } else if (input.firstName.trim().length < 2) {
    errors.firstName = 'Nome deve contenere almeno 2 caratteri.';
  }

  // Validazione Cognome
  if (!input.lastName || !input.lastName.trim()) {
    errors.lastName = 'Cognome è obbligatorio.';
  } else if (input.lastName.trim().length < 2) {
    errors.lastName = 'Cognome deve contenere almeno 2 caratteri.';
  }

  return errors;
}
```

### 💡 Best Practice
* **Optional Chaining ed Optional Properties:** Proprietà come `middleName?: string` indicano che il valore può essere `undefined`. In questo modo TypeScript non ti costringerà a popolarlo ma ti obbligherà a gestire la possibilità che non ci sia quando provi a manipolarlo (es. con controlli protetti tipo `middleName && middleName.trim()`).
* **Funzioni pure:** Mantieni le funzioni helper senza effetti collaterali (Side Effects). Esse ricevono input e restituiscono output in modo deterministico, facilitando la leggibilità.

---

## 🧪 Esercizio dello Step 2
1. Crea/modifica i file indicati nelle rispettive cartelle (`src/types/userDay28.ts` e `src/helpers/userHelpers.ts`).
2. Scrivi una piccola funzione di test (o un semplice script in un file scratch) che invochi `validateUserForm` passandogli un oggetto `UserInput` non valido (ad esempio con un'email malformata o un nome vuoto) e stampa a console l'oggetto `errors` risultante per verificare che i messaggi di errore vengano popolati correttamente.

---

## 👉 STEP 3: Servizio API con Axios

### 1. Obiettivo Concettuale
Nello sviluppo di applicazioni web moderne, **disaccoppiare lo strato di rete (le chiamate HTTP) dai componenti React** è fondamentale per la manutenibilità e la testabilità del codice.
* **Perché usare un file di servizio dedicato (`userServiceDay28.ts`)?** I componenti non devono conoscere gli URL, i metodi o gli header delle chiamate API. Devono semplicemente chiedere dati o inviare comandi (es. `userServiceDay28.fetchUsers()`).
* **Isolamento dell'infrastruttura:** Se in futuro decidessi di sostituire Axios con la libreria nativa `fetch`, o se l'URL dell'API cambiasse, dovrai modificare un solo file di servizio, lasciando intatti tutti i componenti grafici dell'applicazione.

### 2. Struttura del Servizio API (`src/services/userServiceDay28.ts`)
Il servizio gestirà le richieste asincrone per implementare le quattro operazioni fondamentali del flusso CRUD, integrando supporto per la **paginazione** e i **filtri** sul server tramite la query string del browser.

```typescript
import axios from 'axios';
import type { User, UserInput } from '../types/userDay28';

const API_URL = 'http://localhost:3001/users';
const DELAY_MS = 800; // Ritardo fittizio per simulare la latenza di rete nelle risposte UI

const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

// Funzione helper per mappare gli ID e mantenere la coerenza dei tipi (TypeScript)
const mapUser = (user: any): User => ({
  ...user,
  id: isNaN(Number(user.id)) ? user.id : Number(user.id)
});

export const userServiceDay28 = {
  // Lettura Paginata e Filtrata (Read List)
  async fetchUsers(
    page: number,
    limit: number,
    filter: 'all' | 'active' | 'inactive',
    simulateError = false
  ): Promise<{ users: User[]; total: number }> {
    if (simulateError) {
      await delay();
      throw new Error('Errore di rete simulato: impossibile recuperare la lista degli utenti.');
    }

    // Costruiamo l'URL gestendo la paginazione e i filtri di stato
    let url = `${API_URL}?_page=${page}&_per_page=${limit}`;
    if (filter === 'active') url += '&isActive=true';
    else if (filter === 'inactive') url += '&isActive=false';

    try {
      const response = await axios.get<any>(url);

      // Supporto per il formato di risposta nativo di json-server v1
      if (response.data && !Array.isArray(response.data) && Array.isArray(response.data.data)) {
        const total = typeof response.data.items === 'number' ? response.data.items : response.data.data.length;
        return { users: response.data.data.map(mapUser), total };
      }

      // Supporto per il formato legacy (json-server v0.x) con header x-total-count
      if (Array.isArray(response.data)) {
        const totalHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'];
        const total = totalHeader ? parseInt(totalHeader, 10) : response.data.length;
        return { users: response.data.map(mapUser), total };
      }
    } catch (error) {
      console.warn("Chiamata fallita in formato v1, provo il formato fallback legacy...");
    }

    // Fallback: query string con parametri _limit legacy
    let fallbackUrl = `${API_URL}?_page=${page}&_limit=${limit}`;
    if (filter === 'active') fallbackUrl += '&isActive=true';
    else if (filter === 'inactive') fallbackUrl += '&isActive=false';

    const response = await axios.get<any>(fallbackUrl);
    const totalHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'];
    const total = totalHeader ? parseInt(totalHeader, 10) : response.data.length;
    return { users: response.data.map(mapUser), total };
  },

  // ... (Altre chiamate API come fetchUserById, createUser, updateUser, deleteUser)
};
```

### 💡 Best Practice
* **Tipizzare le risposte asincrone (`Promise<T>`):** Assicurati che ogni metodo dichiari esplicitamente il tipo restituito, es. `Promise<User>`. Questo impedisce che nel componente si riceva un tipo indefinito (`any`), mantenendo solida la catena dei tipi.
* **Simulazione della latenza di rete:** L'introduzione di un piccolo ritardo artificiale (`delay()`) è fondamentale in ambiente di sviluppo per testare il corretto funzionamento visivo degli *spinner* e dei pulsanti disabilitati durante i caricamenti.

---

## 🧪 Esercizio dello Step 3
1. Crea il file `src/services/userServiceDay28.ts` e configuralo con le chiamate Axios indicate.
2. Nello script temporaneo utilizzato in precedenza, prova ad importare `userServiceDay28` ed effettua una chiamata a `fetchUsers(1, 5, 'all')`.
3. Stampa a console l'array di utenti e il valore `total` restituiti, assicurandoti che i dati vengano recuperati correttamente dal server mock a porta `3001`.

---

## 👉 STEP 4: Smart Component - Orchestrazione e Stato Globale

### 1. Obiettivo Concettuale
In un'architettura **Container-Presentational**, il Container (`UserCrudContainer.tsx`) è lo **Smart Component** (Componente Intelligente).
* **Di cosa si occupa?** Gestisce l'intera macchina a stati del modulo (viste attive, caricamenti, errori), conserva lo stato dei dati scaricati dal database e si occupa di invocare i servizi API.
* **Come comunica con la grafica?** I sotto-componenti presentazionali (`UserCrudList`, `UserCrudForm`, `UserCrudDetail`) rimangono **Dumb** (stupidi): non sanno nulla dell'API e ricevono dati ed eventi sotto forma di `props` passate dal Container.

### 2. Struttura del Container (`src/exercises/Es28_UserCrud/UserCrudContainer.tsx`)
Il Container modella lo stato della vista e la macchina a stati del ciclo di vita della UI (`idle` | `loading` | `success` | `empty` | `error`):

```typescript
import { useState, useEffect, useCallback } from 'react';
import type { User, UserInput } from '../../types/userDay28';
import { userServiceDay28 } from '../../services/userServiceDay28';

// Vengono importati i dumb component figli che orchestreremo
import UserCrudListDay28 from './UserCrudList';
import UserCrudDetailDay28 from './UserCrudDetail';
import UserCrudFormDay28 from './UserCrudForm';
import MessageModal from '../../shared/MessageModal';

type ViewMode = 'list' | 'detail' | 'create' | 'edit';
type UIState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

const LIMIT = 5;

export default function UserCrudContainerDay28() {
  // Stato di Navigazione
  const [view, setView] = useState<ViewMode>('list');
  const [selectedUserId, setSelectedUserId] = useState<number | string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Stato dei Dati (Lista)
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Stato UI (Macchina a Stati)
  const [uiState, setUiState] = useState<UIState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Toggles di simulazione
  const [simulateError, setSimulateError] = useState<boolean>(false);

  // ... (Logica di caricamento con loadUsers ed eventi CUD)
}
```

### 💡 Best Practice
* **Macchina a stati finiti per la UI:** Evita di usare molteplici booleani sparsi come `isLoading`, `isError`, `isEmpty`. Usare un tipo unione come `UIState = 'idle' | 'loading' | 'success' | 'empty' | 'error'` impedisce stati impossibili.
* **useCallback per le dipendenze:** Memorizza funzioni passate ai componenti figli o inserite nei `useEffect` con `useCallback` per evitare cicli infiniti di ri-rendering.

---

## 🧪 Esercizio dello Step 4
1. Ispeziona la struttura di `UserCrudContainer.tsx` sul tuo progetto.
2. Identifica dove viene invocato `renderUIState`: spiega perché gestire le viste di caricamento ed errore qui all'interno evita di inquinare il codice JSX principale del `return`.
3. Inserisci un `console.log("uiState cambiato in:", uiState)` nel corpo del componente e controlla nel pannello di ispezione del browser le varie transizioni di stato della UI che avvengono durante l'apertura e la navigazione dell'app.

---

## 👉 STEP 5: Dumb Component - Tabella Utenti, Filtri e Paginazione

### 1. Obiettivo Concettuale
Il componente `UserCrudList.tsx` è un **Dumb Component** (Componente Presentazionale).
* **Cosa significa?** Non gestisce alcuno stato di business, non comunica con Axios e non sa da dove provengano gli utenti. Il suo unico compito è presentare la tabella grafica, i filtri e la paginazione basandosi esclusivamente sulle `props` ricevute dal padre.
* **Controllo degli eventi (Callbacks):** Qualsiasi azione dell'utente (cambio pagina, selezione filtro, clic sul bottone "Elimina") viene delegata all'esterno tramite funzioni callback passate come props.

### 2. Definizione dell'Interfaccia delle Props (`UserCrudListProps`)
Per garantire il corretto disaccoppiamento ed il controllo statico dei tipi da parte di TypeScript, definiamo tutte le props richieste:

```typescript
import type { User } from '../../types/userDay28';

interface UserCrudListProps {
  users: User[];
  total: number;
  currentPage: number;
  limit: number;
  filter: 'all' | 'active' | 'inactive';
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  onPageChange: (page: number) => void;
  onSelectUser: (id: number | string) => void;
  onAddUser: () => void;
  onEditUser: (id: number | string) => void;
  onDeleteUser: (id: number | string) => Promise<void>;
  isActionInProgress: boolean; // Disabilita i controlli durante operazioni asincrone
}
```

### 3. Logica e Rendering Paginazione
Il componente presentazionale calcola autonomamente il numero totale di pagine per abilitare/disabilitare i bottoni:

```typescript
export default function UserCrudListDay28({
  users,
  total,
  currentPage,
  limit,
  filter,
  onFilterChange,
  onPageChange,
  onSelectUser,
  onAddUser,
  onEditUser,
  onDeleteUser,
  isActionInProgress
}: UserCrudListProps) {
  // Calcolo matematico del numero di pagine (arrotando all'intero superiore)
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      {/* Selettore Filtro di Stato */}
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
        disabled={isActionInProgress}
      >
        <option value="all">Tutti gli utenti</option>
        <option value="active">Solo attivi</option>
        <option value="inactive">Solo non attivi</option>
      </select>

      {/* Rendering della Tabella Utenti (con rendering condizionale dell'Avatar) */}
      
      {/* Pulsanti Paginazione */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isActionInProgress}
      >
        Precedente
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isActionInProgress}
      >
        Successivo
      </button>
    </div>
  );
}
```

### 💡 Best Practice
* **Disabilitazione controlli (`isActionInProgress`):** È una regola fondamentale disabilitare i pulsanti della tabella, i filtri ed i tasti di paginazione mentre un'azione asincrona (come l'eliminazione o il salvataggio di un utente) è in corso. Impedisce all'utente di effettuare clic multipli che genererebbero richieste concorrenti indesiderate.
* **Riuso di helper puri:** Nel rendering della tabella, formattare il nome completo importando `formatFullName` dallo step 2 mantiene il componente concentrato sulla sola visualizzazione.

---

## 🧪 Esercizio dello Step 5
1. Ispeziona `UserCrudList.tsx` nel tuo editor.
2. Nota come viene calcolato `totalPages = Math.ceil(total / limit) || 1`. Cosa succede se il valore `total` restituito dal server è `0`? Perché l'operatore di fallback `|| 1` è importante per evitare che venga mostrato `Pagina 1 di 0`?
3. Modifica la visualizzazione della tabella per aggiungere un piccolo avatar circolare colorato contenente le iniziali del nome dell'utente (utilizzando ad esempio la prima lettera del `firstName` e del `lastName` unite).

---

## 👉 STEP 6: Dumb Component - Form di Creazione/Modifica Isolato

### 1. Obiettivo Concettuale
Il componente `UserCrudForm.tsx` gestisce l'inserimento e la modifica dei dati di un utente.
* **Perché isolare lo stato (Local Copy Pattern)?** Quando l'utente digita nei campi di input, le modifiche devono rimanere confinate in uno stato locale del form (`formValues`). Questo evita di contaminare o alterare lo stato del genitore (Container) prima che i dati siano stati effettivamente validati e che il server abbia risposto con esito positivo (`200 OK` o `201 Created`).
* **Touched Fields:** Per garantire una UX premium, non dobbiamo aggredire l'utente con messaggi di errore rossi appena apre il form vuoto. Registriamo quali campi sono stati toccati (`touched`) in modo da visualizzare l'errore solo dopo che l'utente ha cliccato e poi deselezionato (onBlur) un input, o solo al submit finale.

### 2. Struttura del Form (`src/exercises/Es28_UserCrud/UserCrudForm.tsx`)
Il componente dichiara le props per ricevere l'eventuale utente da modificare (`initialUser`), il callback di sottomissione (`onSubmit`), quello di annullamento (`onCancel`) e lo stato di salvataggio asincrono (`isSaving`).

```typescript
import { useState, useEffect } from 'react';
import type { UserInput, User } from '../../types/userDay28';
import { validateUserForm } from '../../helpers/userHelpers';

interface UserCrudFormProps {
  initialUser?: User;
  onSubmit: (input: UserInput) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function UserCrudFormDay28({ initialUser, onSubmit, onCancel, isSaving }: UserCrudFormProps) {
  const isEdit = !!initialUser;

  // Stato locale per contenere la copia dei dati in scrittura
  const [formValues, setFormValues] = useState<UserInput>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Effetto per popolare lo stato locale se siamo in modalità di modifica (Edit mode)
  useEffect(() => {
    if (initialUser) {
      setFormValues({
        username: initialUser.username,
        email: initialUser.email,
        firstName: initialUser.firstName,
        lastName: initialUser.lastName,
        middleName: initialUser.middleName || '',
        isActive: initialUser.isActive
      });
    }
  }, [initialUser]);

  // ... (Gestione dei cambi input con handleChange, focus con handleBlur e invio con handleSubmit)
}
```

### 💡 Best Practice
* **Validazione su Blur (`onBlur`):** Effettuare la validazione sull'evento di sfuocamento è lo standard di settore. Consente all'utente di finire di digitare l'email senza ricevere continui avvisi di "formato non valido" a ogni carattere immesso.
* **Separazione dei flussi Creazione/Modifica:** Nel nostro form, nascondiamo il checkbox `isActive` durante la creazione perché un nuovo utente deve essere registrato obbligatoriamente come attivo. Lo mostriamo solo in modifica per consentire la disattivazione.

---

## 🧪 Esercizio dello Step 6
1. Ispeziona `UserCrudForm.tsx` nel tuo editor.
2. Trova la riga in cui viene definita la costante `isEdit = !!initialUser`. Perché la sintassi della doppia negazione (`!!`) è usata per convertire l'oggetto `initialUser` (che può essere definito o `undefined`) in un valore strettamente booleano?
3. Spiega come la logica condizionale del form nasconde/mostra il checkbox dello stato utente (`isActive`) a seconda che `isEdit` sia `true` o `false`.

---

## 👉 STEP 7: Dumb Component - Dettaglio Utente e Sicurezza

### 1. Obiettivo Concettuale
Il componente `UserCrudDetail.tsx` visualizza le informazioni complete di un utente selezionato e gestisce l'eliminazione con una logica di sicurezza preventiva.
* **Freno cognitivo (Doppia conferma):** Le eliminazioni di record sono azioni distruttive irreversible. È considerata una pessima UX consentire la cancellazione al singolo clic (che potrebbe avvenire per errore). Introduciamo un freno cognitivo tramite uno stato locale `showConfirmDelete` che mostra un pannello di conferma *inline* prima di chiamare il gestore del genitore.
* **Disabilitazione in transizione:** Durante il processo di eliminazione asincrona (mentre `isDeleting` è `true`), tutti i pulsanti devono essere bloccati per impedire che l'utente effettui altre azioni o navighi in parti instabili dell'applicazione.

### 2. Struttura del Componente Dettaglio (`src/exercises/Es28_UserCrud/UserCrudDetail.tsx`)
Il componente richiede le props dell'utente selezionato (`user`), le callback per tornare alla lista (`onBack`), per avviare la modifica (`onEdit`), per confermare la cancellazione (`onDelete`) e lo stato asincrono (`isDeleting`).

```typescript
import { useState } from 'react';
import type { User } from '../../types/userDay28';
import { formatFullName } from '../../helpers/userHelpers';

interface UserCrudDetailProps {
  user: User;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export default function UserCrudDetailDay28({ user, onBack, onEdit, onDelete, isDeleting }: UserCrudDetailProps) {
  // Stato locale di sicurezza per la conferma di eliminazione
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <div>
      {/* Visualizzazione Profilo e Avatar */}
      <h3>{formatFullName(user)}</h3>
      <p>@{user.username}</p>

      {/* Tabella dettagliata dei campi */}
      <div>
        <p><strong>Email:</strong> {user.email}</p>
        {user.middleName && <p><strong>Secondo Nome:</strong> {user.middleName}</p>}
      </div>

      {/* Bottoni di Azione Condizionali basati sul freno cognitivo */}
      {!showConfirmDelete ? (
        <div>
          <button onClick={onBack} disabled={isDeleting}>Torna alla Lista</button>
          <button onClick={onEdit} disabled={isDeleting}>Modifica</button>
          <button onClick={() => setShowConfirmDelete(true)} disabled={isDeleting}>Elimina</button>
        </div>
      ) : (
        <div style={{ border: '1px solid #ffccc7', padding: '15px', borderRadius: '8px' }}>
          <p style={{ color: '#ff4d4f' }}>Sei sicuro di voler eliminare questo utente? L'operazione è irreversibile.</p>
          <button onClick={() => setShowConfirmDelete(false)} disabled={isDeleting}>Annulla</button>
          <button onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? 'Eliminazione...' : 'Conferma ed Elimina'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### 💡 Best Practice
* **Rendering condizionale pulito (Short-circuit):** Utilizzare la sintassi `{user.middleName && ...}` per visualizzare le righe dei dati opzionali è la via più dichiarativa in React. Evita di visualizzare stringhe vuote o righe di tabella vuote.
* **Prevenzione double-trigger:** Oltre a disabilitare i pulsanti con `disabled={isDeleting}`, la UI deve informare visivamente l'utente dello stato dell'operazione (es. cambiando il testo in `"Eliminazione..."`).

---

## 🧪 Esercizio dello Step 7
1. Ispeziona `UserCrudDetail.tsx` nel tuo editor.
2. Trova il blocco condizionale governato da `showConfirmDelete`: descrivi come lo stato locale gestisce il cambio visivo tra il set di bottoni standard e il box rosso di avvertimento.
3. Prova a cliccare su "Elimina" e poi su "Annulla" per sperimentare come il freno cognitivo protegga l'utente senza forzarlo ad interagire con i fastidiosi box alert nativi del browser (`window.confirm`).
