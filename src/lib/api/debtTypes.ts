import { supabase } from '../supabaseClient';
import type { DebtType } from '../../types/database';

export async function fetchDebtTypes(): Promise<DebtType[]> {
  const { data, error } = await supabase.from('debt_types').select('*').order('name');
  if (error) throw error;
  return data as DebtType[];
}

export async function createDebtType(input: { name: string }): Promise<DebtType> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('debt_types')
    .insert({ ...input, user_id: userData.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as DebtType;
}

export async function deleteDebtType(id: string): Promise<void> {
  const { error } = await supabase.from('debt_types').delete().eq('id', id);
  if (error) throw error;
}