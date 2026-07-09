-- Add an admin-only view counter to blog posts.
-- Run this in the Supabase SQL editor.

-- 1. Column: per-post view total, defaults to 0.
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

-- 2. Safe increment RPC. SECURITY DEFINER lets the public (anon) key call
--    this without being granted direct UPDATE on the table, so a caller can
--    only ever bump a published post's count by 1 -- never set it arbitrarily.
CREATE OR REPLACE FUNCTION public.increment_blog_view(blog_slug text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.blogs
     SET view_count = view_count + 1
   WHERE slug = blog_slug
     AND published = true;
$$;

-- 3. Allow the anon + authenticated roles to call the function.
GRANT EXECUTE ON FUNCTION public.increment_blog_view(text) TO anon, authenticated;
