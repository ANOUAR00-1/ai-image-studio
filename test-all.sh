#!/bin/bash

# PixFusion AI Studio - Complete Testing Script
# Run this before deployment to ensure zero problems!

echo "🧪 Starting Complete Test Suite..."
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Test 1: Lint Check
echo "📝 Test 1: Running ESLint..."
if npm run lint; then
    echo -e "${GREEN}✅ Lint check passed!${NC}"
else
    echo -e "${RED}❌ Lint check failed!${NC}"
    ((ERRORS++))
fi
echo ""

# Test 2: TypeScript Check
echo "🔍 Test 2: Running TypeScript check..."
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ TypeScript check passed!${NC}"
else
    echo -e "${RED}❌ TypeScript errors found!${NC}"
    ((ERRORS++))
fi
echo ""

# Test 3: Build Test
echo "🏗️  Test 3: Running production build..."
if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    ((ERRORS++))
fi
echo ""

# Test 4: Check Environment Variables
echo "🔐 Test 4: Checking environment variables..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
    
    # Check critical variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}  ✓ SUPABASE_URL configured${NC}"
    else
        echo -e "${RED}  ✗ SUPABASE_URL missing${NC}"
        ((ERRORS++))
    fi
    
    if grep -q "HUGGINGFACE_API_KEY" .env.local; then
        echo -e "${GREEN}  ✓ HUGGINGFACE_API_KEY configured${NC}"
    else
        echo -e "${YELLOW}  ⚠ HUGGINGFACE_API_KEY missing${NC}"
    fi
    
    if grep -q "REPLICATE_API_TOKEN" .env.local; then
        echo -e "${GREEN}  ✓ REPLICATE_API_TOKEN configured${NC}"
    else
        echo -e "${YELLOW}  ⚠ REPLICATE_API_TOKEN missing${NC}"
    fi
else
    echo -e "${RED}❌ .env.local not found!${NC}"
    ((ERRORS++))
fi
echo ""

# Test 5: Check Critical Files
echo "📁 Test 5: Checking critical files..."
CRITICAL_FILES=(
    "utils/api.ts"
    "backend/services/ai.service.ts"
    "backend/services/auth.service.ts"
    "backend/services/credits.service.ts"
    "backend/services/generation.service.ts"
    "backend/services/admin.service.ts"
    "backend/services/stripe.service.ts"
    "supabase/migrations/001_complete_schema.sql"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}  ✓ $file${NC}"
    else
        echo -e "${RED}  ✗ $file missing${NC}"
        ((ERRORS++))
    fi
done
echo ""

# Summary
echo "=================================="
echo "📊 Test Summary"
echo "=================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo ""
    echo "Your SaaS is ready for deployment! 🚀"
    echo ""
    echo "Next steps:"
    echo "1. Start dev server: npm run dev"
    echo "2. Test manually: http://localhost:3001"
    echo "3. Run SQL migration in Supabase"
    echo "4. Deploy to Vercel: vercel --prod"
else
    echo -e "${RED}❌ $ERRORS TEST(S) FAILED${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
