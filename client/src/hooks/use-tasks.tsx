import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';
import { type TaskWithDetails, type InsertTask } from '@shared/schema';

export function useTasks(projectId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: projectId ? ['/api/tasks', projectId] : ['/api/tasks', user?.id],
    queryFn: async (): Promise<TaskWithDetails[]> => {
      const params = projectId 
        ? `projectId=${projectId}`
        : `userId=${user?.id}`;
      const response = await fetch(`/api/tasks?${params}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
    enabled: !!(projectId || user?.id),
  });

  const createTask = useMutation({
    mutationFn: async (task: InsertTask) => {
      const response = await apiRequest('POST', '/api/tasks', task);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InsertTask> }) => {
      const response = await apiRequest('PUT', `/api/tasks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  const moveTask = useMutation({
    mutationFn: async ({ taskId, status, position }: { taskId: string; status: string; position: number }) => {
      // Update the specific task with new status and position
      const response = await apiRequest('PUT', `/api/tasks/${taskId}`, { status, position });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const updateTaskPositions = useMutation({
    mutationFn: async (updates: { id: string; position: number; status: string }[]) => {
      const response = await apiRequest('PUT', '/api/tasks/positions', updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  return {
    data: tasksQuery.data,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask,
    updateTask,
    moveTask,
    updateTaskPositions,
    deleteTask,
  };
}
