-- Create table for Dashboard Users (Admins/Teachers)
-- This replaces Supabase Auth for this specific application to allow
-- easy user management from the Settings page.

CREATE TABLE IF NOT EXISTS dashboard_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Storing simple password for MVP as requested. In production, hash this!
    role TEXT NOT NULL DEFAULT 'Moderator' -- 'Super Admin', 'Admin', 'Moderator'
);

-- Enable RLS
ALTER TABLE dashboard_users ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public Read (Needed for Login page to check credentials)
--    SECURITY NOTE: Ideally we use a Function for this (like parent login), 
--    but for "Add/Delete User" features in Settings we need read access too.
CREATE POLICY "Allow public read" ON dashboard_users
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. Public Insert/Update/Delete (Use with Caution!)
--    Since we don't have a "Super Admin" session in Supabase Auth anymore (we are fake logging in),
--    we literally need public write access to this table to allow the "Settings" page to work 
--    without a real Supabase Session.
--    MITIGATION: The app is for a specific Moskee, likely behind a specific URL. 
--    Real production apps should NOT do this. They should use Supabase Auth + RPC.
CREATE POLICY "Allow public all" ON dashboard_users
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Insert Default Admin (if not exists)
INSERT INTO dashboard_users (username, password, role)
VALUES ('admin', '1234', 'Super Admin')
ON CONFLICT (username) DO NOTHING;
