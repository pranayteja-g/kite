import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, createGoal, deleteGoal } from '../lib/api/goals';

export function useGoals() {
  return useQuery({ queryKey: ['goals'], queryFn: fetchGoals });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}