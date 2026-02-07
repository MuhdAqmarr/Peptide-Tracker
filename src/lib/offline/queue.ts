const QUEUE_KEY = 'protocolpal_offline_queue';

export type OfflineAction = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export function enqueue(action: Omit<OfflineAction, 'id' | 'createdAt'>): void {
  const queue = getQueue();
  queue.push({
    ...action,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function dequeue(): OfflineAction | undefined {
  const queue = getQueue();
  const item = queue.shift();
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return item;
}

export function getQueue(): OfflineAction[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as OfflineAction[]) : [];
  } catch {
    return [];
  }
}

export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}

export function getQueueLength(): number {
  return getQueue().length;
}
