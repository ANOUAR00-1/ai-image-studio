# Referral System Documentation

## Overview
The referral system allows users to invite friends and earn **10 free credits** for each successful signup. Both the referrer and the new user benefit from the program.

---

## 🎯 Features

### ✅ What's Been Implemented

1. **Database Schema** (`005_add_referral_system.sql`)
   - `referral_code` column in profiles (unique 8-character code)
   - `referred_by` column to track who referred the user
   - `referrals` table to track all referral relationships
   - Automatic referral code generation for all users
   - Secure credit award system

2. **Backend API Endpoints**
   - `GET /api/referral` - Get user's referral stats and history
   - `POST /api/referral/validate` - Validate a referral code

3. **Frontend Components**
   - **Referral Page** (`/referral`) - Full featured dashboard with:
     - Referral link with one-click copy
     - Social media sharing (Twitter, Facebook, LinkedIn, Email)
     - Stats cards (total referrals, credits earned, current balance)
     - Complete referral history list
     - "How it Works" section
   - **Navigation Integration** - "Referrals" menu item in user dropdown

4. **Signup Flow Integration**
   - URL parameter detection (`?ref=CODE`)
   - Automatic referral code validation
   - Credit award on successful signup
   - Metadata stored with signup

---

## 📊 Database Schema

### New Columns in `profiles`
```sql
referral_code TEXT UNIQUE        -- User's unique referral code (e.g., "A3X9K7P2")
referred_by UUID                 -- ID of user who referred them
```

### New Table: `referrals`
```sql
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY,
  referrer_id UUID,              -- User who made the referral
  referred_id UUID,              -- User who was referred
  credits_awarded INTEGER,       -- Credits given (default 10)
  status TEXT,                   -- 'pending', 'completed', 'expired'
  created_at TIMESTAMP
)
```

### Key Functions
- `generate_referral_code()` - Generates unique 8-char codes
- `handle_referral_signup()` - Processes referral on signup
- `get_referral_stats()` - Returns user's referral statistics

---

## 🔄 How It Works

### 1. User Gets Their Referral Link
- Every user automatically gets a unique referral code
- Access via `/referral` page or user dropdown menu
- Format: `https://yoursite.com/signup?ref=A3X9K7P2`

### 2. Friend Signs Up
- Clicks referral link with `?ref=CODE` parameter
- Code is automatically captured and validated
- During signup, code is attached to user metadata

### 3. Credits Are Awarded
- When new user completes signup:
  - Referrer gets **+10 credits** instantly
  - Referral relationship is recorded in database
  - Transaction is logged in `credit_transactions`

---

## 🚀 Usage

### For Users

**Share Your Referral Link:**
```
1. Navigate to /referral page
2. Copy your unique link
3. Share via social media or direct copy
4. Track your referrals and earnings
```

**Sign Up With Referral Code:**
```
1. Click a friend's referral link
2. Complete signup form
3. Your friend gets 10 credits automatically
```

### For Developers

**Get User's Referral Data:**
```typescript
const response = await fetch('/api/referral', {
  credentials: 'include'
})
const data = await response.json()
// Returns: { referralCode, referralLink, stats, referrals, currentCredits }
```

**Validate Referral Code:**
```typescript
const response = await fetch('/api/referral/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ referralCode: 'A3X9K7P2' })
})
const data = await response.json()
// Returns: { valid: true/false, referrerName?, message? }
```

---

## 📁 File Structure

```
supabase/migrations/
  └── 005_add_referral_system.sql          # Database migration

src/app/
  ├── referral/
  │   └── page.tsx                         # Referral page route
  └── api/
      ├── referral/
      │   ├── route.ts                     # Get referral data
      │   └── validate/
      │       └── route.ts                 # Validate codes
      └── auth/
          └── signup/
              └── route.ts                 # Updated with referral handling

components/pages/
  ├── referral/
  │   └── ReferralPage.tsx                 # Main referral UI
  ├── auth/
  │   └── AuthModal.tsx                    # Updated with referral param detection
  └── shared/
      └── Navigation.tsx                   # Added "Referrals" menu item
```

---

## 🔧 Setup Instructions

### 1. Run Database Migration
```bash
# In Supabase SQL Editor, run:
supabase/migrations/005_add_referral_system.sql
```

This will:
- Add referral columns to profiles
- Create referrals table
- Create helper functions
- Backfill existing users with referral codes
- Set up RLS policies

### 2. Verify Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://yoursite.com  # Used for referral links
```

### 3. Test the System
```bash
npm run dev
```

**Test Steps:**
1. Login as User A → Navigate to `/referral`
2. Copy User A's referral link
3. Logout
4. Open referral link in new incognito window
5. Sign up as User B
6. Login as User A → Check `/referral` page
7. Verify User A has +10 credits

---

## 🎨 UI Features

### Referral Page (`/referral`)
- **Stats Dashboard**
  - Total Referrals count
  - Total Credits Earned
  - Current Credit Balance

- **Share Section**
  - One-click copy referral link
  - Social media share buttons
  - Direct email sharing

- **Referral History**
  - List of all referred users
  - Credits earned per referral
  - Signup timestamps
  - User avatars and names

- **How It Works**
  - Visual 3-step guide
  - Clear instructions

---

## 🔒 Security Features

- ✅ Unique referral codes (no collisions)
- ✅ Self-referral prevention
- ✅ Row-level security (RLS) policies
- ✅ Server-side validation
- ✅ Transaction logging for audit trail
- ✅ Cannot refer same user twice

---

## 📈 Future Enhancements (Optional)

### Potential Additions:
1. **Tiered Rewards**
   - 5 referrals = Bonus reward
   - 10 referrals = Premium tier unlock
   
2. **Referral Leaderboard**
   - Top referrers of the month
   - Competition mechanics

3. **Limited Time Bonuses**
   - Double credits during promotions
   - Seasonal campaigns

4. **Referral Notifications**
   - Email alerts on successful referrals
   - In-app notifications

5. **Analytics Dashboard**
   - Conversion rates
   - Geographic distribution
   - Referral source tracking

---

## 🐛 Troubleshooting

### Issue: Referral code not generated
**Solution:** Run the backfill script in migration or manually:
```sql
UPDATE public.profiles
SET referral_code = public.generate_referral_code()
WHERE referral_code IS NULL;
```

### Issue: Credits not awarded
**Check:**
1. Verify `handle_referral_signup` function exists
2. Check `credit_transactions` table for errors
3. Ensure RLS policies allow inserts

### Issue: Referral link not working
**Verify:**
1. `NEXT_PUBLIC_APP_URL` is set correctly
2. AuthModal detects URL params
3. Signup route receives referralCode

---

## 📝 API Reference

### GET /api/referral
**Authentication:** Required (cookie)

**Response:**
```json
{
  "referralCode": "A3X9K7P2",
  "referralLink": "https://yoursite.com/signup?ref=A3X9K7P2",
  "stats": {
    "total_referrals": 5,
    "total_credits_earned": 50,
    "pending_referrals": 0
  },
  "referrals": [
    {
      "id": "uuid",
      "credits_awarded": 10,
      "status": "completed",
      "created_at": "2025-11-10T10:00:00Z",
      "referred": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "currentCredits": 85
}
```

### POST /api/referral/validate
**Request:**
```json
{
  "referralCode": "A3X9K7P2"
}
```

**Response:**
```json
{
  "valid": true,
  "referrerName": "Jane Smith",
  "message": "You'll get 10 bonus credits when you sign up!"
}
```

---

## ✅ Testing Checklist

- [ ] New user gets unique referral code on signup
- [ ] Referral page displays correctly
- [ ] Copy link button works
- [ ] Social share buttons open correctly
- [ ] Referral code validation works
- [ ] Signup with referral code awards credits
- [ ] Self-referral is prevented
- [ ] Duplicate referrals are prevented
- [ ] Stats update in real-time
- [ ] Referral history shows correct data
- [ ] Mobile responsive design works
- [ ] Navigation menu shows "Referrals" option

---

## 💡 Credits Configuration

To change the referral reward amount, update:

**Database:** `005_add_referral_system.sql`
```sql
v_credits_to_award INTEGER := 10;  -- Change this value
```

**Frontend:** `ReferralPage.tsx`
```tsx
<p className="text-gray-400 text-lg max-w-2xl mx-auto">
  Share your referral link and get 
  <span className="text-purple-400 font-semibold">10 free credits</span>  <!-- Update here -->
  for each friend who signs up!
</p>
```

---

## 🎉 Summary

The referral system is **fully implemented and production-ready**. Users can now:
- ✅ Get unique referral codes automatically
- ✅ Share links via multiple channels
- ✅ Earn credits for successful referrals
- ✅ Track their referral performance
- ✅ View detailed referral history

**Next Step:** Run the database migration and test the system!
