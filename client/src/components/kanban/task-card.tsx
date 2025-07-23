import { useDrag } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';
import { TaskWithDetails } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: TaskWithDetails;
}

export function TaskCard({ task }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-brand-100 text-brand-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'low':
        return 'bg-green-100 text-green-600';
      case 'urgent':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const formatTimeTracked = (minutes?: number) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDueStatus = () => {
    if (!task.dueDate) return null;
    const now = new Date();
    const due = new Date(task.dueDate);
    
    if (due < now) {
      return 'Overdue';
    } else {
      return `Due: ${formatDistanceToNow(due, { addSuffix: true })}`;
    }
  };

  return (
    <Card
      ref={drag}
      className={`p-4 shadow-sm border cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </Badge>
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-slate-400" />
          <span className="text-xs text-slate-500">
            {formatTimeTracked(task.totalMinutes)}
          </span>
        </div>
      </div>

      <h4 className="font-semibold text-slate-900 text-sm mb-2">{task.title}</h4>
      
      {task.description && (
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {task.assignee && (
            <Avatar className="w-6 h-6 border-2 border-white">
              <AvatarFallback className="text-xs">
                {task.assignee.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        
        {getDueStatus() && (
          <span className={`text-xs ${
            getDueStatus()?.includes('Overdue') ? 'text-red-600' : 'text-slate-500'
          }`}>
            {getDueStatus()}
          </span>
        )}
      </div>
    </Card>
  );
}
