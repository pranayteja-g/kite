import { supabase } from '../supabaseClient';
import type { DebtPayment } from '../../types/database';

export async function fetchDebtPayments(debtId: string): Promise<DebtPayment[]> {
  const { data, error } = await supabase
    .from('debt_payments')
    .select('*')
    .eq('debt_id', debtId)
    .order('payment_date', { ascending: false });
  if (error) throw error;
  return data as DebtPayment[];
}

export interface CreateDebtPaymentInput {
  debt_id: string;
  amount: number;
  principal?: number;
  interest?: number;
  payment_date: string;
  notes?: string;
}

export async function createDebtPayment(input: CreateDebtPaymentInput): Promise<DebtPayment> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('debt_payments')
    .insert({ ...input, user_id: userData.user.id })
    .select()
    .single();

  if (error) throw error;
  return data as DebtPayment;
}

export async function deleteDebtPayment(id: string): Promise<void> {
  const { error } = await supabase.from('debt_payments').delete().eq('id', id);
  if (error) throw error;
}