-- Convert blogs.date from TEXT to a proper DATE column.
-- Run this in the Supabase SQL editor.

-- 1. (Optional) Check for rows whose date won't parse cleanly first:
--    SELECT id, title, date FROM blogs
--    WHERE date IS NOT NULL AND date <> ''
--      AND date !~ '^\d{4}-\d{2}-\d{2}$'
--      AND date !~ '^[A-Za-z]{3} \d{1,2}, \d{4}$';
--    Fix any results manually (e.g. day-less "Feb 2026") before migrating.

-- 2. Normalise empty strings to NULL so the cast doesn't fail.
UPDATE blogs SET date = NULL WHERE date = '';

-- 3. Alter the column type. Postgres parses both ISO ("2026-03-30")
--    and the existing "Mar 30, 2026" text form via ::date.
ALTER TABLE blogs
  ALTER COLUMN date TYPE date
  USING NULLIF(TRIM(date), '')::date;
