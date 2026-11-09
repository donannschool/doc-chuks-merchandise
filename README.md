# DOC Chuks Merchandise Ltd — Website & Admin Portal

A fully responsive storefront (React + Vite + Tailwind) backed by Supabase, plus a
protected admin portal at `/admin` for managing inventory and site content.

## 1. Set up Supabase

1. Create a project at https://supabase.com (or use an existing one).
2. Open **SQL Editor** in the Supabase dashboard.
3. Paste the entire contents of `supabase_setup.sql` and run it. This creates:
   - the `products` table
   - the `site_settings` table (pre-filled with your business defaults)
   - the public `product-images` storage bucket
   - all Row Level Security policies (public read, authenticated write)
4. Go to **Authentication → Users → Add User** and create your admin login
   (email + password). This is what you'll use to sign in at `/admin`.

## 2. Configure the frontend

```bash
cp .env.example .env
```

Fill in `.env` with your project's values (found in **Project Settings → API**):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` for the public site, and
`http://localhost:5173/admin` to log in with the admin user you created.

## 4. Build for production

```bash
npm run build
```

This outputs a static `dist/` folder you can deploy to Vercel, Netlify,
Cloudflare Pages, or any static host. Remember to set the two `VITE_` env
vars in your hosting provider's dashboard as well.

## Project structure

```
src/
  pages/           Public pages (Home, Catalog, Request a Seal, About, Contact)
  components/      Shared UI (layout, product card, filter pills)
  admin/           Admin portal (login, dashboard, inventory tab, site info tab)
  lib/             Supabase client, constants, site settings hook
supabase_setup.sql One-time database, storage & RLS setup script
```

## Notes

- All business details (About text, phone numbers, address, hours, map,
  social links) are pulled live from the `site_settings` table — edit them
  anytime from **Admin → Edit Website Info & Contacts** without touching code.
- Social icons in the footer only appear when their URL is non-empty.
- The WhatsApp buttons use `wa.me` deep links pre-filled with product or
  enquiry details, so customers land straight in a chat with context.
- Image uploads in the admin Inventory tab go directly to the
  `product-images` storage bucket and are made public automatically.
