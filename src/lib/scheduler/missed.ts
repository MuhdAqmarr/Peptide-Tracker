import { markOverdueDosesAsMissed } from '@/lib/db/dal/scheduledDoses';

/**
 * Mark DUE doses as MISSED if they are older than the threshold.
 *
 * Default threshold: 12 hours. Any dose with scheduled_at more than
 * `thresholdHours` in the past (and still status = DUE) is marked MISSED.
 *
 * This should be called on dashboard load so the UI reflects accurate state.
 */
export async function detectAndMarkMissedDoses(
  thresholdHours = 12,
): Promise<number> {
  const cutoff = new Date(Date.now() - thresholdHours * 60 * 60 * 1000);
  return markOverdueDosesAsMissed(cutoff.toISOString());
}
