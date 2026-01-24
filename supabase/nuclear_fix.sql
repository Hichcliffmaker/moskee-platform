-- NUCLEAR OPTION: FORCE PUBLIC ACCESS TO GROUPS
-- Run this if you still get "row-level security policy" errors.

-- 1. Disable RLS momentarily to clear clean slate (optional but good for reset)
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON groups;
DROP POLICY IF EXISTS "Allow authenticated insert" ON groups;
DROP POLICY IF EXISTS "Allow authenticated update" ON groups;
DROP POLICY IF EXISTS "Allow authenticated delete" ON groups;
DROP POLICY IF EXISTS "Allow anon insert" ON groups;
DROP POLICY IF EXISTS "Allow anon update" ON groups;
DROP POLICY IF EXISTS "Allow anon delete" ON groups;
DROP POLICY IF EXISTS "Allow public all" ON groups;

-- 3. Re-enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- 4. Create ONE SINGLE policy that allows EVERYTHING to EVERYONE
CREATE POLICY "Allow public all" ON groups
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
