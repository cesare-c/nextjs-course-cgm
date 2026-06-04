# Lezione: State Management & Client-Side Persistency in Next.js

Nel corso dello sviluppo di applicazioni e-commerce in Next.js (App Router), due sfide comuni sono la **condivisione dello stato** (es. il carrello tra barra di navigazione, catalogo e pagina carrello) e la **persistenza** dei dati tra ricaricamenti.

## 1. Condivisione dello Stato: React Context
In Next.js, i componenti di layout e le pagine si aggiornano in modo indipendente. Per condividere lo stato senza ricorrere a librerie complesse come Redux o Zustand, si utilizza **React Context**:
- Un `CartProvider` (componente Client) avvolge l'albero delle pagine.
- Esporta funzioni per aggiungere, aggiornare e rimuovere elementi.
- Consente al contatore del carrello in Navbar e alla pagina del carrello di visualizzare gli stessi dati in tempo reale.

## 2. Persistenza Locale: LocalStorage & Hydration Mismatch
In Next.js, il codice viene inizialmente eseguito sul server (SSR). `localStorage` è un'API del browser e non esiste sul server. Se proviamo a inizializzare lo stato direttamente leggendo da `localStorage`:
```typescript
const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')));
```
Otterremo un errore di **Hydration Mismatch** poiché il server genererà un HTML vuoto o predefinito, mentre il client proverà a eseguire il rendering dei prodotti salvati, portando a discrepanze nel DOM.

### Soluzione Corretta
Inizializzare lo stato come vuoto, e caricare i dati da `localStorage` all'interno di un hook `useEffect`, che viene eseguito solo sul client dopo il montaggio del componente:
```typescript
useEffect(() => {
  const stored = localStorage.getItem('cart');
  if (stored) setCart(JSON.parse(stored));
}, []);
```
