-- Create table for Groups (Klassen)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    teacher TEXT,
    room TEXT,
    schedule TEXT,
    description TEXT
);

-- Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public Read (Authenticated & Anon) - useful for viewing schedules
CREATE POLICY "Allow public read access" ON groups
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. Authenticated Insert/Update (Admins/Teachers)
--    For MVP, we allow any authenticated user to edit. 
--    In production, you'd check for a specific role.
CREATE POLICY "Allow authenticated insert" ON groups
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON groups
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON groups
    FOR DELETE
    TO authenticated
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" ON groups
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
