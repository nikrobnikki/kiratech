export default function StatusBadge({ status, type = 'request' }) {
  const map = {
    // Request statuses
    pending:     'badge-pending',
    assigned:    'badge-assigned',
    accepted:    'badge-accepted',
    in_progress: 'badge-in_progress',
    completed:   'badge-completed',
    cancelled:   'badge-cancelled',
    rejected:    'badge-rejected',
    // Payment statuses
    paid:        'badge-paid',
    unpaid:      'badge-unpaid',
    waived:      'badge-waived',
    // Generic
    succeeded:              'badge-completed',
    awaiting_confirmation:  'badge-assigned',
    failed:                 'badge-cancelled',
  };

  const label = status?.replace('_', ' ');
  return (
    <span className={map[status] || 'badge-pending'}>
      {label}
    </span>
  );
}
