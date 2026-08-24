-- Add profile avatar support for existing installations
ALTER TABLE users
ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) DEFAULT NULL;
