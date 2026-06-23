# Supabase Setup — Quick Message Form

The portfolio **Quick Message** form saves submissions to your Supabase database.

## Credentials I Need From You

Provide these **2 values** from your Supabase project:

| Variable | Where to find it | Example |
|----------|------------------|---------|
| `VITE_SUPABASE_URL` | Dashboard → **Settings** → **API** → **Project URL** | `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Dashboard → **Settings** → **API** → **anon public** key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

> **Important:** Use only the **anon (public)** key — never share your `service_role` key. The anon key is safe for the browser when Row Level Security (RLS) is enabled.

---

## Step 1: Create a Supabase Project (if you don't have one)

1. Go to [https://supabase.com](https://supabase.com) and sign up / log in
2. Click **New Project**
3. Choose a name, database password, and region (e.g. `South Asia (Mumbai)`)
4. Wait for the project to finish provisioning

---

## Step 2: Create the Database Tables

1. Open your project in Supabase Dashboard
2. Go to **SQL Editor** → **New query**
3. Run [`supabase/setup.sql`](./supabase/setup.sql) — Quick Message table
4. Run [`supabase/admin.sql`](./supabase/admin.sql) — Admin users, auth, and dashboard RPCs
5. Run [`supabase/logs.sql`](./supabase/logs.sql) — Visitor tracking & admin action audit logs

> **Login error `function crypt(text, text) does not exist`?**  
> Run [`supabase/admin-fix-pgcrypto.sql`](./supabase/admin-fix-pgcrypto.sql) in the SQL Editor. Supabase stores `pgcrypto` in the `extensions` schema.

### Default Super Admin (created by admin.sql)

| Field | Value |
|-------|-------|
| Email | `superadmin@gmail.com` |
| Username | `super-admin` |
| Password | `Hm20342878919` |
| Role | `super-admin` |

**Admin URL:** `http://localhost:5173/#/admin` (or `/#/admin` on GitHub Pages)

### Role permissions

| Role | View messages | Delete messages | Manage admin users |
|------|---------------|-----------------|-------------------|
| `admin` | ✅ | ❌ | ❌ |
| `super-admin` | ✅ | ✅ | ✅ Create / Edit / Delete |

---

## Step 3: Configure Local Development

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your credentials:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

4. Test the Quick Message form on the Contact section

---

## Step 4: Configure GitHub Pages (Production)

Because the site is static on GitHub Pages, add your credentials as **GitHub Secrets**:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

   | Secret name | Value |
   |-------------|-------|
   | `VITE_SUPABASE_URL` | Your Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your anon public key |

3. Push to `main` — the deploy workflow injects these at build time

---

## Step 5: View Submitted Messages

In Supabase Dashboard:

1. Go to **Table Editor**
2. Select the `contact_messages` table
3. You'll see all form submissions with name, email, message, and timestamp

---

## What to Send Me

Once you have your Supabase project ready, share:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

I can create your `.env` file and verify the connection works.

**Do NOT share:**
- Database password
- `service_role` secret key

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Message service is not configured" | Add `.env` with both variables and restart `npm run dev` |
| `new row violates row-level security policy` | Re-run `supabase/setup.sql` to create the INSERT policy |
| `relation "contact_messages" does not exist` | Run the SQL setup script in Supabase SQL Editor |
| Works locally but not on GitHub Pages | Add both secrets to GitHub Actions secrets |
