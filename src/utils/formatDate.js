const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Format a blog date for display.
 *
 * The Supabase `date` column (and exported JSON) stores ISO `YYYY-MM-DD`.
 * This renders it as e.g. "Mar 30, 2026" while parsing the parts manually
 * to avoid the timezone shift you get from `new Date('2026-03-30')`.
 *
 * Legacy free-text values (e.g. "Feb 2026") and empty values pass through
 * unchanged so nothing breaks during the migration.
 */
export const formatBlogDate = (value) => {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName) return value;
  return `${monthName} ${Number(day)}, ${year}`;
};
