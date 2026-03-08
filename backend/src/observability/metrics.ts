const counters = new Map<string, number>();

export function incrementMetric(name: string): void {
  const current = counters.get(name) ?? 0;
  counters.set(name, current + 1);
}

export function getMetricsSnapshot(): Record<string, number> {
  return Object.fromEntries(counters.entries());
}
