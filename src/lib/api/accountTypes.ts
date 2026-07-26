import { supabase } from '../supabaseClient';
import type { AccountType, AccountKind } from '../../types/database';

export async function fetchAccountTypes(): Promise<AccountType[]> {
  const { data, error } = await supabase.from('account_types').select('*').order('name');
  if (error) throw error;
  return data as AccountType[];
}

export async function createAccountType(input: { name: string; kind: AccountKind }): Promise<AccountType> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('account_types')
    .insert({ ...input, user_id: userData.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as AccountType;
}

export async function deleteAccountType(id: string): Promise<void> {
  const { error } = await supabase.from('account_types').delete().eq('id', id);
  if (error) throw error;
}