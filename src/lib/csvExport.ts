import type { Transaction } from '../types/database';

export function transactionsToCsv(transactions: Transaction[]): string {
  const headers = ['Date', 'Type', 'Amount', 'Account', 'To Account', 'Category', 'Merchant', 'Tags', 'Notes'];
  const rows = transactions.map((tx) => [
    tx.occurred_at,
    tx.type,
    tx.amount.toString(),
    tx.account?.name ?? '',
    tx.to_account?.name ?? '',
    tx.category?.name ?? '',
    tx.merchant ?? '',
    (tx.tags ?? []).join('; '),
    (tx.notes ?? '').replace(/\n/g, ' '),
  ]);

  const escapeCell = (cell: string) =>
    /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;

  return [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
}

export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}