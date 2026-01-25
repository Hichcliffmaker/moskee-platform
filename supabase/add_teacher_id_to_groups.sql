-- Add teacher_id column to groups table
-- This allows linking a group to a specific user account in dashboard_users

ALTER TABLE groups 
ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES dashboard_users(id) ON DELETE SET NULL;

-- Index for faster filtering
CREATE INDEX IF NOT EXISTS idx_groups_teacher_id ON groups(teacher_id);

-- Optional: Migrate existing teacher names if possible (manual step or complex SQL)
-- For now, we will maintain both columns briefly and let the UI handle the transition.
