import { useDrop } from 'react-dnd';
import { TaskCard } from './task-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskWithDetails } from '@shared/schema';

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    bgColor: string;
    borderColor: string;
  };
  tasks: TaskWithDetails[];
  onTaskMove: (taskId: string, newStatus: string, newPosition: number) => void;
}

export function KanbanColumn({ column, tasks, onTaskMove }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => {
      onTaskMove(item.id, column.id, tasks.length);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const getColumnBadgeColor = () => {
    switch (column.id) {
      case 'todo':
        return 'bg-slate-200 text-slate-700';
      case 'in_progress':
        return 'bg-blue-200 text-blue-700';
      case 'review':
        return 'bg-yellow-200 text-yellow-700';
      case 'done':
        return 'bg-green-200 text-green-700';
      default:
        return 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div
      ref={drop}
      className={`${column.bgColor} rounded-lg p-4 min-h-[400px] transition-colors ${
        isOver ? 'ring-2 ring-brand-500' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">{column.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${getColumnBadgeColor()}`}>
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <Button
        variant="ghost"
        className="w-full text-sm text-slate-500 hover:text-slate-700 py-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Task
      </Button>
    </div>
  );
}
