import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ConfirmModal({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', isOpen, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-glass-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <button onClick={onCancel} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
          <p>{message}</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition disabled:opacity-60"
          >
            {loading ? 'Deleting…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
