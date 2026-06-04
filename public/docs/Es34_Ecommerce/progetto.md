# E-Commerce & Carrello Dinamico (Giorno 34)

Questo progetto implementa una soluzione e-commerce minimalista in Next.js integrata con JSON-Server per la persistenza dei dati del catalogo prodotti.

## Caratteristiche del Progetto

1. **Catalogo Prodotti**:
   - I prodotti vengono richiesti tramite fetch all'endpoint `GET http://localhost:3001/products`.
   - Ciascun prodotto è dotato di emoji, categoria, nome, descrizione, prezzo.

2. **Dettaglio Singolo Prodotto**:
   - Pagina a rotta dinamica `es34/prodotto/[id]`.
   - Richiede il singolo elemento tramite `GET http://localhost:3001/products/${id}`.

3. **Carrello Spesa in LocalStorage**:
   - Stato gestito tramite `CartContext.tsx` per sincronizzazione immediata in tutta l'applicazione.
   - Sincronizzazione automatica con la chiave `es34_cart` del browser.

4. **Algoritmo Spese di Spedizione**:
   - La spedizione è **Gratuita** se il subtotale degli articoli nel carrello è pari o superiore a **29,00 €**.
   - In caso contrario (subtotale < 29,00 €), la spedizione costa **3,99 € ogni 4 prodotti** nel carrello (calcolo incrementale):
     $$\text{Spedizione} = \lceil \frac{\text{Quantità Totale}}{4} \rceil \times 3.99$$
   - Se il carrello è vuoto, le spese sono pari a `0.00 €`.

5. **Banner Informativi e Suggerimenti**:
   - Avvisa l'utente se manca un prodotto nel carrello.
   - Mostra dinamicamente quanto manca per sbloccare la spedizione gratuita (es: *"Ti mancano 4.50 €"*).
