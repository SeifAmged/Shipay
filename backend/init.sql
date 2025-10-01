-- Shipay Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create additional indexes for better performance
-- (These will be created after Django migrations run)

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE shipay_db TO shipay_user;
