import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { TimeTrackingWidget } from '@/components/dashboard/time-tracking-widget';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectForm } from '@/components/forms/project-form';
import { TaskForm } from '@/components/forms/task-form';
import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { user } = useAuth();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats', user?.id],
    enabled: !!user?.id,
  });

  const defaultStats = {
    activeProjects: 0,
    completedTasks: 0,
    hoursThisMonth: 0,
    teamMembers: 0,
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="ml-64">
        <TopBar
          title="Project Dashboard"
          subtitle="Monitor your projects and track progress"
          onCreateProject={() => setShowProjectForm(true)}
          onCreateTask={() => setShowTaskForm(true)}
        />

        <div className="p-6 space-y-8">
          <StatsCards stats={stats || defaultStats} />
          
          <KanbanBoard />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimeTrackingWidget />
            <RecentActivity />
          </div>
        </div>
      </div>

      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSuccess={() => setShowProjectForm(false)}
            onCancel={() => setShowProjectForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projectId="" // This would be selected from a dropdown or current project
            onSuccess={() => setShowTaskForm(false)}
            onCancel={() => setShowTaskForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
