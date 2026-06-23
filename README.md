# Saif Ali Khan — Observability Dashboard Portfolio

A modern, dashboard-style portfolio website for **Saif Ali Khan**, Platform Product Specialist at Dynatrace. Built with React, TypeScript, and Vite for optimal performance, featuring observability-themed UI, animated metrics, interactive charts, and smooth motion design.

## Tech Stack

- **React 19** + **TypeScript** — type-safe, component-driven UI
- **Vite 7** — lightning-fast builds and HMR
- **Tailwind CSS 4** — utility-first styling with custom observability theme
- **Framer Motion** — professional animations and transitions
- **Recharts** — interactive dashboard charts (growth index, skill radar)
- **Lucide React** — crisp iconography

## Features

- Dashboard-style layout with live sidebar navigation
- Animated metric cards (experience, certifications, network)
- Career growth chart and skill proficiency radar
- Expandable experience timeline
- Filterable certification badges
- Animated network mesh background (observability aesthetic)
- Mobile-responsive with slide-out navigation
- Copy-to-clipboard contact details
- GitHub Actions CI/CD for free hosting

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages (Free)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Add observability dashboard portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Portfolio.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` deploys automatically on every push to the **`Deploy`** branch

### Step 3: Add GitHub Secrets (Supabase)

In your repo → **Settings** → **Secrets and variables** → **Actions**, add:

| Secret | Value |
|--------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key |

### Step 4: Deploy

```bash
git checkout -B Deploy
git push -u origin Deploy
```

### Live URL

After deployment, your site will be available at:

```
https://saifalikhan786-khan.github.io/portfolio/
```

Admin panel: `https://saifalikhan786-khan.github.io/portfolio/#/admin`

## Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, Header
│   ├── sections/     # Overview, Experience, Skills, etc.
│   └── ui/           # MetricCard, NetworkBackground
├── data/
│   └── profile.ts    # All portfolio content
├── hooks/
│   └── useActiveSection.ts
├── App.tsx
└── main.tsx
```

## Customization

Edit `src/data/profile.ts` to update content, or replace data from `linkedin-profile-saif-ali-khan.txt`.

## License

Personal portfolio — all rights reserved.
