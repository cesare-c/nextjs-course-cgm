# CRUD React Avanzato con TypeScript, React e Next.js

## Edit, Delete, Modali ed Error Handling in Applicazioni Enterprise

---

# Introduzione

Nel CRUD basilare (`Create`, `Read`, `Update`, `Delete`) la complessità percepita è spesso sottovalutata.
Le operazioni di lettura e creazione sono generalmente lineari: l’utente aggiunge dati oppure li consulta.

Le operazioni di modifica ed eliminazione, invece, introducono un problema architetturale e cognitivo molto più sofisticato:

* rischio di perdita dati
* conflitto tra stato locale e remoto
* necessità di feedback espliciti
* gestione della fiducia utente
* sincronizzazione della UI
* protezione contro azioni accidentali

In sistemi enterprise, queste problematiche non sono dettagli di implementazione: sono parte integrante della progettazione software.

---

# Obiettivi del Tutorial

Alla fine di questo tutorial sarai in grado di:

* implementare flussi CRUD avanzati in React e Next.js
* progettare form di edit isolati e resiliente
* usare modali in modo corretto dal punto di vista UX
* implementare `PATCH` e `DELETE` in modo production-ready
* gestire loading, errori e feedback visivi
* sincronizzare componenti padre e figli
* evitare inconsistenze dello stato applicativo

---

# Stack Tecnologico

| Tecnologia  | Ruolo                      |
| ----------- | -------------------------- |
| TypeScript  | Type safety e affidabilità |
| React       | State-driven UI            |
| Next.js     | Architettura applicativa   |
| Fetch API   | Comunicazione HTTP         |
| React Hooks | Gestione stato e lifecycle |

---

# Architettura Finale del CRUD

```text
ProductPage
│
├── ProductTable
│     ├── EditButton
│     └── DeleteButton
│
├── EditProductModal
│     └── ProductForm
│
├── DeleteConfirmationModal
│
└── API Layer
      ├── updateProduct()
      └── deleteProduct()
```

---

# Capitolo 1 — Perché Edit e Delete Cambiano il Flusso

## Il Problema Architetturale

Le operazioni `edit` e `delete` non sono semplici click.

Sono:

* mutazioni persistenti
* azioni potenzialmente irreversibili
* operazioni che alterano la fiducia dell’utente

Nel design enterprise, ogni operazione mutativa deve esplicitare:

1. intenzione
2. attesa
3. risultato

---

## Flusso Concettuale

```text
Utente clicca "Edit"
        ↓
Apertura contesto controllato
        ↓
Modifica dati locali
        ↓
Validazione
        ↓
Persistenza API
        ↓
Aggiornamento UI
        ↓
Feedback visivo
```

---

## Perché Conta

Un’interfaccia che aggiorna dati senza feedback genera:

* perdita di fiducia
* doppie richieste
* inconsistenza percettiva
* errori utente

---

## Esempio Enterprise del Flusso

```tsx
const handleEditClick = (product: Product): void => {
  setSelectedProduct(product);
  setIsEditModalOpen(true);
};

const handleDeleteClick = (product: Product): void => {
  setProductPendingDeletion(product);
  setIsDeleteModalOpen(true);
};
```

---

> 💡 Best Practice
> Le azioni distruttive non devono mai essere eseguite direttamente dal click primario.

---

# Capitolo 2 — Pagina o Modale di Edit

# Filosofia UX

La scelta tra:

* pagina dedicata
* modale contestuale

non è estetica.

È una decisione architetturale.

---

# Quando Usare una Pagina

Una pagina dedicata è ideale quando:

* il form è complesso
* esistono molte validazioni
* servono sezioni multiple
* l’utente deve confrontare dati
* esistono workflow lunghi

---

# Quando Usare una Modale

Una modale è ideale quando:

* l’edit è rapido
* pochi campi cambiano
* il contesto originale deve restare visibile
* il rischio cognitivo è basso

---

# Tabella Comparativa

| Strategia       | Vantaggi                | Svantaggi       | Caso Ideale    |
| --------------- | ----------------------- | --------------- | -------------- |
| Pagina dedicata | Scalabilità e chiarezza | Cambio contesto | Form complessi |
| Modale          | Rapidità e continuità   | Poco spazio     | Edit rapidi    |

---

> ⚠️ Warning
> Non usare modali per workflow lunghi o multi-step.

---

# Capitolo 3 — Modellazione del Dominio

# Definizione dei Tipi

In un’applicazione enterprise il dominio deve essere tipizzato.

---

## Product Type

```tsx
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  updatedAt: string;
}
```

---

## DTO per Update

Separare il dominio dal payload API riduce accoppiamento.

```tsx
export interface UpdateProductPayload {
  title: string;
  description: string;
  price: number;
  stock: number;
}
```

---

> 💡 Regola d’Oro
> Non inviare mai l’intero dominio quando serve solo un payload parziale.

---

# Capitolo 4 — Preparare il Form di Edit

# Il Problema

Uno degli errori più comuni è modificare direttamente il record presente nella lista.

Questo crea:

* aggiornamenti involontari
* rendering inconsistenti
* impossibilità di annullamento

---

# Soluzione: Local Copy Pattern

Creiamo una copia locale isolata.

---

# Componente Padre

## ProductPage.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  updatedAt: string;
}

export interface UpdateProductPayload {
  title: string;
  description: string;
  price: number;
  stock: number;
}

interface ApiError {
  message: string;
}

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products");

  if (!response.ok) {
    throw new Error("Errore durante il caricamento prodotti");
  }

  const data: { products: Product[] } = await response.json();

  return data.products;
}

export default function ProductPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        setIsLoading(true);

        const result = await fetchProducts();

        setProducts(result);
      } catch (err: unknown) {
        const error = err as ApiError;

        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const handleOpenEdit = (product: Product): void => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = (): void => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };

  const handleProductUpdated = (updatedProduct: Product): void => {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );

    handleCloseEdit();
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Product Dashboard
      </h1>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded"
          >
            <h2 className="font-bold">{product.title}</h2>

            <p>{product.description}</p>

            <p>€ {product.price}</p>

            <button
              onClick={() => handleOpenEdit(product)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {selectedProduct && isEditModalOpen && (
        <EditProductModal
          product={selectedProduct}
          onClose={handleCloseEdit}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </main>
  );
}
```

---

# Capitolo 5 — Form Controllato

# Perché il Controlled Form Conta

Un form controllato garantisce:

* single source of truth
* validazione centralizzata
* prevedibilità
* sincronizzazione UI

---

# EditProductModal.tsx

```tsx
"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  updatedAt: string;
}

interface UpdateProductPayload {
  title: string;
  description: string;
  price: number;
  stock: number;
}

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onProductUpdated: (product: Product) => void;
}

interface ValidationErrors {
  title?: string;
  price?: string;
  stock?: string;
}

export function EditProductModal({
  product,
  onClose,
  onProductUpdated
}: EditProductModalProps): JSX.Element {
  const [formData, setFormData] =
    useState<UpdateProductPayload>({
      title: "",
      description: "",
      price: 0,
      stock: 0
    });

  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState<boolean>(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  useEffect(() => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
  }, [product]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;

    setFormData((previousState) => ({
      ...previousState,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value
    }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (formData.title.trim().length < 3) {
      errors.title =
        "Il titolo deve contenere almeno 3 caratteri";
    }

    if (formData.price <= 0) {
      errors.price =
        "Il prezzo deve essere maggiore di zero";
    }

    if (formData.stock < 0) {
      errors.stock =
        "Lo stock non può essere negativo";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsSubmitting(true);

      setServerError(null);

      const response = await fetch(
        `https://dummyjson.com/products/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error(
          "Errore durante l'aggiornamento del prodotto"
        );
      }

      const updatedProduct: Product =
        await response.json();

      onProductUpdated(updatedProduct);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError(
          "Errore sconosciuto durante l'update"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-8 rounded w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">
          Edit Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-2">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            {validationErrors.price && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.price}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            {validationErrors.stock && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.stock}
              </p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-100 text-red-700 p-3 rounded">
              {serverError}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

# Capitolo 6 — PATCH vs PUT

# Differenze Architetturali

| Metodo | Significato           | Payload               | Uso               |
| ------ | --------------------- | --------------------- | ----------------- |
| PUT    | Sostituzione completa | Intero oggetto        | Replace totale    |
| PATCH  | Modifica parziale     | Solo campi modificati | Edit incrementale |

---

# Perché PATCH è Ideale per i Form

Vantaggi:

* payload più piccolo
* meno banda
* minore rischio overwrite
* migliore semantica REST

---

> 💡 Best Practice
> Usa `PATCH` nei form di modifica utente salvo necessità esplicite di replace completo.

---

# Capitolo 7 — Feedback Visivo e Persistenza

# Il Problema UX

Dopo il salvataggio, l’utente deve capire immediatamente:

* se l’operazione è riuscita
* cosa è cambiato
* se deve fare altro

---

# Strategia Enterprise

Dopo il successo:

1. aggiornare lista locale
2. mostrare feedback
3. chiudere contesto modale

---

# Toast di Successo

```tsx
const [successMessage, setSuccessMessage] =
  useState<string | null>(null);

const handleProductUpdated = (
  updatedProduct: Product
): void => {
  setProducts((previousProducts) =>
    previousProducts.map((product) =>
      product.id === updatedProduct.id
        ? updatedProduct
        : product
    )
  );

  setSuccessMessage(
    "Prodotto aggiornato correttamente"
  );

  setTimeout(() => {
    setSuccessMessage(null);
  }, 3000);

  handleCloseEdit();
};
```

---

# Rendering del Feedback

```tsx
{
  successMessage && (
    <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
      {successMessage}
    </div>
  );
}
```

---

> ⚠️ Warning
> Non obbligare l’utente a ricaricare manualmente la pagina dopo un update.

---

# Capitolo 8 — Delete Flow Enterprise

# Perché il Delete è Critico

Il delete è l’operazione più rischiosa del CRUD.

Errori comuni:

* cancellazione accidentale
* assenza di feedback
* rimozione senza conferma

---

# Pattern Corretto

```text
Click Delete
      ↓
Conferma esplicita
      ↓
Loading state
      ↓
DELETE API
      ↓
Aggiornamento lista locale
      ↓
Feedback visivo
```

---

# DeleteConfirmationModal.tsx

```tsx
"use client";

import { useState } from "react";

interface Product {
  id: number;
  title: string;
}

interface DeleteConfirmationModalProps {
  product: Product;
  onClose: () => void;
  onDeleted: (id: number) => void;
}

export function DeleteConfirmationModal({
  product,
  onClose,
  onDeleted
}: DeleteConfirmationModalProps): JSX.Element {
  const [isDeleting, setIsDeleting] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleDelete = async (): Promise<void> => {
    try {
      setIsDeleting(true);

      setError(null);

      const response = await fetch(
        `https://dummyjson.com/products/${product.id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Errore durante la cancellazione"
        );
      }

      onDeleted(product.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Errore sconosciuto durante la delete"
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Confirm Delete
        </h2>

        <p className="mb-6">
          Sei sicuro di voler eliminare:
          <strong> {product.title}</strong>?
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => {
              void handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

# Aggiornamento Stato Lista

```tsx
const handleProductDeleted = (
  deletedProductId: number
): void => {
  setProducts((previousProducts) =>
    previousProducts.filter(
      (product) =>
        product.id !== deletedProductId
    )
  );

  setIsDeleteModalOpen(false);
};
```

---

# Capitolo 9 — Error Handling Enterprise

# Livelli di Errore

| Livello             | Esempio          | Gestione          |
| ------------------- | ---------------- | ----------------- |
| Validazione locale  | Campo vuoto      | Bloccare submit   |
| Errore API          | 500 Server Error | Banner errore     |
| Network failure     | Offline          | Retry o feedback  |
| Stato inconsistente | Record mancante  | Redirect/fallback |

---

# Principio Fondamentale

Un errore non gestito:

* rompe il flusso cognitivo
* riduce fiducia
* aumenta attrito UX

---

# Strategia Enterprise

Ogni async flow deve avere:

```tsx
try {

} catch (error) {

} finally {

}
```

---

> 💡 Regola d’Oro
> Il loading è parte dell’esperienza utente, non un dettaglio tecnico.

---

# Capitolo 10 — Ottimizzazione dei Rendering

# Problema

Aggiornare stato globale inutilmente produce:

* rendering extra
* perdita performance
* complessità cognitiva

---

# Approccio Corretto

Aggiornare solo l’elemento necessario.

---

# Update Granulare

```tsx
setProducts((previousProducts) =>
  previousProducts.map((product) =>
    product.id === updatedProduct.id
      ? updatedProduct
      : product
  )
);
```

---

# Delete Granulare

```tsx
setProducts((previousProducts) =>
  previousProducts.filter(
    (product) =>
      product.id !== deletedProductId
  )
);
```

---

> 💡 Best Practice
> Le mutazioni granulari migliorano performance e prevedibilità della UI.

---

# Capitolo 11 — Best Practices Enterprise

# Separazione delle Responsabilità

| Responsabilità  | Componente              |
| --------------- | ----------------------- |
| UI lista        | ProductPage             |
| Form edit       | EditProductModal        |
| Conferma delete | DeleteConfirmationModal |
| Persistenza     | API layer               |
| Validazione     | Form layer              |

---

# Principi Chiave

* separare UI e persistenza
* evitare side effects nascosti
* usare tipi espliciti
* mostrare sempre feedback
* bloccare doppie submit
* mantenere prevedibile la UI

---

# Checklist Enterprise

| Controllo             | Stato |
| --------------------- | ----- |
| Loading gestito       | ✅     |
| Errori gestiti        | ✅     |
| Conferma delete       | ✅     |
| Form controllato      | ✅     |
| Tipizzazione completa | ✅     |
| Update ottimizzato    | ✅     |
| Feedback utente       | ✅     |

---

# Capitolo 12 — Conclusioni

# Cosa Abbiamo Costruito

Abbiamo implementato un CRUD avanzato capace di:

* modificare dati in sicurezza
* eliminare record con protezione cognitiva
* sincronizzare UI e backend
* gestire errori enterprise-grade
* mantenere alta la qualità UX

---

# Differenza tra CRUD Base e CRUD Enterprise

| CRUD Base     | CRUD Enterprise  |
| ------------- | ---------------- |
| Funziona      | È resiliente     |
| Aggiorna dati | Guida l’utente   |
| Gestisce API  | Gestisce fiducia |
| Mostra dati   | Gestisce stati   |
| È tecnico     | È sistemico      |

---

# Esercizio Finale

## Implementare

* edit tramite modale
* delete con conferma
* toast di successo
* gestione errori completa
* loading state
* validazione form

---

> 💡 Obiettivo Finale
> Un buon CRUD non è solo “funzionante”.
> È prevedibile, resiliente, leggibile e orientato alla fiducia dell’utente.
