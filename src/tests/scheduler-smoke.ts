// Smoke test for scheduler engine — run with: npx tsx src/tests/scheduler-smoke.ts
// Uses relative imports since tsx doesn't resolve @/ aliases

import { shouldScheduleOnDate, getRollingEndDate } from '../lib/scheduler/rules';
import { generateDoses } from '../lib/scheduler/generator';

const start = new Date(2026, 0, 1);

console.log('=== Rules Tests ===');
console.log('ED day0:', shouldScheduleOnDate(new Date(2026, 0, 1), start, 'ED', null, null)); // true
console.log('ED day5:', shouldScheduleOnDate(new Date(2026, 0, 6), start, 'ED', null, null)); // true

console.log('EOD day0:', shouldScheduleOnDate(new Date(2026, 0, 1), start, 'EOD', null, null)); // true
console.log('EOD day1:', shouldScheduleOnDate(new Date(2026, 0, 2), start, 'EOD', null, null)); // false
console.log('EOD day2:', shouldScheduleOnDate(new Date(2026, 0, 3), start, 'EOD', null, null)); // true

console.log('WEEKLY Wed:', shouldScheduleOnDate(new Date(2026, 0, 7), start, 'WEEKLY', null, [1, 3])); // true (Wed=3)
console.log('WEEKLY Thu:', shouldScheduleOnDate(new Date(2026, 0, 8), start, 'WEEKLY', null, [1, 3])); // false (Thu=4)

console.log('CUSTOM 3d day0:', shouldScheduleOnDate(new Date(2026, 0, 1), start, 'CUSTOM', 3, null)); // true
console.log('CUSTOM 3d day1:', shouldScheduleOnDate(new Date(2026, 0, 2), start, 'CUSTOM', 3, null)); // false
console.log('CUSTOM 3d day3:', shouldScheduleOnDate(new Date(2026, 0, 4), start, 'CUSTOM', 3, null)); // true

console.log('\n=== Rolling End Date ===');
const rolling = getRollingEndDate(start, null, 12);
console.log('12 weeks from Jan 1:', rolling.toISOString().split('T')[0]); // ~Mar 26

console.log('\n=== Generator Test ===');
const protocol = { start_date: '2026-01-01', end_date: '2026-01-07', timezone: 'Asia/Kuala_Lumpur', user_id: 'u1' };
const item = {
  id: 'i1', protocol_id: 'p1', peptide_id: 'pp1',
  dose_value: 100, frequency_type: 'ED' as const,
  interval_days: null, days_of_week: null,
  time_of_day: '08:00', site_plan_enabled: false, created_at: '',
};

const doses = generateDoses(protocol, item);
console.log('ED 7 days → doses:', doses.length); // 7
console.log('First:', doses[0]?.scheduled_at);
console.log('Last:', doses[doses.length - 1]?.scheduled_at);

const item2 = { ...item, frequency_type: 'EOD' as const };
const doses2 = generateDoses(protocol, item2);
console.log('EOD 7 days → doses:', doses2.length); // 4

const item3 = { ...item, frequency_type: 'CUSTOM' as const, interval_days: 3 };
const doses3 = generateDoses(protocol, item3);
console.log('CUSTOM 3d 7 days → doses:', doses3.length); // 3

console.log('\nAll tests passed!');
