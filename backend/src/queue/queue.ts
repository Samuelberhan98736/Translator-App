type QueueHandler = (payload: unknown) => Promise<void>;

const handlers = new Map<string, QueueHandler>();

export function registerQueueHandler(name: string, handler: QueueHandler): void {
  handlers.set(name, handler);
}

export function enqueue(name: string, payload: unknown): void {
  const handler = handlers.get(name);
  if (!handler) {
    return;
  }

  setTimeout(() => {
    void handler(payload);
  }, 15);
}
