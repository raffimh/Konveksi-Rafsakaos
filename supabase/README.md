# Supabase Database Setup - RafsakaosV2

## Files Overview

### New Consolidated Files (V2)
- **`complete-schema.sql`** - Complete database schema with all tables, functions, triggers, policies, and sample data
- **`migration-v2.sql`** - Migration script to clean up existing database before applying new schema
- **`README.md`** - This documentation file

### Old Files (Deprecated - Can be deleted)
- `schema.sql` - Replaced by `complete-schema.sql`
- `policies.sql` - Policies now included in `complete-schema.sql`
- `triggers.sql` - Triggers now included in `complete-schema.sql`
- `storage.sql` - Storage setup now included in `complete-schema.sql`
- `storage-update.sql` - No longer needed
- `update-material-images.sql` - Sample data now included in `complete-schema.sql`

## Setup Instructions

### For New Database
If you're setting up a fresh database, simply run:
```sql
-- Run this single file in Supabase SQL Editor
\i complete-schema.sql
```

### For Existing Database (Migration)
If you have an existing database with the old schema:

1. **First, run the migration script:**
```sql
\i migration-v2.sql
```

2. **Then run the complete schema:**
```sql
\i complete-schema.sql
```

## Key Fixes Applied

### 1. User Creation Error Fix
- **Problem**: The trigger function was trying to insert an `email` field that doesn't exist in the `profiles` table
- **Solution**: Added the `email` column to the `profiles` table and updated the `handle_new_user()` function to properly insert the email from `auth.users`

### 2. Consolidated Storage Policies
- **Problem**: Multiple conflicting storage policies across different files
- **Solution**: Single set of storage policies that work together:
  - Public bucket for easy access
  - Authenticated users can upload
  - Users can delete their own files
  - Admins have full access

### 3. Streamlined Structure
- **Problem**: 6 separate SQL files with overlapping/conflicting definitions
- **Solution**: 2 main files - migration script and complete schema

### 4. Data Type Consistency
- **Problem**: `total_amount` field had inconsistent types (decimal vs integer)
- **Solution**: Standardized to `integer` type throughout

## Database Schema

### Tables
- **profiles** - User profiles with role-based access
- **orders** - Customer orders with status tracking
- **materials** - Available materials with pricing
- **notifications** - System notifications for users

### Key Features
- Row Level Security (RLS) enabled on all tables
- Automatic profile creation on user registration
- Automatic notifications on order status changes
- File storage for design uploads
- Role-based access control (admin/customer)

## Testing User Creation

After applying the new schema, test user creation:

1. Go to Supabase Auth → Users
2. Create a new user
3. Check if a profile is automatically created in the `profiles` table
4. Verify no errors in the logs

The "Failed to create user: Database error creating new user" error should now be resolved.