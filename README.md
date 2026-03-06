# GitHub Workspace Tracker

Real-time dashboard for monitoring repository health, contributor activity, and project velocity across multiple GitHub repositories.

**Built to solve:** Developers managing 5+ repositories waste 15+ minutes daily context-switching between GitHub's native Insights, Issues, PRs, and commit history. This centralizes critical metrics in a single view.

---

## Why This Exists

GitHub's native analytics are scattered across multiple tabs and don't support:
- Cross-repository comparison
- Historical trend analysis beyond 30 days
- Custom metrics and reporting
- Exportable reports for stakeholders

**This dashboard aggregates:**
- Commit velocity trends (daily/weekly/monthly)
- Contributor activity patterns
- Issue/PR lifecycle metrics
- Repository health indicators
- Exportable PDF reports

---

## Technical Highlights

### Production-Grade Architecture
- **Next.js 16 App Router** with server components for optimal performance
- **PostgreSQL + Prisma ORM** with optimized indexing for sub-100ms queries
- **NextAuth.js v5** OAuth flow with GitHub integration
- **Type-safe API routes** with Zod validation
- **44 passing tests** across components, integration, and hooks

### Performance Optimization
- In-memory caching with TTL for GitHub API responses
- Incremental data updates (not full repository scans)
- Rate limit handling with exponential backoff
- Server-side rendering for instant page loads

### Real-Time Data Sync
- GitHub webhook integration for live updates
- Manual refresh capability for on-demand sync
- Octokit API client with retry logic
- Background job processing for heavy operations

---

## Key Features

- **📊 Repository Dashboard** - Comprehensive stats, issues, commits, and PRs
- **⭐ Save Repositories** - Bookmark repos for quick access
- **📝 Issue Creation** - Create GitHub issues directly from dashboard
- **📄 PDF Reports** - Generate professional repository analysis reports
- **👤 User Dashboard** - Manage saved repositories at `/dashboard`
- **🔄 Real-time Sync** - Manual refresh + webhook support
- **🌙 Dark Mode** - Full dark/light theme support

---

## Tech Stack

**Frontend:** Next.js 16.1.6, React, TypeScript, Tailwind CSS v4  
**UI Components:** shadcn/ui, Radix UI, Recharts  
**Backend:** Next.js API Routes, Prisma ORM, PostgreSQL (Neon)  
**Auth:** NextAuth.js v5 (GitHub OAuth)  
**API:** Octokit (GitHub REST API v3)  
**Testing:** Jest, React Testing Library (44 tests, 6 suites)  
**PDF Generation:** jsPDF

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL (Neon recommended for serverless)

### Installation

1. **Clone and install**
```bash
   git clone https://github.com/kapsarovL/github-dashboard-tracker
   cd github-dashboard
   npm install
```

2. **Configure environment**
```bash
   cp .env.local.example .env.local
```

   Required environment variables:
```env
   DATABASE_URL=              # Neon PostgreSQL connection string
   AUTH_GITHUB_ID=            # GitHub OAuth Client ID
   AUTH_GITHUB_SECRET=        # GitHub OAuth Client Secret
   AUTH_SECRET=               # Generate: openssl rand -base64 32
   GITHUB_TOKEN=              # GitHub Personal Access Token
   GITHUB_WEBHOOK_SECRET=     # Webhook secret (optional)
```

3. **Initialize database**
```bash
   npm run db:push
   npm run db:generate
```

4. **Start development server**
```bash
   npm run dev
```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
github-dashboard/
├── app/
│   ├── api/              # API routes (auth, repos, webhooks)
│   ├── actions/          # Server actions for data mutations
│   ├── components/       # React components
│   ├── dashboard/        # Dashboard pages
│   ├── hooks/            # Custom React hooks
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── cache/            # In-memory cache with TTL
│   ├── db/               # Prisma client & services
│   ├── webhooks/         # GitHub webhook handlers
│   ├── github.ts         # Octokit API client
│   └── pdf.ts            # PDF report generation
├── prisma/
│   └── schema.prisma     # Database schema
└── types/                # TypeScript definitions
```

---

## 🔧 Configuration Details

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

### Database Setup (Neon)

1. Create account at [Neon](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL` in `.env.local`

### GitHub Webhooks (Optional - for real-time updates)

1. Repository **Settings** → **Webhooks** → **Add webhook**
2. Payload URL: `https://your-domain.com/api/webhooks/github`
3. Content type: `application/json`
4. Secret: Your `GITHUB_WEBHOOK_SECRET`
5. Events: `Pushes`, `Issues`, `Pull requests`

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:studio` | Open Prisma Studio |

---

## 🧪 Testing

**Test Coverage:** 44 tests passing across 6 suites

- Component tests (React Testing Library)
- Integration tests (API routes)
- Hook tests (custom React hooks)
- Database operations
- Authentication flows
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosted
```bash
npm run build
npm run start
```

Requires PostgreSQL and environment variables configured.

---

## 📝 Roadmap

- [ ] Team analytics (cross-repository insights)
- [ ] Slack/Discord webhook notifications
- [ ] Custom metric definitions
- [ ] Historical data retention (90+ days)
- [ ] CSV/Excel export functionality
- [ ] Multi-user workspace support

---

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss proposed changes.

---

## 📄 License

MIT License - see LICENSE file for details

---

**Status:** Active development | Production-ready | Open to contributions

**Built by:** [Lazar Kapsarov](https://github.com/kapsarovL)  
**Contact:** kapsarovlazar@gmail.com
