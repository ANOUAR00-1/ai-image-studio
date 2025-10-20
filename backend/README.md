# Backend Folder Structure

This folder contains all backend services, utilities, and types for the PixFusion AI Studio.

## 📁 Folder Structure

```
backend/
├── services/           # Business logic services
│   ├── auth.service.ts         # Authentication operations
│   ├── credits.service.ts      # Credit management
│   ├── generation.service.ts   # AI generation tracking
│   └── subscription.service.ts # Subscription management
│
├── utils/             # Utility functions
│   ├── middleware.ts   # Auth middleware & request validation
│   └── response.ts     # Standardized API responses
│
├── config/            # Configuration
│   └── constants.ts    # App constants, plans, credit costs
│
├── types/             # TypeScript types
│   └── index.ts        # Shared types and interfaces
│
└── README.md          # This file
```

---

## 🎯 Services

### **AuthService** (`services/auth.service.ts`)
Handles all authentication operations:
- Sign up new users
- Sign in with email/password
- Sign out
- Get user by token
- Get/update user profile
- Change password

### **CreditsService** (`services/credits.service.ts`)
Manages user credits:
- Get user credits
- Deduct credits (with atomic operations)
- Add credits
- Get credit transaction history
- Check if user has enough credits

### **GenerationService** (`services/generation.service.ts`)
Tracks AI generations:
- Create generation record
- Update generation status
- Get user generations (with pagination)
- Delete generations
- Get user stats (total, images, videos, etc.)

### **SubscriptionService** (`services/subscription.service.ts`)
Manages subscriptions:
- Get user subscription
- Create subscription
- Update subscription
- Cancel subscription
- Update user plan

---

## 🛠️ Utils

### **Middleware** (`utils/middleware.ts`)
- `verifyAuth()` - Verify JWT token
- `withAuth()` - Wrapper for protected routes
- `errorHandler()` - Error handling wrapper
- `validateBody()` - Request body validation

### **Response** (`utils/response.ts`)
Standardized API responses:
- `ApiResponse.success()` - Success response
- `ApiResponse.error()` - Error response
- `ApiResponse.unauthorized()` - 401 response
- `ApiResponse.notFound()` - 404 response
- `ApiResponse.insufficientCredits()` - 402 response

---

## 🔧 Usage Examples

### Using Services in API Routes

```typescript
import { GenerationService } from '@/backend/services/generation.service'
import { CreditsService } from '@/backend/services/credits.service'
import { withAuth } from '@/backend/utils/middleware'
import { ApiResponse } from '@/backend/utils/response'

export const POST = withAuth(async (request, { userId }) => {
  try {
    const { prompt, tool } = await request.json()
    
    // Check credits
    const hasCredits = await CreditsService.hasEnoughCredits(userId, 5)
    if (!hasCredits) {
      return ApiResponse.insufficientCredits(5, await CreditsService.getUserCredits(userId))
    }
    
    // Deduct credits
    const success = await CreditsService.deductCredits(userId, 5, 'Image generation')
    if (!success) {
      return ApiResponse.error('Failed to deduct credits')
    }
    
    // Create generation record
    const generation = await GenerationService.createGeneration(
      userId,
      'image',
      prompt,
      tool,
      5
    )
    
    return ApiResponse.success(generation)
  } catch (error) {
    return ApiResponse.serverError()
  }
})
```

### Using Middleware

```typescript
import { withAuth } from '@/backend/utils/middleware'
import { validateBody } from '@/backend/utils/middleware'

export const POST = withAuth(async (request, { userId }) => {
  const body = await request.json()
  
  const validation = validateBody(body, ['prompt', 'tool'])
  if (!validation.valid) {
    return ApiResponse.validationError(validation.error!)
  }
  
  // Your logic here
})
```

---

## 📊 Constants

All app constants are defined in `config/constants.ts`:

### Credit Costs
```typescript
CREDIT_COSTS.IMAGE_GENERATION['dall-e-3'] // 5 credits
CREDIT_COSTS.VIDEO_GENERATION['runway']   // 10 credits
CREDIT_COSTS.IMAGE_EDITING['upscale']     // 2 credits
```

### Plans
```typescript
PLANS.free.credits    // 10
PLANS.pro.credits     // 200
PLANS.business.credits // 1000
```

---

## 🔐 Security

- All services use `supabaseAdmin` for database operations (bypasses RLS when needed)
- Authentication middleware validates JWT tokens
- Row Level Security (RLS) still applies for user-facing queries
- Credit deduction uses atomic database functions
- All API responses use standardized format

---

## 🚀 Next Steps

1. **Add AI Integration**
   - Create `services/openai.service.ts`
   - Create `services/stability.service.ts`
   
2. **Add Stripe Integration**
   - Create `services/stripe.service.ts`
   - Add webhook handlers

3. **Add File Upload**
   - Create `services/storage.service.ts`
   - Configure Cloudinary/S3

---

## 📝 Notes

- All services are static classes for easy importing
- Use TypeScript types from `backend/types/index.ts`
- Error handling should use ApiResponse methods
- Always use withAuth() for protected routes
- Credit operations are atomic (no race conditions)
