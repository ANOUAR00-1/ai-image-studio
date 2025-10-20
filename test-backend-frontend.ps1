# Backend & Frontend Testing Script
# Tests all critical endpoints and functionality

Write-Host "🧪 Testing PixFusion AI Studio Backend & Frontend" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:3001"
$errors = 0

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [string]$ExpectedStatus = "200"
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method $Method -UseBasicParsing -ErrorAction Stop
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "  ✅ PASS - Status: $($response.StatusCode)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ❌ FAIL - Expected: $ExpectedStatus, Got: $($response.StatusCode)" -ForegroundColor Red
            $script:errors++
            return $false
        }
    } catch {
        Write-Host "  ❌ FAIL - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:errors++
        return $false
    }
    
    Write-Host ""
}

# Wait for server to be ready
Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🌐 FRONTEND TESTS" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Test frontend pages
Test-Endpoint "Homepage" "$baseUrl"
Test-Endpoint "Login Page" "$baseUrl/login"
Test-Endpoint "Signup Page" "$baseUrl/signup"
Test-Endpoint "Dashboard" "$baseUrl/dashboard"
Test-Endpoint "Image Tools" "$baseUrl/image-tools"
Test-Endpoint "Video Tools" "$baseUrl/video-tools"
Test-Endpoint "Gallery" "$baseUrl/gallery"
Test-Endpoint "Pricing" "$baseUrl/pricing"
Test-Endpoint "Admin Dashboard" "$baseUrl/admin"

Write-Host ""
Write-Host "🔧 BACKEND API TESTS" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Test API endpoints (these will return 401/400 without auth, which is correct)
Write-Host "Testing: API Routes Exist" -ForegroundColor Yellow
Write-Host "  Note: 401/400 responses are expected (auth required)" -ForegroundColor Gray
Write-Host ""

# Test auth endpoints
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/profile" -UseBasicParsing -ErrorAction SilentlyContinue
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "  ✅ /api/auth/profile - Endpoint exists (401 = needs auth)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ /api/auth/profile - Unexpected error" -ForegroundColor Red
        $errors++
    }
}

# Test generation endpoints
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/generate/image" -Method POST -UseBasicParsing -ErrorAction SilentlyContinue
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401 -or $_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "  ✅ /api/generate/image - Endpoint exists" -ForegroundColor Green
    } else {
        Write-Host "  ❌ /api/generate/image - Unexpected error" -ForegroundColor Red
        $errors++
    }
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/generate/video" -Method POST -UseBasicParsing -ErrorAction SilentlyContinue
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401 -or $_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "  ✅ /api/generate/video - Endpoint exists" -ForegroundColor Green
    } else {
        Write-Host "  ❌ /api/generate/video - Unexpected error" -ForegroundColor Red
        $errors++
    }
}

# Test admin endpoints
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/admin/stats" -UseBasicParsing -ErrorAction SilentlyContinue
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "  ✅ /api/admin/stats - Endpoint exists (401 = needs auth)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ /api/admin/stats - Unexpected error" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

if ($errors -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your backend and frontend are working correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Frontend: All pages load" -ForegroundColor Green
    Write-Host "✅ Backend: All API endpoints exist" -ForegroundColor Green
    Write-Host "✅ Routing: Working correctly" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Visit http://localhost:3001 in your browser" -ForegroundColor White
    Write-Host "2. Sign up for a test account" -ForegroundColor White
    Write-Host "3. Generate a test image!" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ $errors TEST(S) FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the errors above and fix them." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Server running at: $baseUrl" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server when done testing." -ForegroundColor Gray
Write-Host ""
