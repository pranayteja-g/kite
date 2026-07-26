import { supabase } from '../supabaseClient';
import type { Debt, DebtDirection, DebtStatus } from '../../types/database';

export async function fetchDebts(): Promise<Debt[]> {
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Debt[];
}

export interface CreateDebtInput {
  person_name: string;
  phone?: string;
  email?: string;
  relationship?: string;
  direction: DebtDirection;
  debt_type: string;
  original_amount: number;
  interest_rate?: number;
  start_date: string;
  end_date?: string;
  monthly_installment?: number;
  payment_frequency?: string;
  due_date?: string;
  notes?: string;
}

export async function createDebt(input: CreateDebtInput): Promise<Debt> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('debts')
    .insert({
      user_id: userData.user.id,
      ...input,
      current_balance: input.original_amount,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Debt;
}

export async function updateDebtStatus(id: string, status: DebtStatus): Promise<void> {
  const { error } = await supabase.from('debts').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteDebt(id: string): Promise<void> {
  const { error } = await supabase.from('debts').delete().eq('id', id);
  if (error) throw error;
}