import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MessageSquare, Paperclip } from 'lucide-react';
import { TaskWithDetails } from '@shared/schema';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: TaskWithDetails;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 ${
        isDragging ? 'shadow-lg rotate-2' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Título da tarefa */}
          <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
          
          {/* Prioridade */}
          <Badge className={`${getPriorityColor(task.priority)} text-xs w-fit`}>
            {getPriorityLabel(task.priority)}
          </Badge>

          {/* Descrição (se houver) */}
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
          )}

          {/* Informações adicionais */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              {/* Data de vencimento */}
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.dueDate), 'dd/MM', { locale: ptBR })}</span>
                </div>
              )}
              
              {/* Tempo estimado */}
              {task.estimatedMinutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{Math.round(task.estimatedMinutes / 60)}h</span>
                </div>
              )}
            </div>

            {/* Contador de anexos/comentários */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Responsável */}
          {task.assignee && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatarUrl || ''} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-600">{task.assignee.fullName}</span>
              </div>
              
              {/* Indicador de progresso ou status */}
              <div className={`w-2 h-2 rounded-full ${
                task.status === 'done' ? 'bg-green-500' :
                task.status === 'in-progress' ? 'bg-blue-500' :
                task.status === 'review' ? 'bg-yellow-500' :
                'bg-gray-300'
              }`} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}