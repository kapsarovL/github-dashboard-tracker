# GitHub Workspace Tracker

A comprehensive dashboard for monitoring and analyzing GitHub repository activities with real-time tracking, analytics, and reporting.

## 🚀 Quick Start

### Prerequisites

- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **Database:** PostgreSQL (Neon recommended for serverless)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd github-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local — never commit this file
   ```

   Edit `.env.local` with your credentials:
   - `DATABASE_URL` - Neon PostgreSQL connection string
   - `AUTH_GITHUB_ID` - GitHub OAuth Client ID
   - `AUTH_GITHUB_SECRET` - GitHub OAuth Client Secret  
   - `AUTH_SECRET` - Random secret (generate with `openssl rand -base64 32`)
   - `GITHUB_TOKEN` - GitHub Personal Access Token
   - `GITHUB_WEBHOOK_SECRET` - Webhook secret for GitHub integration

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Configuration

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set **Authorization callback URL** to: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret** to `.env.local`

### Database Setup (Neon)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from **Connection Details**
4. Paste it as `DATABASE_URL` in `.env.local`

### GitHub Webhooks (Optional)

1. Go to your GitHub repository **Settings** → **Webhooks**
2. Click **Add webhook**
3. Set **Payload URL** to: `https://your-domain.com/api/webhooks/github`
4. Set **Content type** to: `application/json`
5. Set **Secret** to your `GITHUB_WEBHOOK_SECRET`
6. Select events: `Pushes`, `Issues`, `Pull requests`

---

## 📁 Project Structure

```
github-dashboard/
├── app/
│   ├── api/              # API routes (auth, repos, webhooks)
│   ├── actions/          # Server actions
│   ├── components/       # React components
│   ├── dashboard/        # Dashboard page
│   ├── hooks/            # Custom React hooks
│   ├── providers/        # Context providers
│   └── ui/               # Design system & UI primitives
├── components/           # Shared page-level components
├── lib/
│   ├── cache/            # In-memory cache with TTL
│   ├── db/               # Prisma client & DB services
│   ├── webhooks/         # Webhook handler
│   ├── github.ts         # GitHub API (Octokit)
│   └── pdf.ts            # PDF generation
├── prisma/
│   └── schema.prisma     # Database schema
└── types/                # TypeScript type definitions
```

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:migrate:deploy` | Apply migrations in production |
| `npm run db:studio` | Open Prisma Studio |

---

## 🧪 Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |

**44 tests passing across 6 suites** — components, integration, and hooks.

---

## ✨ Features

- **Repository Dashboard** - View stats, issues, commits, and pull requests
- **Save Repositories** - Bookmark favorite repos for quick access
- **Create Issues** - Create GitHub issues directly from the dashboard
- **PDF Reports** - Generate professional repository reports
- **User Dashboard** - Manage saved repositories at `/dashboard`
- **Real-time Sync** - Manual refresh button to update data
- **Dark Mode** - Full dark mode support

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js v5 (GitHub OAuth)
- **UI:** Tailwind CSS v4, shadcn/ui, Radix UI
- **Charts:** Recharts
- **PDF:** jsPDF
- **GitHub API:** Octokit

---

## 📄 License

MIT
