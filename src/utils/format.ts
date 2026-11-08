// Kenyan Shilling currency formatter
const kenyanShilling = new Intl.NumberFormat('en-KE', {
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number): string => `KSh ${kenyanShilling.format(Math.round(amount))}`;

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
