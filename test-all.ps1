Write-Host "=== NestJS Microservices Backend - Complete Test Suite ===" -ForegroundColor Cyan

# Test 1: Duplicate Email
Write-Host "`n[TEST 1] Duplicate Email (409 Expected)" -ForegroundColor Yellow
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}'

# Test 2: Invalid Email
Write-Host "`n[TEST 2] Invalid Email Format (400 Expected)" -ForegroundColor Yellow
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{\"email\":\"notanemail\",\"password\":\"password123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}'

# Test 3: Password Too Short
Write-Host "`n[TEST 3] Short Password (400 Expected)" -ForegroundColor Yellow
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{\"email\":\"short@example.com\",\"password\":\"123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}'

# Test 4: New User Registration
Write-Host "`n[TEST 4] Register New User (201 Expected)" -ForegroundColor Yellow
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{\"email\":\"jane.smith@example.com\",\"password\":\"password456\",\"firstName\":\"Jane\",\"lastName\":\"Smith\"}'

# Test 5: Get All Users
Write-Host "`n[TEST 5] Get All Users (200 Expected)" -ForegroundColor Yellow
curl http://localhost:3000/auth/users

# Test 6: Health Checks
Write-Host "`n[TEST 6] Health Check (200 Expected)" -ForegroundColor Yellow
curl http://localhost:3000/health

Write-Host "`n`n=== Test Suite Complete ===" -ForegroundColor Green