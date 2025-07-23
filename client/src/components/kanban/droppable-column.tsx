import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskCard } from './draggable-task-card';
import { TaskWithDetails } from '@shared/schema';

interface DroppableColumnProps {
  id: string;
  title: string;
  tasks: TaskWithDetails[];
  onAddTask: () => void;
}

export function DroppableColumn({ id, title, tasks, onAddTask }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case 'todo':
        return 'A Fazer';
      case 'in-progress':
        return 'Em Progresso';
      case 'review':
        return 'Em Revisão';
      case 'done':
        return 'Concluído';
      default:
        return title;
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      className={`w-80 h-fit min-h-[500px] transition-colors ${
        isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Badge className={`${getStatusColor(id)} text-xs`}>
              {tasks.length}
            </Badge>
            {getStatusTitle(id)}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTask}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Nenhuma tarefa
          </div>
        )}
      </CardContent>
    </Card>
  );
}