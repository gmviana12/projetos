import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from '@/components/forms/task-form';
import { useTasks } from '@/hooks/use-tasks';
import { Clock, Calendar, User, CheckSquare } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);

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
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-slate-100 text-slate-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'review':
        return 'Review';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  const formatTimeTracked = (minutes?: number) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="ml-64">
        <TopBar
          title="Tasks"
          subtitle="View and manage all your tasks across projects"
          onCreateTask={() => setShowTaskForm(true)}
        />

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {task.title}
                          </h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)} variant="secondary">
                            {getStatusDisplayName(task.status)}
                          </Badge>
                        </div>
                        
                        {task.description && (
                          <p className="text-slate-600 mb-4">{task.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                          <div className="flex items-center">
                            <CheckSquare className="h-4 w-4 mr-1" />
                            <span>{task.project.name}</span>
                          </div>
                          
                          {task.assignee && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{task.assignee.fullName}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatTimeTracked(task.totalMinutes)}</span>
                          </div>
                          
                          {task.dueDate && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {task.assignee && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {task.assignee.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className="text-right text-xs text-slate-500">
                          <div>Created</div>
                          <div>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <CheckSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No tasks yet
                </h3>
                <p className="text-slate-600 mb-4">
                  Create your first task to start organizing your work.
                </p>
                <Button onClick={() => setShowTaskForm(true)}>
                  Create Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projectId="" // This would be selected from a dropdown
            onSuccess={() => setShowTaskForm(false)}
            onCancel={() => setShowTaskForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
