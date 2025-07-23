import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { type TimeEntry, type InsertTimeEntry } from '@shared/schema';

export function useTimeTracking(userId?: string) {
  const queryClient = useQueryClient();

  // Get active time entry
  const activeEntryQuery = useQuery({
    queryKey: ['/api/time-entries/active', userId],
    queryFn: async () => {
      const response = await fetch(`/api/time-entries/active?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch active time entry');
      const data = await response.json();
      return data;
    },
    enabled: !!userId,
    refetchInterval: 1000, // Refetch every second to update the timer
  });

  // Get today's time entries
  const todaysEntriesQuery = useQuery({
    queryKey: ['/api/time-entries', userId, 'today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/time-entries?userId=${userId}&date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch time entries');
      return response.json();
    },
    enabled: !!userId,
  });

  // Get all time entries for a user
  const timeEntriesQuery = useQuery({
    queryKey: ['/api/time-entries', userId],
    queryFn: async () => {
      const response = await fetch(`/api/time-entries?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch time entries');
      return response.json();
    },
    enabled: !!userId,
  });

  const startTimer = useMutation({
    mutationFn: async (timeEntry: InsertTimeEntry) => {
      const response = await apiRequest('POST', '/api/time-entries', {
        ...timeEntry,
        startTime: new Date(),
        isRunning: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries'] });
    },
  });

  const stopTimer = useMutation({
    mutationFn: async (timeEntryId: string) => {
      const response = await apiRequest('PUT', `/api/time-entries/${timeEntryId}/stop`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  const updateTimeEntry = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InsertTimeEntry> }) => {
      const response = await apiRequest('PUT', `/api/time-entries/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries'] });
    },
  });

  const deleteTimeEntry = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/time-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  return {
    data: activeEntryQuery.data,
    todaysEntries: todaysEntriesQuery.data,
    allEntries: timeEntriesQuery.data,
    isLoading: activeEntryQuery.isLoading || todaysEntriesQuery.isLoading,
    error: activeEntryQuery.error || todaysEntriesQuery.error,
    startTimer,
    stopTimer,
    updateTimeEntry,
    deleteTimeEntry,
  };
}
