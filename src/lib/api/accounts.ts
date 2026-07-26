import { supabase } from '../supabaseClient';
import type { Account, AccountType } from '../../types/database';

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Account[];
}

export async function createAccount(input: {
  name: string;
  type: AccountType;
  currency: string;
  opening_balance: number;
  color: string;
}): Promise<Account> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('accounts')
    .insert({
      user_id: userData.user.id,
      name: input.name,
      type: input.type,
      currency: input.currency,
      opening_balance: input.opening_balance,
      current_balance: input.opening_balance,
      color: input.color,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Account;
}

export async function updateAccount(
  id: string,
  input: Partial<Pick<Account, 'name' | 'type' | 'color'>>
): Promise<Account> {
  const { data, error } = await supabase
    .from('accounts')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Account;
}

export async function deleteAccount(id: string): Promise<void> {
  const { error } = await supabase.from('accounts').delete().eq('id', id);
  if (error) throw error;
}