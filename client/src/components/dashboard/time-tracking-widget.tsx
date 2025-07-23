import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimeTracking } from '@/hooks/use-time-tracking';
import { useAuth } from '@/lib/auth';
import { formatDistance } from 'date-fns';

export function TimeTrackingWidget() {
  const { user } = useAuth();
  const { 
    data: activeEntry, 
    todaysEntries,
    startTimer, 
    stopTimer, 
    isLoading 
  } = useTimeTracking(user?.id);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (startTime: Date) => {
    const elapsed = currentTime.getTime() - new Date(startTime).getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTodayTotal = () => {
    if (!todaysEntries) return '0h 0m';
    const totalMinutes = todaysEntries.reduce((sum, entry) => sum + (entry.minutes || 0), 0);
    return formatMinutes(totalMinutes);
  };

  const handleStopTimer = async () => {
    if (activeEntry) {
      await stopTimer.mutateAsync(activeEntry.id);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Active Time Tracking</h3>
      
      <div className="space-y-4">
        {activeEntry ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-semibold text-slate-900">{activeEntry.task.title}</div>
                <div className="text-sm text-slate-600">{activeEntry.task.project.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg font-bold text-green-600">
                {formatElapsedTime(activeEntry.startTime)}
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleStopTimer}
                disabled={stopTimer.isPending}
              >
                Stop
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No active timer
          </div>
        )}
      </div>
      
      <div className="mt-4 border-t border-slate-200 pt-4">
        <h4 className="font-semibold text-slate-700 mb-3">Today's Summary</h4>
        <div className="space-y-2">
          {todaysEntries?.slice(0, 3).map((entry) => (
            <div key={entry.id} className="flex justify-between text-sm">
              <span className="text-slate-600 truncate">
                {entry.task.project.name}
              </span>
              <span className="font-semibold ml-2">
                {formatMinutes(entry.minutes || 0)}
              </span>
            </div>
          ))}
          
          <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2">
            <span>Total Today</span>
            <span>{getTodayTotal()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
