-- Create table for Parent Access Codes
CREATE TABLE IF NOT EXISTS parent_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    UNIQUE(student_id) -- One code per student for now
);

-- Enable RLS
ALTER TABLE parent_codes ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Allow anyone to read (needed for login check without being signed in initially)
--    In a production app, we might use a Database Function (RPC) for more security to hide codes,
--    but for this MVP, allowing public read to verify the code client-side is acceptable 
--    IF we trust the client logic (which we shouldn't fully, but it fits the "simple" requirement).
--    BETTER APPROACH: Use a Postgres Function to verify credentials.

CREATE OR REPLACE FUNCTION verify_parent_code(search_name TEXT, input_code TEXT)
RETURNS UUID AS $$
DECLARE
    found_student_id UUID;
BEGIN
    SELECT s.id INTO found_student_id
    FROM students s
    JOIN parent_codes p ON s.id = p.student_id
    WHERE s.first_name ILIKE search_name
    AND p.code = input_code
    LIMIT 1;

    RETURN found_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION verify_parent_code TO anon, authenticated, service_role;

-- Minimal policy for table just in case direct access is attempted (restrict to service role or authenticated if needed)
CREATE POLICY "Allow service role full access" ON parent_codes
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
    
-- (Optional) If you want to allow direct select for debugging, un-comment:
-- CREATE POLICY "Allow public read" ON parent_codes FOR SELECT TO anon USING (true);
