import { useState, useEffect, useMemo } from 'react';
import type { Task, FilterType } from '../../types/task';
import TaskRow from './TaskRow';

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

// ---------------- array of initial Tasks -----------------------------              
const INITIAL_TASKS: Task[] = [
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
];

const TaskList = () => {
  // ---------------- State -------------------------
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>(() => {
    const saved = localStorage.getItem('taskFilter');
    return (saved as FilterType) || 'all';
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('taskPage');
    return Number(saved) || 1;
  });
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState(''); // Bonus

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskFilter', filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem('taskPage', String(currentPage));
  }, [currentPage]);

  // ------------------- Derived Data -----------------------------

  // 1. ----------------------------Filter and Search
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter =
        filter === 'all' ? true :
          filter === 'completed' ? task.completed :
            !task.completed;

      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, searchQuery]);

  // 2. -------------------------- Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  // Reset page when filter or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, itemsPerPage, searchQuery]);

  // -------------------------- Handlers ---------------------------

  // --------- handle when checkbox clicked
  const handleToggleComplete = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const selectedTask = useMemo(() =>
    tasks.find(t => t.id === selectedTaskId),
    [tasks, selectedTaskId]);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="task-list-container" style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Task Manager</h2>

      {/* Bonus: Counter */}
      <div style={{ marginBottom: '10px', fontSize: '0.9em', color: '#666' }}>
        Completate: {completedCount} / {tasks.length}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Cerca per titolo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '5px', flex: 1 }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as FilterType)} style={{ padding: '5px' }}>
          <option value="all">Tutte</option>
          <option value="completed">Completate</option>
          <option value="uncompleted">Da fare</option>
        </select>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          style={{ padding: '5px' }}
        >
          {ITEMS_PER_PAGE_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt} per pagina</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="tasks-scroll" style={{ minHeight: '200px' }}>
        {paginatedTasks.length > 0 ? (
          paginatedTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              isSelected={task.id === selectedTaskId}
              onSelect={setSelectedTaskId}
              onToggleComplete={handleToggleComplete}
            />
          ))
        ) : (
          <p>Nessuna task trovata.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Precedente
        </button>
        <span>Pagina {currentPage} di {totalPages || 1}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages}
        >
          Successiva
        </button>
      </div>

      {/* Detail View */}
      {selectedTask && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #007bff', borderRadius: '4px', backgroundColor: '#f0f8ff' }}>
          <h3>Dettaglio Task</h3>
          <p><strong>Titolo:</strong> {selectedTask.title}</p>
          <p><strong>Descrizione:</strong> {selectedTask.description}</p>
          <p><strong>Stato:</strong> {selectedTask.completed ? 'Completata' : 'In corso'}</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
