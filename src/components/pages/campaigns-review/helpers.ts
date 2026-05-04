export function formatAmount(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getProgress(goalAmount: number, raisedAmount: number): number {
  if (goalAmount <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round((raisedAmount / goalAmount) * 100)),
  );
}
