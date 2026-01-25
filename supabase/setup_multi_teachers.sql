-- Create join table for many-to-many relationship between groups and teachers
CREATE TABLE IF NOT EXISTS group_teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES dashboard_users(id) ON DELETE CASCADE,
    UNIQUE(group_id, teacher_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_group_teachers_group_id ON group_teachers(group_id);
CREATE INDEX IF NOT EXISTS idx_group_teachers_teacher_id ON group_teachers(teacher_id);

-- Enable RLS
ALTER TABLE group_teachers ENABLE ROW LEVEL SECURITY;

-- Permissive Policies for MVP
CREATE POLICY "Allow public read teachers" ON group_teachers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public all teachers" ON group_teachers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- SAFE MIGRATION: Only try to migrate if the column actually exists in groups
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='groups' AND column_name='teacher_id'
    ) THEN
        INSERT INTO group_teachers (group_id, teacher_id)
        SELECT id, teacher_id FROM groups WHERE teacher_id IS NOT NULL
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
