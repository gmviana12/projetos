import { Card } from '@/components/ui/card';
import { Check, Plus, MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'task_completed' | 'task_created' | 'comment_added' | 'time_logged';
  user: string;
  action: string;
  target: string;
  timestamp: Date;
}

// Demo data - in a real app, this would come from an API
const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'task_completed',
    user: 'Sarah Johnson',
    action: 'completed',
    target: 'Setup database structure',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: '2',
    type: 'task_created',
    user: 'Mike Chen',
    action: 'created new task',
    target: 'Update API documentation',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: '3',
    type: 'comment_added',
    user: 'Alex Rodriguez',
    action: 'commented on',
    target: 'Design review task',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: '4',
    type: 'time_logged',
    user: 'Emma Wilson',
    action: 'logged 2h 30m on',
    target: 'Frontend development',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
];

export function RecentActivity() {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return <Check className="h-4 w-4 text-blue-600" />;
      case 'task_created':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'comment_added':
        return <MessageCircle className="h-4 w-4 text-purple-600" />;
      case 'time_logged':
        return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  const getActivityBgColor = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return 'bg-blue-100';
      case 'task_created':
        return 'bg-green-100';
      case 'comment_added':
        return 'bg-purple-100';
      case 'time_logged':
        return 'bg-amber-100';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900">
                <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                <span className="font-semibold">"{activity.target}"</span>
              </p>
              <p className="text-xs text-slate-500">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
