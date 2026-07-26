import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAccountTypes, createAccountType, deleteAccountType } from '../lib/api/accountTypes';

export function useAccountTypes() {
  return useQuery({ queryKey: ['accountTypes'], queryFn: fetchAccountTypes });
}

export function useCreateAccountType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAccountType,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accountTypes'] }),
  });
}

export function useDeleteAccountType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAccountType,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accountTypes'] }),
  });
}