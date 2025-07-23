import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onCreateProject?: () => void;
  onCreateTask?: () => void;
}

export function TopBar({ title, subtitle, onCreateProject, onCreateTask }: TopBarProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-slate-600">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {onCreateProject && (
            <Button onClick={onCreateProject} className="bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          )}
          {onCreateTask && (
            <Button onClick={onCreateTask} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
