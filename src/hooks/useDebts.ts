import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDebts, createDebt, updateDebtStatus, deleteDebt } from '../lib/api/debts';
import type { DebtStatus } from '../types/database';

export function useDebts() {
  return useQuery({ queryKey: ['debts'], queryFn: fetchDebts });
}

export function useCreateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDebt,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debts'] }),
  });
}

export function useUpdateDebtStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DebtStatus }) => updateDebtStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debts'] }),
  });
}

export function useDeleteDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDebt,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debts'] }),
  });
}