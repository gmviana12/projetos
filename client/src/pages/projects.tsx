import { useState } from 'react';
import { Link } from 'wouter';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProjectForm } from '@/components/forms/project-form';
import { ProjectShareForm } from '@/components/forms/project-share-form';
import { useProjects } from '@/hooks/use-projects';
import { FolderKanban, Calendar, Users, MoreHorizontal, Share2, Eye, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showShareForm, setShowShareForm] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="ml-64">
        <TopBar
          title="Projects"
          subtitle="Manage your projects and collaborate with your team"
          onCreateProject={() => setShowProjectForm(true)}
        />

        <div className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color || '#3b82f6' }}
                        ></div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/project/${project.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Projeto
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedProject(project);
                            setShowShareForm(true);
                          }}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Badge className={getStatusColor(project.status)} variant="secondary">
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent>
                    {project.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-slate-500">
                        <FolderKanban className="h-4 w-4 mr-2" />
                        <span>{project.totalTasks || 0} tasks</span>
                        <span className="mx-2">•</span>
                        <span>{project.completedTasks || 0} completed</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-slate-500">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{(project.members?.length || 0) + 1} members</span>
                        </div>
                        
                        {project.totalTasks && project.totalTasks > 0 && (
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-brand-600 h-2 rounded-full"
                              style={{
                                width: `${Math.round(((project.completedTasks || 0) / project.totalTasks) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <FolderKanban className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Nenhum projeto ainda
                </h3>
                <p className="text-slate-600 mb-4">
                  Crie seu primeiro projeto para começar a usar o TaskFlow.
                </p>
                <Button onClick={() => setShowProjectForm(true)}>
                  Criar Projeto
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSuccess={() => setShowProjectForm(false)}
            onCancel={() => setShowProjectForm(false)}
          />
        </DialogContent>
      </Dialog>

      {selectedProject && (
        <ProjectShareForm
          project={selectedProject}
          isOpen={showShareForm}
          onClose={() => {
            setShowShareForm(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
}
