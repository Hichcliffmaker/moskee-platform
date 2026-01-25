-- Fix RLS for agenda table to work with custom Auth
DROP POLICY IF EXISTS "Allow authenticated manage agenda" ON agenda;

-- Allow public manage (needed because we use custom login, not Supabase Auth)
CREATE POLICY "Allow public manage agenda" ON agenda
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
