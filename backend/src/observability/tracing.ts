export function startSpan(name: string): () => void {
  const start = Date.now();
  return () => {
    const durationMs = Date.now() - start;
    console.debug(`[trace] ${name} ${durationMs}ms`);
  };
}
