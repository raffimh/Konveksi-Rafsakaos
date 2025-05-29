# Setup Guide.

## Prerequisites

1. Node.js 18+ and npm
2. Supabase account
3. Git

## Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd project-konveksi-r
```

2. Install dependencies:
```bash
npm install
```

3. Copy .env.example to .env.local:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Supabase Setup

1. Create a new Supabase project

2. Get your project credentials from Project Settings > API:
   - Project URL
   - Project API Keys (anon/public)

3. Enable required auth providers:
   - Email/Password
   - (Optional) OAuth providers

4. Set up database schema:
   - Copy SQL from DATABASE_SCHEMA.md
   - Run in Supabase SQL Editor
   - Or use the migration files in `supabase/migrations`

5. Configure storage:
   - Create a new bucket named `designs`
   - Set bucket privacy to `private`
   - Update storage policies:
```sql
-- Allow authenticated users to upload designs
CREATE POLICY "Users can upload designs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'designs' AND
    auth.role() = 'authenticated'
  );

-- Allow users to view their own designs
CREATE POLICY "Users can view their designs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'designs' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );
```

## Development

1. Start the development server:
```bash
npm run dev
```

2. Access the application:
   - Frontend: http://localhost:3000
   - API routes: http://localhost:3000/api/*

## Test Users

Create these test accounts for development:

1. Admin user:
```sql
-- Create admin profile
INSERT INTO auth.users (email, email_confirmed_at)
VALUES ('admin@example.com', now());

INSERT INTO public.profiles (id, email, display_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  'admin@example.com',
  'Admin User',
  'admin'
);
```

2. Customer user:
```sql
-- Create customer profile
INSERT INTO auth.users (email, email_confirmed_at)
VALUES ('customer@example.com', now());

INSERT INTO public.profiles (id, email, display_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'customer@example.com'),
  'customer@example.com',
  'Test Customer',
  'customer'
);
```

Set passwords via Supabase Authentication > Users.

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors

# Production
npm run build       # Build for production
npm start          # Start production server
```

## Project Structure

```
project-konveksi-r/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── (dashboard)/    # Protected dashboard routes
│   │   ├── auth/           # Authentication pages
│   │   └── ...
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components
│   │   └── ...
│   └── lib/               # Utilities and configs
│       ├── supabase/      # Supabase client
│       └── ...
├── public/                # Static assets
└── supabase/             # Supabase configurations
```

## Common Issues

1. **Authentication Error**
   - Check if Supabase credentials are correct
   - Verify email confirmation settings

2. **Design Upload Issues**
   - Verify storage bucket configuration
   - Check file size limits (max 5MB)
   - Supported formats: JPEG, PNG, WebP

3. **TypeScript Errors**
   - Run `npm run generate-types` to update Supabase types
   - Check for missing type definitions

## Production Deployment

1. Set up production environment:
   - Configure production Supabase project
   - Set environment variables
   - Update allowed domains in Supabase

2. Deploy:
```bash
npm run build
npm start
```

## Security Notes

1. Keep sensitive data out of version control:
   - `.env*` files
   - Supabase credentials
   - Production configurations

2. API Security:
   - All endpoints use RLS policies
   - Validate user roles
   - Rate limit API calls

3. File Upload Security:
   - Validate file types
   - Limit file sizes
   - Use unique filenames