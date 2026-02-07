// Database types aligned with the Supabase schema.
// These will be used across DAL modules for type safety.
// In future, these can be replaced with generated types from Supabase CLI.

export type Profile = {
  id: string;
  display_name: string | null;
  created_at: string;
};

export type Peptide = {
  id: string;
  user_id: string;
  name: string;
  unit: string;
  route: string | null;
  notes: string | null;
  created_at: string;
};

export type Protocol = {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
};

export type FrequencyType = 'ED' | 'EOD' | 'WEEKLY' | 'CUSTOM';

export type ProtocolItem = {
  id: string;
  protocol_id: string;
  peptide_id: string;
  dose_value: number;
  frequency_type: FrequencyType;
  interval_days: number | null;
  days_of_week: number[] | null;
  time_of_day: string;
  site_plan_enabled: boolean;
  created_at: string;
};

export type DoseStatus = 'DUE' | 'DONE' | 'SKIPPED' | 'MISSED';

export type ScheduledDose = {
  id: string;
  protocol_item_id: string;
  user_id: string;
  scheduled_at: string;
  status: DoseStatus;
  done_at: string | null;
  created_at: string;
};

export type InjectionLog = {
  id: string;
  scheduled_dose_id: string;
  user_id: string;
  actual_time: string;
  site: string | null;
  pain_score: number | null;
  notes: string | null;
  created_at: string;
};

export type SymptomLog = {
  id: string;
  user_id: string;
  log_time: string;
  nausea: number | null;
  headache: number | null;
  sleep: number | null;
  appetite: number | null;
  notes: string | null;
  created_at: string;
};

/** Joined view used on the dashboard */
export type DashboardDose = ScheduledDose & {
  peptide_name: string;
  peptide_unit: string;
  dose_value: number;
  protocol_name: string;
  time_of_day: string;
};

export type Vial = {
  id: string;
  user_id: string;
  peptide_id: string;
  label: string | null;
  batch: string | null;
  total_amount: number;
  unit: string;
  opened_on: string | null;
  expires_on: string | null;
  remaining_estimate: number | null;
  created_at: string;
};
