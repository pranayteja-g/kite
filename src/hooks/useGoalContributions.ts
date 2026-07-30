import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchGoalContributions,
  createGoalContribution,
  deleteGoalContribution,
} from '../lib/api/goalContributions';

export function useGoalContributions(goalId: string) {
  return useQuery({
    queryKey: ['goalContributions', goalId],
    queryFn: () => fetchGoalContributions(goalId),
    enabled: !!goalId,
  });
}

export function useCreateGoalContribution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createGoalContribution,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['goalContributions', variables.goal_id] });
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useDeleteGoalContribution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, goalId }: { id: string; goalId: string }) => deleteGoalContribution(id),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['goalContributions', variables.goalId] });
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}