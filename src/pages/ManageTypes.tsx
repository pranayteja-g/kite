import { useAccountTypes, useCreateAccountType, useDeleteAccountType } from '../hooks/useAccountTypes';
import { useDebtTypes, useCreateDebtType, useDeleteDebtType } from '../hooks/useDebtTypes';
import { useCategories, useCreateCategory, useDeleteCategory } from '../hooks/useCategories';
import { TypeList } from '../components/TypeList';
import type { AccountKind, CategoryKind } from '../types/database';

export function ManageTypes() {
  const { data: accountTypes } = useAccountTypes();
  const createAccountType = useCreateAccountType();
  const deleteAccountType = useDeleteAccountType();

  const { data: debtTypes } = useDebtTypes();
  const createDebtType = useCreateDebtType();
  const deleteDebtType = useDeleteDebtType();

  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-10 sm:space-y-12 max-w-3xl bg-gradient-to-b from-neutral-950 to-neutral-900/50">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Manage Types</h1>
        <p className="text-sm text-neutral-400 mt-2 font-medium">Customize the account types, debt types, and categories you use.</p>
      </div>

      <section className="space-y-4">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-100 uppercase tracking-wide">Account Types</h2>
          <p className="text-sm text-neutral-400 mt-1 font-medium">Organize your assets and liabilities</p>
        </div>
        <TypeList
          items={accountTypes ?? []}
          kindOptions={[
            { value: 'asset', label: 'Asset' },
            { value: 'liability', label: 'Liability' },
          ]}
          onAdd={async (name, kind) => {
            await createAccountType.mutateAsync({ name, kind: kind as AccountKind });
          }}
          onDelete={(id) => deleteAccountType.mutate(id)}
          isDeleting={deleteAccountType.isPending}
        />
      </section>

      <section className="space-y-4">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-100 uppercase tracking-wide">Debt Types</h2>
          <p className="text-sm text-neutral-400 mt-1 font-medium">Define different types of debts</p>
        </div>
        <TypeList
          items={debtTypes ?? []}
          onAdd={async (name) => {
            await createDebtType.mutateAsync({ name });
          }}
          onDelete={(id) => deleteDebtType.mutate(id)}
          isDeleting={deleteDebtType.isPending}
        />
      </section>

      <section className="space-y-4">
        <div className="pb-4 border-b border-neutral-800">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-100 uppercase tracking-wide">Categories</h2>
          <p className="text-sm text-neutral-400 mt-1 font-medium">Organize your income and expenses</p>
        </div>
        
        <div>
          <p className="mb-3 text-xs text-neutral-400 uppercase font-bold tracking-wider">Income categories</p>
          <TypeList
            items={(categories ?? []).filter((c) => c.kind === 'income')}
            onAdd={async (name) => {
              await createCategory.mutateAsync({ name, kind: 'income' as CategoryKind });
            }}
            onDelete={(id) => deleteCategory.mutate(id)}
            isDeleting={deleteCategory.isPending}
          />
        </div>

        <div className="pt-4 border-t border-neutral-800">
          <p className="mb-3 text-xs text-neutral-400 uppercase font-bold tracking-wider">Expense categories</p>
          <TypeList
            items={(categories ?? []).filter((c) => c.kind === 'expense')}
            onAdd={async (name) => {
              await createCategory.mutateAsync({ name, kind: 'expense' as CategoryKind });
            }}
            onDelete={(id) => deleteCategory.mutate(id)}
            isDeleting={deleteCategory.isPending}
          />
        </div>
      </section>
    </div>
  );
}