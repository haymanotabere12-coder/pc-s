-- Add notification column to existing orders table
-- Run this ONLY if you already ran payment_system_migration.sql

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_message_seen TINYINT(1) DEFAULT 0 AFTER admin_response;

SELECT 'Notification column added successfully!' as status;
