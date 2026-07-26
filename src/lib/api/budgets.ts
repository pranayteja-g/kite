import { supabase } from '../supabaseClient';
import type { Budget, BudgetPeriod } from '../../types/database';

export async function fetchBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*, category:categories(id,name,color,icon)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as Budget[];
}

export interface CreateBudgetInput {
  category_id: string;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('budgets')
    .insert({ ...input, user_id: userData.user.id })
    .select('*, category:categories(id,name,color,icon)')
    .single();

  if (error) throw error;
  return data as unknown as Budget;
}

export async function deleteBudget(id: string): Promise<void> {
  const { error } = await supabase.from('budgets').delete().eq('id', id);
  if (error) throw error;
}