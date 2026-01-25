-- Create table for School Agenda
CREATE TABLE IF NOT EXISTS agenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'event', -- 'event', 'holiday', 'class'
    time TEXT -- Optional time description like "10:00 - 12:00"
);

-- Enable RLS
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public Read (All users)
CREATE POLICY "Allow public read agenda" ON agenda
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. Authenticated All (Admins/Teachers)
CREATE POLICY "Allow authenticated manage agenda" ON agenda
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
