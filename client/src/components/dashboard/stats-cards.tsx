import { Card } from '@/components/ui/card';
import { FolderKanban, CheckSquare, Clock, Users } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    activeProjects: number;
    completedTasks: number;
    hoursThisMonth: number;
    teamMembers: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      change: '+12%',
      icon: FolderKanban,
      bgColor: 'bg-brand-100',
      iconColor: 'text-brand-600',
    },
    {
      title: 'Tasks Completed',
      value: stats.completedTasks,
      change: '+8%',
      icon: CheckSquare,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Hours This Month',
      value: stats.hoursThisMonth,
      change: '+5%',
      icon: Clock,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Team Members',
      value: stats.teamMembers,
      change: '+2',
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <card.icon className={`${card.iconColor} text-xl`} />
            </div>
            <span className="text-sm text-green-600 font-semibold">{card.change}</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
          <div className="text-slate-600 text-sm">{card.title}</div>
        </Card>
      ))}
    </div>
  );
}
