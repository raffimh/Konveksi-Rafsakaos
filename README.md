# Konveksi Rafsakaos Management System

A modern web application for managing clothing production orders built with Next.js 15 and Supabase.

## Features

### Customer Features

- 📱 Browse available materials with images
- 🧮 Calculate order prices with quantity selection
- 📝 Create and track orders
- 🔔 Real-time order status notifications
- 👤 User profile management

### Admin Features

- 📊 Dashboard with order statistics
- 📦 Order management with status updates
- 👥 Customer management
- 🧵 Material catalog management
- 📨 Automated notifications system

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, TailwindCSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Real-time)
- **State Management:** React Hooks
- **Form Handling:** React Hook Form, Zod
- **Styling:** TailwindCSS, CSS Modules
- **Mobile:** Flutter implementation available

## Getting Started

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn
- Supabase account and project

### Environment Setup

1. Clone the repository

```bash
git clone https://github.com/raffimh/Konveksi-Rafsakaos.git
cd Konveksi-Rafsakaos
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Create `.env.local` with your Supabase credentials

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Initialize Supabase database

```bash
# Run Supabase migration files
supabase db reset
```

5. Run the development server

```bash
npm run dev
# or
pnpm dev
```

### Supabase Setup

1. Create tables using SQL from `supabase/schema.sql`
2. Apply RLS policies from `supabase/policies.sql`
3. Set up triggers from `supabase/triggers.sql`
4. Set up storage from `supabase/storage.sql and storage-update.sql`
5. Configure storage buckets for design files

## Documentation

- [API Reference](API_REFERENCE.md) - API endpoints and types
- [Database Schema](DATABASE_SCHEMA.md) - Database structure
- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions

## Key Features Implementation

### Real-time Notifications

- Order status changes trigger notifications
- Websocket connections for instant updates
- Toast notifications for important events

### Image Handling

- Material images stored in Supabase storage
- Next.js Image optimization
- Support for multiple image formats

### Authentication

- Email/password authentication
- Protected routes
- Role-based access control

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
