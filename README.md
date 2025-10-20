# 🎨 PixFusion AI Studio

AI-powered SaaS platform for image and video generation using cutting-edge AI models.

---

## ✨ Features

- 🎨 **AI Image Generation** - DALL-E 3, Stable Diffusion
- 🎬 **AI Video Generation** - Runway, Pika
- ✂️ **Image Editing** - Remove backgrounds, enhance, upscale
- 💳 **Subscription Plans** - Free, Pro, Business
- 🔐 **Authentication** - Secure login with Supabase Auth
- 💰 **Credits System** - Pay-per-use pricing model
- 📊 **Dashboard** - Track generations and usage
- 🎯 **API Access** - Business plan includes API keys

---

## 🏗️ Tech Stack

### **Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Framer Motion
- Zustand (State Management)

### **Backend**
- Next.js API Routes
- Supabase (PostgreSQL + Auth)
- OpenAI API (Image Generation)
- Stripe (Payments)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd pixfusion-ai-studio
npm install
```

### 2. Set Up Supabase
Follow the complete guide: **[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)**

### 3. Configure Environment Variables
Create `.env.local` file (see **[ENV_SETUP.md](./ENV_SETUP.md)**):
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
pixfusion-ai-studio/
├── backend/                    # Backend services & logic
│   ├── services/              # Auth, Credits, Generations, Subscriptions
│   ├── utils/                 # Middleware, Responses
│   ├── config/                # Constants (plans, costs)
│   └── types/                 # TypeScript types
│
├── lib/                        # Core libraries
│   └── supabase/              # Supabase clients
│
├── src/app/                    # Next.js app
│   ├── api/                   # API routes
│   ├── dashboard/
│   ├── image-tools/
│   └── ...
│
├── components/                 # React components
│   ├── pages/                 # Page components
│   ├── providers/             # Context providers
│   └── ui/                    # UI components (shadcn)
│
├── store/                      # State management
│   └── auth.ts                # Auth store (Zustand)
│
└── supabase/                   # Database
    └── schema.sql             # PostgreSQL schema
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [BACKEND_STATUS.md](./BACKEND_STATUS.md) | Current backend implementation status |
| [BACKEND_READINESS_AUDIT.md](./BACKEND_READINESS_AUDIT.md) | Complete feature audit |
| [QUICK_START_BACKEND.md](./QUICK_START_BACKEND.md) | Backend setup guide |
| [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) | Step-by-step Supabase setup |
| [ENV_SETUP.md](./ENV_SETUP.md) | Environment variables guide |
| [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) | Recent cleanup changes |

---

## 🎯 Current Status

### ✅ Completed
- Frontend UI (100%)
- Authentication system
- Database schema
- Backend services layer
- State management
- Protected routes
- Credits system foundation
- Dashboard with stats

### 🚧 In Progress
- AI image generation integration
- Stripe payment integration
- Generation history
- API key management

---

## 🔐 Authentication

Uses Supabase Auth with:
- Email/password authentication
- JWT tokens
- Row Level Security (RLS)
- Session persistence
- Protected API routes

---

## 💰 Pricing Plans

| Plan | Price | Credits | Features |
|------|-------|---------|----------|
| **Free** | $0/mo | 10 | Basic features |
| **Pro** | $29/mo | 200 | All AI models, priority support |
| **Business** | $99/mo | 1000 | API access, team features |

---

## 🛠️ Development

### Run Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Manual
```bash
npm run build
npm start
```

---

## 📝 License

[Add your license here]

---

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

---

## 📧 Support

For support, email [your-email] or open an issue.

---

**Built with ❤️ using Next.js, Supabase, and OpenAI**
