import { useParams } from 'wouter';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { ProjectShareForm } from '@/components/forms/project-share-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProjects } from '@/hooks/use-projects';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/lib/auth';
import { 
  MoreVertical, 
  Share2, 
  Settings, 
  Users, 
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const [showShareForm, setShowShareForm] = useState(false);

  const project = projects?.find(p => p.id === id);
  const projectTasks = tasks?.filter(task => task.projectId === id) || [];
  
  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <div className="ml-64">
          <div className="p-6">
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Projeto não encontrado
                </h3>
                <p className="text-slate-600">
                  O projeto solicitado não existe ou você não tem permissão para visualizá-lo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Concluído';
      case 'on_hold':
        return 'Em Pausa';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const tasksByStatus = {
    todo: projectTasks.filter(t => t.status === 'todo').length,
    'in-progress': projectTasks.filter(t => t.status === 'in-progress').length,
    review: projectTasks.filter(t => t.status === 'review').length,
    done: projectTasks.filter(t => t.status === 'done').length,
  };

  const totalTasks = projectTasks.length;
  const completedTasks = tasksByStatus.done;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="ml-64">
        {/* Project Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: project.color || '#3b82f6' }}
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    Criado {formatDistanceToNow(new Date(project.createdAt), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareForm(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações do Projeto
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Membros
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {project.description && (
            <p className="text-slate-600 mt-3 max-w-2xl">{project.description}</p>
          )}
        </div>

        {/* Project Stats */}
        <div className="px-6 py-4 bg-white border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Progresso</p>
                    <p className="text-xl font-semibold">{progressPercentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total de Tarefas</p>
                    <p className="text-xl font-semibold">{totalTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Membros</p>
                    <p className="text-xl font-semibold">{(project.members?.length || 0) + 1}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tempo Gasto</p>
                    <p className="text-xl font-semibold">0h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Board do Projeto</h2>
            <p className="text-sm text-slate-600">
              Gerencie as tarefas usando drag and drop entre as colunas
            </p>
          </div>
          
          <div className="h-[calc(100vh-300px)]">
            <KanbanBoard projectId={id!} />
          </div>
        </div>
      </div>

      {showShareForm && (
        <ProjectShareForm
          project={project}
          isOpen={showShareForm}
          onClose={() => setShowShareForm(false)}
        />
      )}
    </div>
  );
}