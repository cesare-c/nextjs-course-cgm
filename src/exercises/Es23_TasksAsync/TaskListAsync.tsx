import { useState, useEffect, useMemo } from 'react';
import type { Task, FilterType } from '../../types/task';
import TaskRow from '../Es22_Tasks/TaskRow';
import { taskService } from '../../services/taskService';

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const TaskListAsync = () => {
  // ---------------- State -------------------------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  
  const [filter, setFilter] = useState<FilterType>(() => {
    const saved = localStorage.getItem('taskFilterAsync');
    return (saved as FilterType) || 'all';
  });
  
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('taskPageAsync');
    return Number(saved) || 1;
  });
  
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState(''); // Bonus

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('taskFilterAsync', filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem('taskPageAsync', String(currentPage));
  }, [currentPage]);

  // ------------------- Data Fetching (useEffect) -----------------------------
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks(currentPage, itemsPerPage, filter, searchQuery);
      setTasks(response.data);
      setTotalItems(response.total);
      setCompletedCount(response.completedCount);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError('Si è verificato un errore durante il caricamento dei dati.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Deselect task when data changes (optional but good practice)
    setSelectedTaskId(null);
  }, [currentPage, itemsPerPage, filter, searchQuery]);

  // Reset page when filter or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, itemsPerPage, searchQuery]);

  // -------------------------- Handlers ---------------------------

  const handleToggleComplete = async (id: number) => {
    try {
      // Optimitic update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      
      // Actual backend call
      await taskService.toggleTaskComplete(id);
      
      // Refetch to ensure everything is in sync (like pagination counts)
      fetchTasks();
    } catch (err) {
      // Revert on error
      setError('Errore durante l\'aggiornamento della task');
      fetchTasks(); // Refetch to restore correct state
    }
  };

  const selectedTask = useMemo(() =>
    tasks.find(t => t.id === selectedTaskId),
  [tasks, selectedTaskId]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className="task-list-container" style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Task Manager (Async)</h2>

      {/* Bonus: Counter */}
      <div style={{ marginBottom: '10px', fontSize: '0.9em', color: '#666' }}>
        Completate totali (nel DB): {completedCount} / {totalCount}
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

      {/* List Area */}
      <div className="tasks-scroll" style={{ minHeight: '200px', position: 'relative' }}>
        {/* Loading State */}
        {loading && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', zIndex: 10
          }}>
            <p>Caricamento in corso...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ padding: '15px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '15px' }}>
            {error}
            <button onClick={fetchTasks} style={{ marginLeft: '10px' }}>Riprova</button>
          </div>
        )}

        {/* Success / Empty State */}
        {!error && tasks.length === 0 && !loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            <p>Nessuna task trovata. (Empty State)</p>
          </div>
        )}

        {/* List */}
        {tasks.length > 0 && (
          tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              isSelected={task.id === selectedTaskId}
              onSelect={setSelectedTaskId}
              onToggleComplete={handleToggleComplete}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || loading}
        >
          Precedente
        </button>
        <span>Pagina {currentPage} di {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages || loading}
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

export default TaskListAsync;
