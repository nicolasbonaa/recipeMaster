# Atividade 11 - Parte A: testes reais da API de seguir.
# Uso: npm run teste-aula-11

$ErrorActionPreference = 'Stop'
$BASE = if ($env:RECIPEMASTER_API_URL) { $env:RECIPEMASTER_API_URL.TrimEnd('/') } else { 'http://localhost:3000/api' }
$suffix = Get-Date -Format 'yyyyMMddHHmmss'
$pass = 'senha123'
$img = Join-Path $PSScriptRoot '..\..\frontend-recipemaster\img\povao.png'
$script:passed = 0
$script:failed = 0

function Invoke-CurlJson([string]$label, [string[]]$curlArgs, [int]$expectedStatus) {
    $outputFile = Join-Path ([System.IO.Path]::GetTempPath()) "recipe-master-a11-$([guid]::NewGuid()).json"
    try {
        $status = (& curl.exe -sS -o $outputFile -w '%{http_code}' @curlArgs).Trim()
        $body = if (Test-Path $outputFile) { Get-Content -Raw $outputFile } else { '' }
        $actualStatus = [int]$status
        $data = if ($body) { $body | ConvertFrom-Json } else { $null }
        if ($actualStatus -ne $expectedStatus) {
            $script:failed++
            Write-Host "[FAIL] $label -> HTTP $actualStatus (esperado $expectedStatus)" -ForegroundColor Red
            Write-Host $body
            throw "Falha no teste: $label"
        }
        $script:passed++
        Write-Host "[PASS] $label -> HTTP $actualStatus" -ForegroundColor Green
        return $data
    } finally {
        Remove-Item -LiteralPath $outputFile -Force -ErrorAction SilentlyContinue
    }
}

function Assert-Equal($actual, $expected, [string]$label) {
    if ($actual -ne $expected) {
        $script:failed++
        throw "Falha: $label. Obtido '$actual'; esperado '$expected'."
    }
    $script:passed++
    Write-Host "[PASS] $label" -ForegroundColor Green
}

function NewUser([string]$letter) {
    $username = "$($letter.ToLower())_$suffix"
    $email = "$username@a11.com"
    $body = @{ username = $username; email = $email; password = $pass; confirmPassword = $pass; fullName = "Conta $letter" } | ConvertTo-Json -Compress
    $registrationFile = Join-Path ([System.IO.Path]::GetTempPath()) "recipe-master-a11-register-$([guid]::NewGuid()).json"
    $loginFile = Join-Path ([System.IO.Path]::GetTempPath()) "recipe-master-a11-login-$([guid]::NewGuid()).json"
    try {
        [System.IO.File]::WriteAllText($registrationFile, $body, (New-Object System.Text.UTF8Encoding($false)))
        $registration = Invoke-CurlJson "cadastro $letter" @('-X', 'POST', "$BASE/register", '-H', 'Content-Type: application/json', '--data-binary', "@$registrationFile") 201
        $loginBody = @{ email = $email; password = $pass } | ConvertTo-Json -Compress
        [System.IO.File]::WriteAllText($loginFile, $loginBody, (New-Object System.Text.UTF8Encoding($false)))
        $login = Invoke-CurlJson "login $letter" @('-X', 'POST', "$BASE/login", '-H', 'Content-Type: application/json', '--data-binary', "@$loginFile") 200
    } finally {
        Remove-Item -LiteralPath $registrationFile, $loginFile -Force -ErrorAction SilentlyContinue
    }
    [pscustomobject]@{
        Letter = $letter
        Id = [int]$registration.data.id
        Username = $username
        Token = [string]$login.data.token
        Header = "Authorization: Bearer $($login.data.token)"
    }
}

function Test-Profile([object]$user, [int]$followers, [int]$following) {
    $profile = Invoke-CurlJson "perfil $($user.Letter)" @("$BASE/profile/$($user.Username)") 200
    Assert-Equal $profile.data.followersCount $followers "$($user.Letter): followersCount"
    Assert-Equal $profile.data.followingCount $following "$($user.Letter): followingCount"
}

try {
    Invoke-CurlJson 'health check' @("$BASE/") 200 | Out-Null

    Write-Host "`n=== PREPARAÇÃO: contas A, B, C e receita de B ===" -ForegroundColor Cyan
    $A = NewUser 'A'; $B = NewUser 'B'; $C = NewUser 'C'
    Invoke-CurlJson 'receita de B' @('-X', 'POST', "$BASE/recipes", '-H', $B.Header, '-F', 'title=Receita do B', '-F', 'description=Receita publicada pela conta B', '-F', "image=@$img") 201 | Out-Null

    Write-Host "`n=== TESTE 1: erros do toggle-follow ===" -ForegroundColor Cyan
    Invoke-CurlJson 'sem token' @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow") 401 | Out-Null
    Invoke-CurlJson 'id inválido' @('-X', 'POST', "$BASE/users/abc/toggle-follow", '-H', $A.Header) 400 | Out-Null
    Invoke-CurlJson 'seguir a si mesmo' @('-X', 'POST', "$BASE/users/$($A.Id)/toggle-follow", '-H', $A.Header) 400 | Out-Null
    Invoke-CurlJson 'usuário inexistente' @('-X', 'POST', "$BASE/users/999999/toggle-follow", '-H', $A.Header) 404 | Out-Null

    Write-Host "`n=== TESTE 2: alternância ===" -ForegroundColor Cyan
    $follow = Invoke-CurlJson 'A segue B' @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow", '-H', $A.Header) 201
    Assert-Equal ([bool]$follow.data.isFollowing) $true 'A seguindo B'
    Assert-Equal ([int]$follow.data.followersCount) 1 'B com 1 seguidor'
    Invoke-CurlJson 'A deixa de seguir B' @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow", '-H', $A.Header) 200 | Out-Null
    Invoke-CurlJson 'A segue B novamente' @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow", '-H', $A.Header) 201 | Out-Null
    Invoke-CurlJson 'C segue B' @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow", '-H', $C.Header) 201 | Out-Null
    Invoke-CurlJson 'B segue A' @('-X', 'POST', "$BASE/users/$($A.Id)/toggle-follow", '-H', $B.Header) 201 | Out-Null

    Write-Host "`n=== TESTE 3: contadores ===" -ForegroundColor Cyan
    Test-Profile $B 2 1
    Test-Profile $A 1 1
    Test-Profile $C 0 1

    Write-Host "`n=== TESTE 4: status e isFollowing ===" -ForegroundColor Cyan
    $status = Invoke-CurlJson 'A verifica B' @("$BASE/users/$($B.Id)/follow-status", '-H', $A.Header) 200
    Assert-Equal ([bool]$status.data.isFollowing) $true 'follow-status A -> B'
    $profile = Invoke-CurlJson 'A abre perfil de B' @("$BASE/profile/$($B.Username)", '-H', $A.Header) 200
    Assert-Equal ([bool]$profile.data.isFollowing) $true 'isFollowing A -> B'
    $owner = Invoke-CurlJson 'B abre próprio perfil' @("$BASE/profile/$($B.Username)", '-H', $B.Header) 200
    Assert-Equal ([bool]$owner.data.isOwner) $true 'isOwner B'
    Assert-Equal ([bool]$owner.data.isFollowing) $false 'isFollowing do próprio perfil'

    Write-Host "`n=== TESTE 5: listas públicas ===" -ForegroundColor Cyan
    $followers = Invoke-CurlJson 'seguidores de B' @("$BASE/users/$($B.Id)/followers") 200
    Assert-Equal $followers.data.Count 2 'quantidade de seguidores de B'
    Assert-Equal $followers.data[0].username $C.Username 'seguidor mais recente de B'
    $following = Invoke-CurlJson 'seguindo de A' @("$BASE/users/$($A.Id)/following") 200
    Assert-Equal $following.data.Count 1 'quantidade seguindo de A'
    Assert-Equal $following.data[0].username $B.Username 'A segue B'
    Invoke-CurlJson 'lista de usuário inexistente' @("$BASE/users/999999/followers") 404 | Out-Null

    Write-Host "`n=== TESTE 6: feed filtrado ===" -ForegroundColor Cyan
    Invoke-CurlJson 'feed sem token' @("$BASE/following-recipes") 401 | Out-Null
    $feed = Invoke-CurlJson 'feed de A' @("$BASE/following-recipes", '-H', $A.Header) 200
    Assert-Equal $feed.data.Count 1 'A vê uma receita de B'
    Assert-Equal $feed.data[0].userId $B.Id 'receita pertence a B'
    $pageTwo = Invoke-CurlJson 'segunda página vazia' @("$BASE/following-recipes?page=2&limit=1", '-H', $A.Header) 200
    Assert-Equal $pageTwo.data.Count 0 'página 2 vazia'
    $D = NewUser 'D'
    $empty = Invoke-CurlJson 'feed de D sem follows' @("$BASE/following-recipes", '-H', $D.Header) 200
    Assert-Equal $empty.data.Count 0 'feed vazio de D'

    Write-Host "`n=== TESTE 8: regressão ===" -ForegroundColor Cyan
    Invoke-CurlJson 'feed geral' @("$BASE/feed?limit=2", '-H', $A.Header) 200 | Out-Null

    Write-Host "`nResultado: $script:passed verificações aprovadas; $script:failed falhas." -ForegroundColor Green
    Write-Host 'Teste 7 (índice único) permanece no follows-duplicado.sql para execução no MySQL.' -ForegroundColor Yellow
    exit 0
} catch {
    Write-Host "`nResultado: $script:passed verificações aprovadas; $script:failed falhas." -ForegroundColor Red
    Write-Error $_
    exit 1
}
