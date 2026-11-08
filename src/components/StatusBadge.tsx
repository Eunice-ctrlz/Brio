import type { OrderStatus } from '@/types';

const LABELS: Record<OrderStatus, string> = {
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status status--${status}`}>{LABELS[status] ?? status}</span>;
}