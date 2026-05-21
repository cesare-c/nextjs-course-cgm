import type { Task, FilterType } from '../types/task';

// Simulated database
let MOCK_DB: Task[] = [
  { id: 1, title: 'Comprare il latte', description: 'Prendere quello parzialmente scremato', completed: false },
  { id: 2, title: 'Studiare React', description: 'Approfondire useMemo e useCallback', completed: true },
  { id: 3, title: 'Palestra', description: 'Allenamento gambe e spalle', completed: false },
  { id: 4, title: 'Pulire casa', description: 'Passare l\'aspirapolvere in salotto', completed: false },
  { id: 5, title: 'Leggere libro', description: 'Leggere almeno 20 pagine di "Clean Code"', completed: true },
  { id: 6, title: 'Chiamare nonna', description: 'Chiedere come sta e se serve qualcosa', completed: false },
  { id: 7, title: 'Fare la spesa', description: 'Frutta, verdura e uova', completed: false },
  { id: 8, title: 'Preparare cena', description: 'Risotto ai funghi', completed: false },
  { id: 9, title: 'Aggiornare CV', description: 'Aggiungere le ultime esperienze lavorative', completed: true },
  { id: 10, title: 'Pianificare vacanze', description: 'Cercare voli per la Grecia', completed: false },
  { id: 11, title: 'Pagare bollette', description: 'Luce e gas', completed: false },
  { id: 12, title: 'Lavare la macchina', description: 'Esterno ed interno', completed: false },
  { id: 13, title: 'Scrivere email al capo', description: 'Aggiornamento sul progetto', completed: true },
  { id: 14, title: 'Comprare regalo', description: 'Compleanno di Anna', completed: false },
  { id: 15, title: 'Prenotare ristorante', description: 'Cena di sabato', completed: false },
];

export interface FetchTasksResponse {
  data: Task[];
  total: number;
  completedCount: number;
  totalCount: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  getTasks: async (
    page: number,
    limit: number,
    filter: FilterType,
    searchQuery: string
  ): Promise<FetchTasksResponse> => {
    // Random delay between 1 and 3 seconds
    const waitTime = Math.floor(Math.random() * 2000) + 1000;
    await delay(waitTime);

    // Occasional simulated error (10% chance) just to show error state,
    // but maybe let's not make it fail randomly to not frustrate the user, 
    // unless requested. We'll skip random errors unless asked.

    let filtered = MOCK_DB.filter(task => {
      const matchesFilter =
        filter === 'all' ? true :
        filter === 'completed' ? task.completed :
        !task.completed;
      
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      completedCount: MOCK_DB.filter(t => t.completed).length,
      totalCount: MOCK_DB.length
    };
  },

  toggleTaskComplete: async (id: number): Promise<Task> => {
    // Shorter delay for mutations
    await delay(500);
    const taskIndex = MOCK_DB.findIndex(t => t.id === id);
    if (taskIndex === -1) throw new Error('Task non trovata');
    
    MOCK_DB[taskIndex] = { ...MOCK_DB[taskIndex], completed: !MOCK_DB[taskIndex].completed };
    return MOCK_DB[taskIndex];
  }
};
