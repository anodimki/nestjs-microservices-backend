Write-Host "=== JWT Authentication Complete Test Suite ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$testEmail = "jwt-test-$(Get-Random -Minimum 1000 -Maximum 9999)@example.com"
$token = ""

# Test 1: Health Check
Write-Host "[TEST 1] Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health"
    Write-Host "PASS: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "FAIL" -ForegroundColor Red
}
Write-Host ""

# Test 2: Register User
Write-Host "[TEST 2] Register User" -ForegroundColor Yellow
try {
    $registerBody = @{
        email = $testEmail
        password = "password123"
        firstName = "JWT"
        lastName = "Test"
    } | ConvertTo-Json

    $user = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "PASS: User registered with email $($user.email)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Login with Valid Credentials
Write-Host "[TEST 3] Login with Valid Credentials" -ForegroundColor Yellow
try {
    $loginBody = @{
        email = $testEmail
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.accessToken
    Write-Host "PASS: Token received" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Login with Wrong Password
Write-Host "[TEST 4] Login with Wrong Password (Should Fail)" -ForegroundColor Yellow
try {
    $wrongLoginBody = @{
        email = $testEmail
        password = "wrongpassword"
    } | ConvertTo-Json

    Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $wrongLoginBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "FAIL: Should have returned 401" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "PASS: Correctly rejected (401)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Wrong status code" -ForegroundColor Red
    }
}
Write-Host ""

# Test 5: Access Protected Route WITHOUT Token
Write-Host "[TEST 5] Access /auth/users WITHOUT Token (Should Fail)" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/auth/users" -ErrorAction Stop
    Write-Host "FAIL: Should have returned 401" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "PASS: Correctly blocked (401)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Wrong status code" -ForegroundColor Red
    }
}
Write-Host ""

# Test 6: Access Protected Route WITH Valid Token
Write-Host "[TEST 6] Access /auth/users WITH Valid Token" -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/auth/users" -Headers @{Authorization = "Bearer $token"}
    Write-Host "PASS: Retrieved $($users.Count) users" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Access with Invalid Token
Write-Host "[TEST 7] Access with Invalid Token (Should Fail)" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/auth/users" -Headers @{Authorization = "Bearer invalid-token"} -ErrorAction Stop
    Write-Host "FAIL: Should have returned 401" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "PASS: Correctly rejected (401)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Wrong status code" -ForegroundColor Red
    }
}
Write-Host ""

# Test 8: Get Current User Profile
Write-Host "[TEST 8] Get Current User Profile" -ForegroundColor Yellow
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Headers @{Authorization = "Bearer $token"}
    Write-Host "PASS: Profile retrieved for $($profile.email)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 9: Invalid Email Format
Write-Host "[TEST 9] Register with Invalid Email (Should Fail)" -ForegroundColor Yellow
try {
    $invalidEmailBody = @{
        email = "notanemail"
        password = "password123"
        firstName = "Test"
        lastName = "User"
    } | ConvertTo-Json

    Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $invalidEmailBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "FAIL: Should have returned 400" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "PASS: Correctly rejected (400)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Wrong status code" -ForegroundColor Red
    }
}
Write-Host ""

# Test 10: Duplicate Registration
Write-Host "[TEST 10] Register Duplicate Email (Should Fail)" -ForegroundColor Yellow
try {
    $duplicateBody = @{
        email = $testEmail
        password = "password123"
        firstName = "Duplicate"
        lastName = "User"
    } | ConvertTo-Json

    Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $duplicateBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "FAIL: Should have returned 409" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        Write-Host "PASS: Correctly rejected (409)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Wrong status code" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "=== Test Suite Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your JWT Token (for manual testing):" -ForegroundColor Yellow
Write-Host $token -ForegroundColor Gray
Write-Host ""
Write-Host "Decode this token at: https://jwt.io" -ForegroundColor Cyan