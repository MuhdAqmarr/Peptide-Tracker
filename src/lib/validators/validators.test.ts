import { describe, it, expect } from 'vitest';
import { peptideSchema } from './peptide';
import { protocolSchema } from './protocol';
import { protocolItemSchema } from './protocolItem';
import { injectionLogSchema } from './injectionLog';
import { symptomLogSchema } from './symptomLog';
import { vialSchema } from './vial';

describe('peptideSchema', () => {
  it('accepts valid peptide data', () => {
    const result = peptideSchema.safeParse({
      name: 'BPC-157',
      unit: 'mcg',
      route: 'subcutaneous',
      notes: 'Test notes',
    });
    expect(result.success).toBe(true);
  });

  it('requires name', () => {
    const result = peptideSchema.safeParse({ name: '', unit: 'mcg' });
    expect(result.success).toBe(false);
  });

  it('requires unit', () => {
    const result = peptideSchema.safeParse({ name: 'BPC-157', unit: '' });
    expect(result.success).toBe(false);
  });

  it('allows null/optional route and notes', () => {
    const result = peptideSchema.safeParse({ name: 'BPC-157', unit: 'mcg' });
    expect(result.success).toBe(true);
  });

  it('rejects name over 100 chars', () => {
    const result = peptideSchema.safeParse({
      name: 'x'.repeat(101),
      unit: 'mcg',
    });
    expect(result.success).toBe(false);
  });
});

describe('protocolSchema', () => {
  it('accepts valid protocol data', () => {
    const result = protocolSchema.safeParse({
      name: 'My Protocol',
      start_date: '2025-01-01',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timezone).toBe('Asia/Kuala_Lumpur');
      expect(result.data.is_active).toBe(true);
    }
  });

  it('requires name', () => {
    const result = protocolSchema.safeParse({
      name: '',
      start_date: '2025-01-01',
    });
    expect(result.success).toBe(false);
  });

  it('requires start_date', () => {
    const result = protocolSchema.safeParse({ name: 'Protocol', start_date: '' });
    expect(result.success).toBe(false);
  });

  it('allows null end_date', () => {
    const result = protocolSchema.safeParse({
      name: 'Protocol',
      start_date: '2025-01-01',
      end_date: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('protocolItemSchema', () => {
  const validBase = {
    protocol_id: '550e8400-e29b-41d4-a716-446655440000',
    peptide_id: '550e8400-e29b-41d4-a716-446655440001',
    dose_value: 250,
    frequency_type: 'ED' as const,
    time_of_day: '08:00',
  };

  it('accepts valid ED item', () => {
    const result = protocolItemSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('requires positive dose_value', () => {
    const result = protocolItemSchema.safeParse({ ...validBase, dose_value: -1 });
    expect(result.success).toBe(false);
  });

  it('requires time_of_day', () => {
    const result = protocolItemSchema.safeParse({
      ...validBase,
      time_of_day: '',
    });
    expect(result.success).toBe(false);
  });

  it('requires interval_days for CUSTOM frequency', () => {
    const result = protocolItemSchema.safeParse({
      ...validBase,
      frequency_type: 'CUSTOM',
      interval_days: null,
    });
    expect(result.success).toBe(false);
  });

  it('accepts CUSTOM with valid interval_days', () => {
    const result = protocolItemSchema.safeParse({
      ...validBase,
      frequency_type: 'CUSTOM',
      interval_days: 3,
    });
    expect(result.success).toBe(true);
  });

  it('requires days_of_week for WEEKLY frequency', () => {
    const result = protocolItemSchema.safeParse({
      ...validBase,
      frequency_type: 'WEEKLY',
      days_of_week: null,
    });
    expect(result.success).toBe(false);
  });

  it('accepts WEEKLY with valid days_of_week', () => {
    const result = protocolItemSchema.safeParse({
      ...validBase,
      frequency_type: 'WEEKLY',
      days_of_week: [1, 3, 5],
    });
    expect(result.success).toBe(true);
  });

  it('rejects WEEKLY with empty days_of_week', () => {
    const result = protocolItemSchema.safeParse({
      ...validBase,
      frequency_type: 'WEEKLY',
      days_of_week: [],
    });
    expect(result.success).toBe(false);
  });
});

describe('injectionLogSchema', () => {
  it('accepts valid log', () => {
    const result = injectionLogSchema.safeParse({
      scheduled_dose_id: '550e8400-e29b-41d4-a716-446655440000',
      actual_time: '2025-01-01T08:00:00Z',
      site: 'abd-upper-left',
      pain_score: 3,
    });
    expect(result.success).toBe(true);
  });

  it('requires valid UUID for scheduled_dose_id', () => {
    const result = injectionLogSchema.safeParse({
      scheduled_dose_id: 'not-a-uuid',
      actual_time: '2025-01-01T08:00:00Z',
    });
    expect(result.success).toBe(false);
  });

  it('requires actual_time', () => {
    const result = injectionLogSchema.safeParse({
      scheduled_dose_id: '550e8400-e29b-41d4-a716-446655440000',
      actual_time: '',
    });
    expect(result.success).toBe(false);
  });

  it('validates pain_score range 0-10', () => {
    const valid = injectionLogSchema.safeParse({
      scheduled_dose_id: '550e8400-e29b-41d4-a716-446655440000',
      actual_time: '2025-01-01T08:00:00Z',
      pain_score: 5,
    });
    expect(valid.success).toBe(true);

    const tooHigh = injectionLogSchema.safeParse({
      scheduled_dose_id: '550e8400-e29b-41d4-a716-446655440000',
      actual_time: '2025-01-01T08:00:00Z',
      pain_score: 11,
    });
    expect(tooHigh.success).toBe(false);
  });
});

describe('symptomLogSchema', () => {
  it('accepts valid symptom log', () => {
    const result = symptomLogSchema.safeParse({
      log_time: '2025-01-01T08:00:00Z',
      nausea: 5,
      headache: 3,
      sleep: 7,
      appetite: 6,
      notes: 'Feeling okay',
    });
    expect(result.success).toBe(true);
  });

  it('requires log_time', () => {
    const result = symptomLogSchema.safeParse({ log_time: '' });
    expect(result.success).toBe(false);
  });

  it('allows all scores to be null', () => {
    const result = symptomLogSchema.safeParse({
      log_time: '2025-01-01T08:00:00Z',
    });
    expect(result.success).toBe(true);
  });

  it('validates score range 0-10', () => {
    const result = symptomLogSchema.safeParse({
      log_time: '2025-01-01T08:00:00Z',
      nausea: 11,
    });
    expect(result.success).toBe(false);
  });
});

describe('vialSchema', () => {
  it('accepts valid vial data', () => {
    const result = vialSchema.safeParse({
      peptide_id: '550e8400-e29b-41d4-a716-446655440000',
      total_amount: 5000,
      unit: 'mcg',
    });
    expect(result.success).toBe(true);
  });

  it('requires positive total_amount', () => {
    const result = vialSchema.safeParse({
      peptide_id: '550e8400-e29b-41d4-a716-446655440000',
      total_amount: 0,
      unit: 'mcg',
    });
    expect(result.success).toBe(false);
  });

  it('requires unit', () => {
    const result = vialSchema.safeParse({
      peptide_id: '550e8400-e29b-41d4-a716-446655440000',
      total_amount: 5000,
      unit: '',
    });
    expect(result.success).toBe(false);
  });

  it('allows optional fields to be null', () => {
    const result = vialSchema.safeParse({
      peptide_id: '550e8400-e29b-41d4-a716-446655440000',
      total_amount: 5000,
      unit: 'mcg',
      label: null,
      batch: null,
      opened_on: null,
      expires_on: null,
      remaining_estimate: null,
    });
    expect(result.success).toBe(true);
  });
});
