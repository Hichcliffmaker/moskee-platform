-- FIX RLS POLICIES FOR CUSTOM AUTH
-- Since we are using a custom 'dashboard_users' table for login, 
-- the active session is 'anonymous' (anon), not 'authenticated'.
-- We must update policies to allow 'anon' access for the Dashboard to work.

-- 1. GROUPS TABLE
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Allow authenticated insert" ON groups;
DROP POLICY IF EXISTS "Allow authenticated update" ON groups;
DROP POLICY IF EXISTS "Allow authenticated delete" ON groups;

-- Create Permissive Policies
CREATE POLICY "Allow anon insert" ON groups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon update" ON groups FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow anon delete" ON groups FOR DELETE TO anon, authenticated USING (true);


-- 2. STUDENTEN TABLE (Assuming it exists and has policies)
-- Try/Catch block isn't supported in standard SQL script like this easily, 
-- so we just apply widely if table exists.
-- (If 'students' table policies block you later, run similar commands for it)


-- 3. ABSENCES TABLE
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON absences;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON absences;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON absences;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON absences;

CREATE POLICY "Allow anon select absences" ON absences FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anon insert absences" ON absences FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon update absences" ON absences FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow anon delete absences" ON absences FOR DELETE TO anon, authenticated USING (true);


-- 4. QURAN PROGRESS TABLE
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON quran_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON quran_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON quran_progress;

CREATE POLICY "Allow anon select quran" ON quran_progress FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anon insert quran" ON quran_progress FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon update quran" ON quran_progress FOR UPDATE TO anon, authenticated USING (true);
