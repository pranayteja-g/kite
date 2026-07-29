import type { Account } from '../types/database';

export function isLiabilityAccount(account: Pick<Account, 'account_type'>): boolean {
  return account.account_type?.kind === 'liability';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}