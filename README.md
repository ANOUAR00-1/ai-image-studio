# 🎨 PixFusion AI Studio

AI-powered SaaS platform for image and video generation using cutting-edge AI models.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

---

##  Features

- 🎨 **AI Image Generation** - DALL-E 3, Stable Diffusion, Flux
- 🎬 **AI Video Generation** - Runway, Pika, Luma AI
- ✂️ **Image Editing** - Remove backgrounds, enhance, upscale
- 💳 **Subscription Plans** - Free, Pro, Business with Stripe integration
- 🔐 **Secure Authentication** - HttpOnly cookies, XSS/CSRF protection
- 💰 **Credits System** - Pay-per-use pricing with admin unlimited credits
- 📊 **Real-time Dashboard** - Track generations and usage stats
- 🎯 **API Access** - RESTful API for Business plan users
- ✨ **Interactive UI** - SpotlightCard effects with mouse tracking
- 👑 **Admin Panel** - Monitor all generations and manage users
- 🎭 **Examples Gallery** - Browse AI-generated content
- 📱 **Responsive Design** - Mobile-first approach

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
git clone https://github.com/ANOUAR00-1/ai-image-studio.git
cd pixfusion-ai-studio
npm install
```

### 2. Set Up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema: `supabase/schema.sql`
3. Get your API keys from Settings → API

### 3. Configure Environment Variables
Create `.env.local` file:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
OPENAI_API_KEY=sk-your-openai-key

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key

# Security
ADMIN_API_KEY=your-secure-admin-key
JWT_SECRET=your-jwt-secret-min-32-chars
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Admin User
```sql
-- Run in Supabase SQL Editor
UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
```

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

### Core Docs (in `/docs`)
- **[API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - Complete API reference
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment guide
- **[ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md)** - Environment variables

### Guidelines
- **[Guidelines.md](./guidelines/Guidelines.md)** - Development guidelines

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

## 🔐 Security & Authentication

### Authentication
- **Supabase Auth** - Email/password with OTP verification
- **HttpOnly Cookies** - Tokens stored securely (not in localStorage)
- **XSS Protection** - Cookies inaccessible via JavaScript
- **CSRF Protection** - SameSite=lax cookies
- **Row Level Security** - Database-level access control

### Recent Security Improvements
✅ **Migrated from localStorage to httpOnly cookies** (Oct 2025)
- Tokens no longer visible in DevTools
- Automatic cleanup of legacy tokens
- Enhanced protection against XSS attacks

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
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy to Vercel
npm i -g vercel
vercel --prod
```

**Important**: Add all environment variables in Vercel dashboard

### Docker
```bash
docker build -t pixfusion-ai .
docker run -p 3000:3000 --env-file .env.production pixfusion-ai
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] HTTPS enabled (required for secure cookies)
- [ ] CORS configured
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 🔧 Troubleshooting

### Common Issues

**"No token provided" error**
- Ensure you're logged in
- Check cookies are enabled
- Clear browser cache and re-login

**Image generation fails**
- Verify OpenAI API key is valid
- Check you have credits in OpenAI account
- Ensure API key has proper permissions

**Database connection issues**
- Verify Supabase URL and keys
- Check RLS policies are set up
- Use service role key for server-side operations

**Build fails**
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/ANOUAR00-1/ai-image-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ANOUAR00-1/ai-image-studio/discussions)

---

**Built with ❤️ using Next.js, Supabase, and OpenAI**
