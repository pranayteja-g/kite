import { supabase } from '../supabaseClient';
import type { Transaction, TransactionType } from '../../types/database';

const SELECT_WITH_RELATIONS = `
  *,
  account:accounts!transactions_account_id_fkey(id,name,color),
  to_account:accounts!transactions_to_account_id_fkey(id,name,color),
  category:categories(id,name,color,icon)
`;

export interface TransactionFilters {
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select(SELECT_WITH_RELATIONS)
    .order('occurred_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters.type) query = query.eq('type', filters.type);
  if (filters.accountId) query = query.eq('account_id', filters.accountId);
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId);
  if (filters.startDate) query = query.gte('occurred_at', filters.startDate);
  if (filters.endDate) query = query.lte('occurred_at', filters.endDate);
  if (filters.search) {
    query = query.or(
      `merchant.ilike.%${filters.search}%,description.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as Transaction[];
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  account_id: string;
  to_account_id?: string | null;
  category_id?: string | null;
  merchant?: string;
  description?: string;
  notes?: string;
  tags?: string[];
  occurred_at: string;
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...input, user_id: userData.user.id })
    .select(SELECT_WITH_RELATIONS)
    .single();

  if (error) throw error;
  return data as unknown as Transaction;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
}