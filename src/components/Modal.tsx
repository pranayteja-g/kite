import type { ReactNode } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4 py-0 sm:py-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border-t border-l border-r sm:border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-2xl max-h-[90vh] sm:max-h-screen overflow-y-auto modal-content">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-neutral-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-all duration-200 flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}