-- ADD TYPE COLUMN TO GROUPS
ALTER TABLE groups ADD COLUMN IF NOT EXISTS type text DEFAULT 'Overig';

-- MIGRATE EXISTING DATA
-- If name contains Koran or Hifz, set type to 'Koran'
UPDATE groups 
SET type = 'Koran' 
WHERE name ILIKE '%koran%' OR name ILIKE '%hifz%' OR name ILIKE '%basis%';

-- If name contains Arabisch, set type to 'Arabisch'
UPDATE groups 
SET type = 'Arabisch' 
WHERE name ILIKE '%arabisch%';
