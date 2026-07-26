import { supabase } from '../supabaseClient';
import type { Account } from '../../types/database';

const SELECT = '*, account_type:account_types(id,name,kind,icon)';

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select(SELECT)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as unknown as Account[];
}

export async function createAccount(input: {
  name: string;
  account_type_id: string;
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
      account_type_id: input.account_type_id,
      currency: input.currency,
      opening_balance: input.opening_balance,
      current_balance: input.opening_balance,
      color: input.color,
    })
    .select(SELECT)
    .single();

  if (error) throw error;
  return data as unknown as Account;
}

export async function updateAccount(
  id: string,
  input: {
    name: string;
    account_type_id: string;
    currency: string;
    color: string;
  }
): Promise<Account> {
  const { data, error } = await supabase
    .from('accounts')
    .update({
      name: input.name,
      account_type_id: input.account_type_id,
      currency: input.currency,
      color: input.color,
    })
    .eq('id', id)
    .select(SELECT)
    .single();

  if (error) throw error;

  return data as unknown as Account;
}

export async function deleteAccount(id: string): Promise<void> {
  const { error } = await supabase.from('accounts').delete().eq('id', id);
  if (error) throw error;
}