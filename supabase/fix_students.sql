-- FIX STUDENTS RLS
-- Allows creating new students without 'authenticated' Supabase session.

ALTER TABLE students DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON students;
DROP POLICY IF EXISTS "Allow authenticated insert" ON students;
DROP POLICY IF EXISTS "Allow authenticated update" ON students;
DROP POLICY IF EXISTS "Allow authenticated delete" ON students;
DROP POLICY IF EXISTS "Allow anon insert" ON students;
DROP POLICY IF EXISTS "Allow anon update" ON students;
DROP POLICY IF EXISTS "Allow public all" ON students;

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all" ON students
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
