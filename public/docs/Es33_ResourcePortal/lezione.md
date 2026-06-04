# Lezione: Introduzione a Next.js 15, App Router e Routing Dinamico

In questa lezione approfondiremo le basi dell'architettura di **Next.js 15**, focalizzandoci sulle convenzioni dell'**App Router**, sulla distinzione tra **Server e Client Component**, sulla nidificazione dei layout e sulla gestione avanzata delle rotte dinamiche.

---

## 1. Da React a Next.js: Il cambio di paradigma

Mentre un'applicazione React classica (SPA creata con Vite o Create React App) gestisce tutto il rendering interamente sul client delegando il routing a librerie come `react-router-dom`, **Next.js** è un framework completo per React che supporta:
* **Server-Side Rendering (SSR)**: La pagina viene renderizzata in HTML sul server a ogni richiesta e inviata già pronta al client.
* **Static Site Generation (SSG)**: Le pagine vengono compilate ed esportate come file HTML statici al momento della build.
* **Client-Side Rendering (CSR)**: Next.js supporta l'idratazione ibrida client-side dopo il caricamento iniziale per mantenere l'interattività.

---

## 2. L'App Router di Next.js: Convenzioni di File-System

Il routing in Next.js 15 si basa sul file-system all'interno della directory `src/app`. Ogni sottocartella definisce un percorso URL. All'interno delle cartelle, i nomi dei file hanno significati specifici stabiliti dal framework:

| Nome File | Scopo |
|---|---|
| `page.tsx` | Il contenuto visivo principale associato alla rotta (l'equivalente di una pagina). |
| `layout.tsx` | La struttura persistente condivisa tra questa rotta e le sue sottorotte (es. Header, Sidebar). Non si ri-renderizza durante la navigazione interna. |
| `loading.tsx` | Un'interfaccia di caricamento automatica mostrata tramite React Suspense durante il fetch dei dati. |
| `error.tsx` | Un confine di errore (Error Boundary) per intercettare crash e mostrare una UI di fallback. |
| `not-found.tsx` | La pagina mostrata quando la rotta o una risorsa non esiste. |

---

## 3. Server Component vs Client Component

In Next.js, tutti i componenti all'interno dell'App Router sono, di default, **React Server Components (RSC)**.

### Server Components
* Vengono eseguiti esclusivamente sul server.
* Non includono codice JavaScript nel bundle del client (riducendo le dimensioni dei file inviati al browser).
* Possono accedere direttamente al database o fare chiamate API senza esporre credenziali sensibili.
* **Limiti**: Non possono usare gli hook di React (come `useState`, `useEffect`) né le API del browser (come `window` o `localStorage`).

### Client Components
* Vengono contrassegnati inserendo la direttiva `'use client';` all'inizio del file.
* Vengono pre-renderizzati sul server (HTML) e poi idratati sul client.
* Possono usare tutti gli hook di React, eventi interattivi (`onClick`, `onChange`) e API del browser.
* **Best Practice**: Mantieni la maggior parte dell'applicazione come Server Component ed "isola" l'interattività all'interno di Client Component dedicati solo quando strettamente necessario.

---

## 4. Layout Annidati (Nested Layouts)

I layout si propagano in modo nidificato lungo la gerarchia delle cartelle:
1. Il layout radice (`src/app/layout.tsx`) definisce il tag `<html>` e `<body>` globale.
2. Un layout di modulo (`src/app/es33/layout.tsx`) avvolge tutte le rotte di quel modulo.
3. Un layout di sotto-modulo (`src/app/es33/risorse/layout.tsx`) avvolge ulteriormente solo le liste e i dettagli delle risorse.

Ogni layout figlio viene iniettato come prop `{children}` all'interno del layout padre.

---

## 5. Rotte Dinamiche ed Estrazione dei Parametri

Quando una rotta ha segmenti dinamici (es. l'ID di un utente o di un post), si utilizza la convenzione delle parentesi quadre:
`src/app/es33/risorse/utenti/[id]/page.tsx` corrisponde a `/es33/risorse/utenti/1`, `/es33/risorse/utenti/abc`, ecc.

### Estrazione dei parametri in Next.js 15
Nei Client Component (`'use client';`), l'estrazione sincrona dei parametri è deprecata. Per ricavare il valore dell'id in modo asincrono o reattivo si usa l'hook `useParams()` importato da `next/navigation`:

```tsx
'use client';

import { useParams } from 'next/navigation';

export default function DetailPage() {
  const params = useParams();
  const id = params?.id as string; // 'id' corrisponde esattamente al nome della cartella [id]

  return <div>Visualizzando elemento con ID: {id}</div>;
}
```

---

## 6. Risoluzione dei Mismatch di Idratazione (Hydration Mismatch)

Un errore comune in Next.js è il **Hydration Mismatch**: si verifica quando l'HTML iniziale generato dal server differisce dall'HTML generato dal client durante la prima esecuzione (es. se proviamo a leggere `localStorage` o l'ora corrente `new Date()` direttamente durante la fase di render).

### Come evitarlo:
Sposta tutte le letture esterne o del browser all'interno dell'hook `useEffect`, che viene eseguito esclusivamente sul client dopo che il rendering iniziale si è completato con successo:

```tsx
const [value, setValue] = useState('');

useEffect(() => {
  setValue(localStorage.getItem('my_key') || '');
}, []);
```
