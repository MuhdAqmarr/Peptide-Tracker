import { describe, it, expect, beforeEach, vi } from 'vitest';
import { enqueue, dequeue, getQueue, clearQueue, getQueueLength } from './queue';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => 'mock-uuid-1234'),
});

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('offline queue', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('enqueue', () => {
    it('adds an action to the queue', () => {
      enqueue({ type: 'LOG_INJECTION', payload: { dose_id: '123' } });
      const queue = getQueue();
      expect(queue.length).toBe(1);
      expect(queue[0].type).toBe('LOG_INJECTION');
      expect(queue[0].payload).toEqual({ dose_id: '123' });
      expect(queue[0].id).toBe('mock-uuid-1234');
      expect(queue[0].createdAt).toBeDefined();
    });

    it('appends to existing queue', () => {
      enqueue({ type: 'ACTION_1', payload: {} });
      enqueue({ type: 'ACTION_2', payload: {} });
      expect(getQueueLength()).toBe(2);
    });
  });

  describe('dequeue', () => {
    it('removes and returns the first item', () => {
      enqueue({ type: 'FIRST', payload: {} });
      enqueue({ type: 'SECOND', payload: {} });
      const item = dequeue();
      expect(item?.type).toBe('FIRST');
      expect(getQueueLength()).toBe(1);
    });

    it('returns undefined when queue is empty', () => {
      expect(dequeue()).toBeUndefined();
    });
  });

  describe('getQueue', () => {
    it('returns empty array when localStorage is empty', () => {
      expect(getQueue()).toEqual([]);
    });

    it('returns empty array on invalid JSON', () => {
      localStorageMock.setItem('protocolpal_offline_queue', 'not-json');
      expect(getQueue()).toEqual([]);
    });
  });

  describe('clearQueue', () => {
    it('removes all items', () => {
      enqueue({ type: 'TEST', payload: {} });
      enqueue({ type: 'TEST', payload: {} });
      clearQueue();
      expect(getQueueLength()).toBe(0);
    });
  });

  describe('getQueueLength', () => {
    it('returns 0 for empty queue', () => {
      expect(getQueueLength()).toBe(0);
    });

    it('returns correct count', () => {
      enqueue({ type: 'A', payload: {} });
      enqueue({ type: 'B', payload: {} });
      enqueue({ type: 'C', payload: {} });
      expect(getQueueLength()).toBe(3);
    });
  });
});
