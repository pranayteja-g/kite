import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDebtTypes, createDebtType, deleteDebtType } from '../lib/api/debtTypes';

export function useDebtTypes() {
  return useQuery({ queryKey: ['debtTypes'], queryFn: fetchDebtTypes });
}

export function useCreateDebtType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDebtType,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debtTypes'] }),
  });
}

export function useDeleteDebtType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDebtType,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debtTypes'] }),
  });
}