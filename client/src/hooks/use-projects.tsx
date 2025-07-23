import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';
import { type ProjectWithDetails, type InsertProject } from '@shared/schema';

export function useProjects() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async (): Promise<ProjectWithDetails[]> => {
      const response = await fetch(`/api/projects?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const createProject = useMutation({
    mutationFn: async (project: InsertProject) => {
      const response = await apiRequest('POST', '/api/projects', project);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InsertProject> }) => {
      const response = await apiRequest('PUT', `/api/projects/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  return {
    data: projectsQuery.data,
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    createProject,
    updateProject,
    deleteProject,
  };
}
