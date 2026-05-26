# Spiegazione del Progetto: Counter Step-by-Step

Questa guida mostra come abbiamo isolato e implementato il progetto del **Contatore** (Esercizio 20) in un componente autonomo e riutilizzabile.

---

## Struttura del Codice del Progetto

Il progetto si compone di un singolo componente React situato all'indirizzo `src/exercises/Es20_Default/DefaultExercise.tsx`.

### Step 1: Creazione dello Stato
Abbiamo inizializzato il contatore utilizzando `useState`:

```tsx
const [count, setCount] = useState(0);
```

### Step 2: La Struttura dell'Interfaccia (HTML)
Il componente renderizza una porzione di layout centrata con due pulsanti:
* Un pulsante `-` per il decremento.
* Un testo che mostra il conteggio corrente (`Conteggio: {count}`).
* Un pulsante `+` per l'incremento.

```tsx
return (
  <div style={{ textAlign: 'center' }}>
    <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Conteggio: {count}</p>
    <button onClick={() => setCount((c) => c - 1)}>-</button>
    <button onClick={() => setCount((c) => c + 1)}>+</button>
  </div>
);
```

---

## Miglioramenti di Stile Applicati

Per allineare il design del componente agli standard premium della nostra dashboard, abbiamo arricchito i pulsanti con stili in linea dedicati che si adattano al tema globale:
* **Bordi e Sfondi**: Utilizzano le variabili CSS native `--border` e `--bg` per supportare il Dark Mode nativamente.
* **Transizioni**: Aggiunto `transition: all 0.2s` per rendere i feedback dell'utente (come i click e gli hover) fluidi e moderni.
* **Margini e Spazi**: Configurato un corretto distanziamento per evitare sovrapposizioni e migliorare la leggibilità sui dispositivi mobili.
