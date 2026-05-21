import type { Task } from '../types/task';

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskRow = ({ task, isSelected, onSelect, onToggleComplete }: TaskRowProps) => {
  return (
    <div 
      className={`task-row ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(task.id)}
      style={{ 
        padding: '10px', 
        border: '1px solid #ccc', 
        margin: '5px 0', 
        cursor: 'pointer',
        backgroundColor: isSelected ? '#e0f7fa' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={(e) => {
          e.stopPropagation();
          onToggleComplete(task.id);
        }}
      />
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none', flex: 1 }}>
        {task.title}
      </span>
      {isSelected && <span>(Selected)</span>}
    </div>
  );
};

export default TaskRow;
