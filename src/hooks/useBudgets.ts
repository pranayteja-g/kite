import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBudgets, createBudget, deleteBudget } from '../lib/api/budgets';

export function useBudgets() {
  return useQuery({ queryKey: ['budgets'], queryFn: fetchBudgets });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}