import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchDebtPayments,
  createDebtPayment,
  deleteDebtPayment,
} from '../lib/api/debtPayments';

export function useDebtPayments(debtId: string) {
  return useQuery({
    queryKey: ['debtPayments', debtId],
    queryFn: () => fetchDebtPayments(debtId),
    enabled: !!debtId,
  });
}

export function useCreateDebtPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDebtPayment,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['debtPayments', variables.debt_id] });
      qc.invalidateQueries({ queryKey: ['debts'] });
    },
  });
}

export function useDeleteDebtPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; debtId: string }) => deleteDebtPayment(id),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['debtPayments', variables.debtId] });
      qc.invalidateQueries({ queryKey: ['debts'] });
    },
  });
}