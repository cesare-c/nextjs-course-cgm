# Esercizio 20: Gestione dello Stato con `useState`

In questa lezione analizzeremo il concetto fondamentale di **Stato** in React e come utilizzare l'hook `useState` per rendere interattive le nostre interfacce utente.

---

## Cos'è lo Stato in React?

A differenza delle normali variabili JavaScript, lo stato di React è una memoria speciale legata al componente. Quando lo stato cambia, React ri-renderizza automaticamente il componente per riflettere le modifiche sullo schermo.

### L'hook `useState`

`useState` è una funzione speciale (chiamata Hook) fornita da React che ti consente di aggiungere lo stato a un componente funzionale.

```tsx
import { useState } from 'react';

const [state, setState] = useState(initialValue);
```

* **`state`**: Il valore corrente dello stato.
* **`setState`**: La funzione che permette di aggiornare il valore dello stato.
* **`initialValue`**: Il valore di partenza dello stato (numeri, stringhe, booleani, array, oggetti).

---

## Funzionamento del Contatore (Counter)

Nel nostro esercizio utilizziamo uno stato numerico inizializzato a `0`:

```tsx
const [count, setCount] = useState(0);
```

Ogni volta che l'utente clicca sui pulsanti di incremento o decremento, chiamiamo la funzione `setCount` passando il nuovo valore o una funzione di callback che riceve lo stato precedente:

```tsx
// Decremento
setCount(prevCount => prevCount - 1);

// Incremento
setCount(prevCount => prevCount + 1);
```

L'uso di `prevCount => prevCount + 1` (funzione di aggiornamento dello stato) è la pratica raccomandata quando il nuovo stato dipende dal valore precedente, in quanto garantisce la consistenza dei dati in caso di aggiornamenti asincroni consecutivi.
