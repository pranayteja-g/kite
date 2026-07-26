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
    <div className="p-8 space-y-10 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Manage Types</h1>
        <p className="text-sm text-neutral-500">Customize the account types, debt types, and categories you use.</p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Account Types</h2>
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

      <section>
        <h2 className="mb-3 text-lg font-semibold">Debt Types</h2>
        <TypeList
          items={debtTypes ?? []}
          onAdd={async (name) => {
            await createDebtType.mutateAsync({ name });
          }}
          onDelete={(id) => deleteDebtType.mutate(id)}
          isDeleting={deleteDebtType.isPending}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Categories</h2>
        <p className="mb-2 text-xs text-neutral-500">Income categories</p>
        <TypeList
          items={(categories ?? []).filter((c) => c.kind === 'income')}
          onAdd={async (name) => {
            await createCategory.mutateAsync({ name, kind: 'income' as CategoryKind });
          }}
          onDelete={(id) => deleteCategory.mutate(id)}
          isDeleting={deleteCategory.isPending}
        />
        <p className="mb-2 mt-4 text-xs text-neutral-500">Expense categories</p>
        <TypeList
          items={(categories ?? []).filter((c) => c.kind === 'expense')}
          onAdd={async (name) => {
            await createCategory.mutateAsync({ name, kind: 'expense' as CategoryKind });
          }}
          onDelete={(id) => deleteCategory.mutate(id)}
          isDeleting={deleteCategory.isPending}
        />
      </section>
    </div>
  );
}