# Luxe Jewels - Jewelry E-Commerce Website

A static jewelry catalog website built with Next.js 14 (App Router), hosted on Vercel, using GitHub as the database.

## Architecture

- **Framework**: Next.js 14 with App Router
- **Hosting**: Vercel
- **Database**: GitHub repo (JSON file + image folder)
- **API**: GitHub REST API via Octokit.js
- **Auth**: Single admin, password protected
- **Styling**: Tailwind CSS

## How It Works

1. All product data is stored in `/data/products.json` in the GitHub repo
2. Admin logs in via `/admin/login` with a password stored in env vars
3. Admin actions (add/edit/delete) update the JSON file via GitHub API commits
4. Vercel auto-redeploys on every push
5. Public pages use ISR (revalidate every 60 seconds)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd <repo-name>
npm install
```

### 2. Create GitHub Fine-Grained PAT

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. Click "Generate new token"
3. Set token name (e.g., "jewelry-store-admin")
4. Set expiration (recommended: 90 days)
5. Under "Repository access", select "Only select repositories" and choose your repo
6. Under "Permissions" → "Repository permissions":
   - **Contents**: Read and write (to update products.json and images)
   - **Metadata**: Read-only (default)
7. Generate and copy the token

### 3. Environment Variables

Create a `.env.local` file:

```env
ADMIN_PASSWORD=your-secure-password-here
GITHUB_TOKEN=github_pat_xxxxxxxxxxxxx
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repo-name
GITHUB_BRANCH=main
```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repo
4. Add the same environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`
5. Deploy!

### 5. Initial Setup

1. Visit `https://your-domain.vercel.app/admin/login`
2. Login with your admin password
3. Add your first products through the dashboard

## Project Structure

```
/app
  /page.tsx                    # Homepage with hero + featured products
  /shop/page.tsx               # All products with filters
  /product/[id]/page.tsx       # Product detail page
  /sales/page.tsx              # Sales tracker table
  /admin/page.tsx              # Admin dashboard
  /admin/login/page.tsx        # Admin login
  /api/admin/products/route.ts # Products CRUD API
  /api/admin/upload/route.ts   # Image upload API
  /api/auth/route.ts           # Authentication API
/lib
  /github.ts                   # GitHub API functions (Octokit)
/types
  /product.ts                  # Product TypeScript types
/data
  /products.json               # Product data (stored in repo)
/public
  /images/                     # Product images (stored in repo)
```

## Features

### Customer Pages
- **Homepage**: Hero section, featured products, on-sale items
- **Shop**: All products with category filter and price sort
- **Product Detail**: Full product info with discount calculations
- **Sales Tracker**: Price comparison table

### Admin Dashboard
- View all products in a table
- Add/edit/delete products
- Image upload (stored in GitHub repo)
- Optimistic UI updates
- Toast notifications

### Design
- Mobile responsive
- Gold/amber color scheme for luxury feel
- Product cards with hover effects
- Discount badges
- Loading skeletons

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Octokit.js | GitHub REST API client |
| react-hot-toast | Toast notifications |
| Vercel | Hosting + CI/CD |

## License

MIT
