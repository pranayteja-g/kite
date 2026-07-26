export type CategoryKind = 'income' | 'expense';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountKind = 'asset' | 'liability';

export interface AccountType {
  id: string;
  user_id: string | null;
  name: string;
  kind: AccountKind;
  icon: string;
  is_default: boolean;
}

export interface DebtType {
  id: string;
  user_id: string | null;
  name: string;
  is_default: boolean;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  account_type_id: string;
  currency: string;
  opening_balance: number;
  current_balance: number;
  color: string;
  icon: string;
  created_at: string;
  account_type?: Pick<AccountType, 'id' | 'name' | 'kind' | 'icon'>;
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
  account?: Pick<Account, 'id' | 'name' | 'color'>;
  to_account?: Pick<Account, 'id' | 'name' | 'color'>;
  category?: Pick<Category, 'id' | 'name' | 'color' | 'icon'>;
}

export type DebtDirection = 'owed_by_me' | 'owed_to_me';
export type DebtStatus = 'active' | 'completed' | 'overdue';

export interface Debt {
  id: string;
  user_id: string;
  person_name: string;
  phone: string | null;
  email: string | null;
  relationship: string | null;
  direction: DebtDirection;
  debt_type_id: string;
  original_amount: number;
  current_balance: number;
  interest_rate: number;
  start_date: string;
  end_date: string | null;
  monthly_installment: number | null;
  payment_frequency: string;
  due_date: string | null;
  status: DebtStatus;
  notes: string | null;
  created_at: string;
  debt_type?: Pick<DebtType, 'id' | 'name'>;
}

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  created_at: string;
  category?: Pick<Category, 'id' | 'name' | 'color' | 'icon'>;
}

export interface DebtPayment {
  id: string;
  debt_id: string;
  user_id: string;
  amount: number;
  principal: number | null;
  interest: number | null;
  payment_date: string;
  notes: string | null;
  created_at: string;
}