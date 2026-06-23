# GitHub Pages Deployment Guide

## Live URL (after deploy completes)

- **Portfolio:** https://saifalikhan786-khan.github.io/portfolio/
- **Admin:** https://saifalikhan786-khan.github.io/portfolio/#/admin

---

## One-time setup: GitHub Secrets

The deploy workflow needs Supabase credentials at build time.

1. Open https://github.com/saifalikhan786-khan/portfolio/settings/secrets/actions
2. Click **New repository secret** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://cgaiiymacuhvjxfnekji.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(your Supabase anon public key from `.env`)* |

---

## Enable GitHub Pages (one-time)

1. Open https://github.com/saifalikhan786-khan/portfolio/settings/pages
2. Under **Build and deployment** → **Source**, select **GitHub Actions**

---

## Deploy branch workflow

Pushes to the **`Deploy`** branch trigger automatic build & deploy.

```bash
# Make changes on master, then deploy:
git checkout Deploy
git merge master
git push origin Deploy
```

Or push directly to Deploy:

```bash
git push origin Deploy
```

Monitor deployment: https://github.com/saifalikhan786-khan/portfolio/actions

---

## Local production preview

```bash
set GITHUB_PAGES=true
set VITE_SUPABASE_URL=https://cgaiiymacuhvjxfnekji.supabase.co
set VITE_SUPABASE_ANON_KEY=your_key_here
npm run build
npm run preview
```

Open the preview URL — assets will use the `/portfolio/` base path.
