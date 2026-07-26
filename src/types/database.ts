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
  debt_type: string;
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