export type AccountType =
  | 'cash' | 'checking' | 'savings' | 'credit_card'
  | 'upi' | 'wallet' | 'investment' | 'crypto' | 'other';

export type TransactionType = 'income' | 'expense' | 'transfer';
export type CategoryKind = 'income' | 'expense';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  currency: string;
  opening_balance: number;
  current_balance: number;
  color: string;
  icon: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  kind: CategoryKind;
  color: string;
  icon: string;
  is_default: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  to_account_id: string | null;
  type: TransactionType;
  amount: number;
  category_id: string | null;
  merchant: string | null;
  description: string | null;
  notes: string | null;
  tags: string[];
  receipt_url: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
  // joined fields (populated via select with relation)
  account?: Pick<Account, 'id' | 'name' | 'color'>;
  to_account?: Pick<Account, 'id' | 'name' | 'color'>;
  category?: Pick<Category, 'id' | 'name' | 'color' | 'icon'>;
}