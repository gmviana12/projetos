import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectMember, InsertProjectMember, User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function useProjectMembers(projectId: string) {
  const queryClient = useQueryClient();

  const members = useQuery<(ProjectMember & { user: User })[]>({
    queryKey: ['/api/project-members', projectId],
    queryFn: () => apiRequest(`/api/project-members?projectId=${projectId}`),
    enabled: !!projectId,
  });

  const addMember = useMutation({
    mutationFn: (data: InsertProjectMember) =>
      apiRequest('/api/project-members', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-members', projectId] });
    },
  });

  const removeMember = useMutation({
    mutationFn: (userId: string) =>
      apiRequest(`/api/project-members/${projectId}/${userId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-members', projectId] });
    },
  });

  const updateMemberRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiRequest(`/api/project-members/${projectId}/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-members', projectId] });
    },
  });

  return {
    members: members.data,
    isLoading: members.isLoading,
    error: members.error,
    addMember,
    removeMember,
    updateMemberRole,
  };
}