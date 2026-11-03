$ErrorActionPreference = 'Stop'
$BASE = if ($env:RECIPEMASTER_API_URL) { $env:RECIPEMASTER_API_URL.TrimEnd('/') } else { 'http://localhost:3000/api' }
$suffix = Get-Date -Format 'yyyyMMddHHmmss'
$pass = 'senha123'
$img = Join-Path $PSScriptRoot '..\..\frontend-recipemaster\img\povao.png'
$script:passed = 0

function CurlJson([string]$label, [string[]]$curlArgs, [int]$expected) {
    $file = Join-Path ([IO.Path]::GetTempPath()) "a12-$([guid]::NewGuid()).json"
    try {
        $status = (& curl.exe -sS -o $file -w '%{http_code}' @curlArgs).Trim()
        $body = Get-Content -Raw $file
        if ([int]$status -ne $expected) { throw "${label}: HTTP $status; esperado $expected. $body" }
        $script:passed++
        Write-Host "[PASS] $label -> HTTP $status" -ForegroundColor Green
        return ($body | ConvertFrom-Json)
    } finally { Remove-Item $file -Force -ErrorAction SilentlyContinue }
}

function JsonFile($value) {
    $file = Join-Path ([IO.Path]::GetTempPath()) "a12-body-$([guid]::NewGuid()).json"
    $value | ConvertTo-Json -Compress | Set-Content -LiteralPath $file -Encoding utf8
    return $file
}

function NewUser($letter) {
    $username = "a$($letter.ToLower())$suffix"
    $body = @{ username = $username; email = "$username@example.com"; password = $pass; confirmPassword = $pass; fullName = "Aula 12 $letter" }
    $registerFile = JsonFile $body
    $register = CurlJson "cadastro $letter" @('-X','POST',"$BASE/register",'-H','Content-Type: application/json','--data-binary',"@$registerFile") 201
    Remove-Item $registerFile -Force
    $loginFile = JsonFile @{ email = "$username@example.com"; password = $pass }
    $login = CurlJson "login $letter" @('-X','POST',"$BASE/login",'-H','Content-Type: application/json','--data-binary',"@$loginFile") 200
    Remove-Item $loginFile -Force
    [pscustomobject]@{ Id = [int]$register.data.id; Username = $username; Header = "Authorization: Bearer $($login.data.token)" }
}

try {
    CurlJson 'health check' @("$BASE/") 200 | Out-Null
    $A = NewUser 'A'; $B = NewUser 'B'
    CurlJson 'criação de receita e contador' @('-X','POST',"$BASE/recipes",'-H',$B.Header,'-F','title=Aula 12','-F','description=Receita de regressão','-F',"image=@$img") 201 | Out-Null

    $beforeNegative = CurlJson 'feed geral limit=-3' @("$BASE/feed?limit=-3",'-H',$A.Header) 200
    if ($beforeNegative.data.Count -gt 50) { throw 'limit=-3 ultrapassou o teto' }
    $beforeHuge = CurlJson 'feed geral limit=100000' @("$BASE/feed?limit=100000",'-H',$A.Header) 200
    if ($beforeHuge.data.Count -gt 50) { throw 'limit=100000 ultrapassou o teto' }
    CurlJson 'feed geral page=-2 limit=2' @("$BASE/feed?page=-2&limit=2",'-H',$A.Header) 200 | Out-Null
    CurlJson 'feed filtrado sem token' @("$BASE/following-recipes") 401 | Out-Null
    CurlJson 'perfil público' @("$BASE/profile/$($B.Username)") 200 | Out-Null
    CurlJson 'seguidores públicos' @("$BASE/users/$($B.Id)/followers") 200 | Out-Null
    CurlJson 'seguindo público' @("$BASE/users/$($A.Id)/following") 200 | Out-Null
    CurlJson 'curtidas' @("$BASE/liked-recipes",'-H',$A.Header) 200 | Out-Null
    CurlJson 'comentários' @("$BASE/recipes/999999/comments") 404 | Out-Null
    CurlJson 'meus itens' @("$BASE/my-recipes",'-H',$B.Header) 200 | Out-Null
    Write-Host "Resultado: $script:passed verificações aprovadas; 0 falhas." -ForegroundColor Green
    exit 0
} catch {
    Write-Error $_
    exit 1
}
