# Progetto: Dashboard Risorse e Navigazione Isolata (Giorno 33)

Benvenuto nella guida didattica interattiva step-by-step per l'applicazione **ResourcePortal** (Giorno 33). Questa applicazione è stata sviluppata utilizzando **Next.js 15 (App Router)** e dimostra l'efficacia di un'architettura modulare a rotte nidificate, l'isolamento dei layout, la gestione dello stato client-side e il recupero dei parametri dinamici in un ambiente SSR/CSR ibrido.

---

## 🗺️ Roadmap delle Macro-Fasi

* **Step 1: Struttura del Routing e Layout Principale (layout.tsx & page.tsx)**
  * *Cosa imparerai:* La gestione delle rotte in Next.js, come creare un layout root di modulo isolato e come strutturare la Dashboard con statistiche riassuntive e record recenti.
* **Step 2: Centralizzazione e Modellazione dei Dati (mockData.ts)**
  * *Cosa imparerai:* La definizione delle interfacce TypeScript per `User` e `Activity` e la creazione di un dataset mock statico coerente.
* **Step 3: Layout Risorse e Tab Sub-Routing (risorse/layout.tsx & risorse/page.tsx)**
  * *Cosa imparerai:* Come creare un layout annidato specifico per un'area (Risorse) e gestire i redirect interni per un'esperienza utente senza interruzioni.
* **Step 4: Filtri e Ricerca sugli Elenchi Risorse (utenti/page.tsx & attivita/page.tsx)**
  * *Cosa imparerai:* Come implementare filtri avanzati client-side basati su input di testo e stati unione per liste dense di dati.
* **Step 5: Pagine di Dettaglio Dinamiche e Parametri di Navigazione (utenti/[id] & attivita/[id])**
  * *Cosa imparerai:* L'utilizzo di rotte dinamiche in Next.js App Router, l'estrazione sicura dei parametri tramite l'hook `useParams` e la correlazione relazionale tra dati (utente assegnato ad un'attività).
* **Step 6: Pagina Impostazioni e Persistenza Simulata (impostazioni/page.tsx)**
  * *Cosa imparerai:* Come gestire form complessi di configurazione globale e persistere le scelte dell'utente in `localStorage` in modo sicuro rispetto all'idratazione SSR/CSR.
* **Step 7: Ottimizzazione della Navigazione per l'Ambiente di Sviluppo (Dev Mode Fix)**
  * *Cosa imparerai:* Perché l'uso di tag standard `<a>` è preferibile a `<Link>` durante lo sviluppo per evitare `ChunkLoadError` dovuti alla compilazione on-demand delle pagine non ancora visitate.

---

## 👉 STEP 1: Struttura del Routing e Layout Principale

In Next.js App Router, la struttura delle cartelle all'interno di `src/app` definisce le rotte dell'applicazione. Ogni cartella rappresenta un segmento di URL, e i file `layout.tsx` e `page.tsx` ne governano rispettivamente la struttura persistente e il contenuto della pagina.

### 1. Il Layout Root del Modulo (`src/app/es33/layout.tsx`)
Questo layout funge da contenitore principale per l'intero esercizio del Giorno 33. Contiene la testata (`Navbar` dell'esercizio) ed isola lo stile e le variabili CSS del portale dal resto dell'applicazione.

```tsx
'use client';

import { usePathname } from 'next/navigation';

export default function Es33Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getLinkStyle = (href: string) => {
    const isActive = href === '/es33' ? pathname === '/es33' : pathname.startsWith(href);
    return {
      color: isActive ? 'var(--accent)' : 'var(--text)',
      background: isActive ? 'var(--accent-bg)' : 'transparent',
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: '600',
    };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 32px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="/es33" style={getLinkStyle('/es33')}>📈 Dashboard</a>
          <a href="/es33/risorse/utenti" style={getLinkStyle('/es33/risorse')}>📦 Risorse</a>
          <a href="/es33/impostazioni" style={getLinkStyle('/es33/impostazioni')}>⚙️ Impostazioni</a>
        </div>
        <a href="/" style={{ border: '1px solid var(--border)', padding: '8px 16px' }}>
          ↩️ Home Esercizi
        </a>
      </nav>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
```

### 2. La Dashboard (`src/app/es33/page.tsx`)
È la pagina principale del modulo. Estrae gli ultimi 5 utenti registrati e le ultime 5 attività svolte, ordinati per data decrescente, e offre una panoramica sintetica dello stato globale.

### 💡 Best Practice
* **Isolamento dello Stato del Layout**: Il menu di navigazione superiore è posizionato nel layout del modulo e non nelle singole pagine. Questo evita ri-rendering inutili della testata quando si passa da una vista all'altra.
* **Separazione dei Contesti**: Il pulsante "Home Esercizi" punta alla radice `/` ed esegue un ricaricamento del browser per ripristinare il contesto globale dell'app principale senza sovrapposizioni di stato.

---

## 👉 STEP 2: Centralizzazione e Modellazione dei Dati

Per evitare chiamate di rete remote che avrebbero rallentato o reso instabile l'esercizio locale, tutti i dati sono stati modellati e salvati in un file statico in memoria.

### 1. Definizione dei Tipi (`src/app/es33/data/mockData.ts`)
Definiamo le strutture TypeScript per garantire la massima Type Safety in tutta l'applicazione:

```typescript
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  avatar: string;
  joinDate: string;
  bio?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
  duration: string;
  assignedUserId: string;
}
```

### 2. Dataset Statico
Nel file `mockData.ts` sono presenti elenchi pre-popolati di utenti (es. "Cesare Rossi", "Giulia Bianchi") e di attività (es. "Migrazione Next.js", "Scrittura Casi di Test") correlate tra loro tramite gli ID.

---

## 👉 STEP 3: Layout Risorse e Tab Sub-Routing

Il modulo delle risorse si articola in utenti e attività. Per condividere una testata comune e consentire la commutazione rapida, abbiamo introdotto un layout annidato.

### 1. Layout Annidato (`src/app/es33/risorse/layout.tsx`)
Questo file avvolge tutte le pagine interne della cartella `/risorse` (cioè sia le liste che i dettagli di utenti e attività).

```tsx
'use client';

import { usePathname } from 'next/navigation';

export default function RisorseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getTabStyle = (href: string) => {
    const isActive = pathname.startsWith(href);
    return {
      color: isActive ? 'var(--accent)' : 'var(--text)',
      borderBottom: isActive ? '3px solid var(--accent)' : '3px solid transparent',
      padding: '12px 24px',
    };
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2>Gestione Risorse</h2>
        <p>Naviga e amministra l'elenco degli utenti registrati e delle attività del sistema.</p>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '28px' }}>
        <a href="/es33/risorse/utenti" style={getTabStyle('/es33/risorse/utenti')}>👥 Utenti</a>
        <a href="/es33/risorse/attivita" style={getTabStyle('/es33/risorse/attivita')}>⚡ Attività</a>
      </div>
      <div>{children}</div>
    </div>
  );
}
```

### 2. Il Redirect Automatico (`src/app/es33/risorse/page.tsx`)
Se un utente tenta di accedere a `/es33/risorse`, viene reindirizzato in automatico alla rotta primaria degli utenti tramite `redirect()` di Next.js:

```typescript
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/es33/risorse/utenti');
}
```

---

## 👉 STEP 4: Filtri e Ricerca sugli Elenchi Risorse

Nelle pagine `risorse/utenti/page.tsx` e `risorse/attivita/page.tsx`, l'utente può cercare elementi e filtrarli per stato.

### 1. Logica di Filtraggio Client-Side (es. Utenti)
```tsx
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');

const filteredUsers = mockUsers.filter((user) => {
  const matchesSearch =
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
  return matchesSearch && matchesStatus;
});
```

### 💡 Best Practice
* **Filtro Insensitive**: Eseguire sempre il `.toLowerCase()` sia sulla stringa cercata che sui dati del modello per evitare che discrepanze di maiuscole/minuscole diano risultati errati.
* **Stati Unione Tipizzati**: Impostare il tipo dello stato del filtro (es. `'all' | 'active' | ...`) garantisce che non possano essere inseriti valori non previsti dal set dati.

---

## 👉 STEP 5: Pagine di Dettaglio Dinamiche e Parametri

Le cartelle `[id]` consentono di gestire percorsi dinamici (es. `/es33/risorse/utenti/1`).

### 1. Estrazione del Parametro in Next.js 15
Nelle versioni precedenti di Next.js, i parametri di rotta venivano estratti direttamente tramite le props della pagina. In Next.js 15, per i Client Component, si utilizza l'hook dedicato `useParams`:

```tsx
'use client';

import { useParams } from 'next/navigation';
import { mockUsers } from '../../../data/mockData';

export default function UserDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return <div>Utente non trovato</div>;
  }

  return (
    <div>
      <h3>{user.fullName}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### 2. Correlazione dei Dati (Incrocio delle Relazioni)
Nel dettaglio dell'attività (`attivita/[id]/page.tsx`), mostriamo le informazioni dell'attività e recuperiamo le informazioni dettagliate dell'utente assegnato partendo dal suo ID:

```typescript
const activity = mockActivities.find((a) => a.id === id);
const assignedUser = mockUsers.find((u) => u.id === activity?.assignedUserId);
```

---

## 👉 STEP 6: Pagina Impostazioni e Persistenza Simulata

La pagina `impostazioni/page.tsx` raccoglie le preferenze globali dell'utente:
* Tema del portale (Sleek Dark, Modern Light)
* Notifiche di sistema (Email, Browser, Nessuna)
* Auto-refresh dei dati (Frequenza in secondi)
* Limite massimo di righe per pagina

### 1. Persistenza con localStorage e Gestione del Ciclo di Vita
Durante l'avvio lato server (SSR), l'oggetto `window` e il `localStorage` non sono disponibili. Per evitare crash di idratazione (Hydration Mismatch), carichiamo lo stato iniziale in un `useEffect` che viene eseguito solo sul client:

```tsx
const [theme, setTheme] = useState('dark');

useEffect(() => {
  const savedTheme = localStorage.getItem('portal_theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);

const handleSave = () => {
  localStorage.setItem('portal_theme', theme);
  alert('Impostazioni salvate con successo!');
};
```

---

## 👉 STEP 7: Ottimizzazione della Navigazione (Dev Mode Fix)

### Il problema del `ChunkLoadError`
In modalità di sviluppo (`next dev`), Next.js compila le rotte on-demand al momento della visita. Se si naviga tramite il componente `<Link>` verso una rotta non ancora compilata, il client tenta di caricare in background un frammento JavaScript (`chunk.js`) che il server non ha ancora creato, restituendo un errore HTTP 404 e bloccando la pagina.

### La Soluzione
Sostituendo `<Link>` con tag standard `<a>` per i collegamenti principali e secondari all'interno del modulo `es33`, forziamo una navigazione a livello di browser. Il server riceve la richiesta HTTP ed ha il tempo di compilare la pagina in modo sincrono prima di servire l'HTML definitivo al browser, rendendo l'esperienza di sviluppo solida e priva di interruzioni.

---

## 🧪 Esercizi Suggeriti per il Giorno 33

1. **Aggiungi un campo "Note" ad un'attività**: Modifica il tipo `Activity` in `mockData.ts` per includere un campo opzionale `notes?: string`. Visualizzalo nella pagina di dettaglio dell'attività solo se compilato, utilizzando il pattern di short-circuit.
2. **Implementa l'ordinamento dinamico**: Nella lista utenti, aggiungi un selettore per ordinare gli utenti in ordine alfabetico crescente o decrescente.
3. **Crea un banner di avviso**: Nella Dashboard, se ci sono più di 3 attività con stato `in_progress`, mostra un banner di avvertimento giallo in cima per indicare un sovraccarico di lavoro sul team.
