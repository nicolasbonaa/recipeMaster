param(
    [string]$BaseUrl = 'http://localhost:3000/api',
    [string]$Origin = 'http://localhost:5174'
)

# Bateria da Atividade 14 (Etapa 5): notificações, denúncias, exclusão, logout e regressão.
# Cria três contas novas (A, B e C) e as receitas de que precisa; nada depende de ids fixos.
# Cada teste imprime o corpo da resposta e o status. Os testes NÃO param no primeiro erro.

$ErrorActionPreference = 'Continue'
$suffix = Get-Date -Format 'MMddHHmmss'
$pass = 'senha123'
$img = Join-Path $PSScriptRoot '..\..\frontend-recipemaster\img\povao.png'
$utf8 = New-Object System.Text.UTF8Encoding $false

function Invoke-ApiTest {
    param([string]$Name, [string]$Method, [string]$Url, [string]$Token, [string]$Body, [switch]$Quiet)
    $outFile = [IO.Path]::GetTempFileName()
    $curlArgs = @('-sS', '-o', $outFile, '-w', '%{http_code}', '-X', $Method, "$BaseUrl$Url", '-H', 'Content-Type: application/json')
    if ($Token) { $curlArgs += @('-H', "Authorization: Bearer $Token") }
    $bodyFile = $null
    if ($Body) {
        $bodyFile = [IO.Path]::GetTempFileName()
        [IO.File]::WriteAllText($bodyFile, $Body, $utf8)
        $curlArgs += @('--data-binary', "@$bodyFile")
    }
    $status = (& curl.exe @curlArgs)
    $text = [IO.File]::ReadAllText($outFile, $utf8)
    Remove-Item -LiteralPath $outFile -Force -ErrorAction SilentlyContinue
    if ($bodyFile) { Remove-Item -LiteralPath $bodyFile -Force -ErrorAction SilentlyContinue }
    if (-not $Quiet) {
        # Write-Host: o retorno da função (o JSON convertido) fica separado do que é impresso.
        Write-Host "`n=== $Name ==="
        Write-Host $text
        Write-Host "HTTP_STATUS:$status"
    }
    try { return ($text | ConvertFrom-Json) } catch { return $null }
}

function New-Account([string]$Letter) {
    $username = "a14$($Letter.ToLower())$suffix"
    $register = @{ username = $username; email = "$username@example.com"; password = $pass; confirmPassword = $pass; fullName = "Conta $Letter" } | ConvertTo-Json -Compress
    $user = Invoke-ApiTest "cadastro $Letter" 'POST' '/register' '' $register -Quiet
    $login = Invoke-ApiTest "login $Letter" 'POST' '/login' '' (@{ email = "$username@example.com"; password = $pass } | ConvertTo-Json -Compress) -Quiet
    [pscustomobject]@{ Id = [int]$user.data.id; Username = $username; Token = $login.data.token }
}

function New-Recipe($Account, [string]$Title) {
    $outFile = [IO.Path]::GetTempFileName()
    & curl.exe -sS -o $outFile -X POST "$BaseUrl/recipes" -H "Authorization: Bearer $($Account.Token)" -F "title=$Title" -F 'description=Receita criada pela bateria da aula 14.' -F "image=@$img" | Out-Null
    $json = [IO.File]::ReadAllText($outFile, $utf8) | ConvertFrom-Json
    Remove-Item -LiteralPath $outFile -Force -ErrorAction SilentlyContinue
    return [int]$json.data.id
}

# ---------- Preparação (não conta como teste) ----------
$A = New-Account 'A'; $B = New-Account 'B'; $C = New-Account 'C'
$RB = New-Recipe $B 'Receita da conta B (aula 14)'
$RA = New-Recipe $A 'Receita da conta A (aula 14)'
Write-Output "Contas: A=$($A.Id) B=$($B.Id) C=$($C.Id) | receita de B=$RB | receita de A=$RA"

# ---------- 1. Sem token ----------
Invoke-ApiTest '1.1 Listar notificações sem token (401)' 'GET' '/notifications' | Out-Null
Invoke-ApiTest '1.2 unread-count sem token (401)' 'GET' '/notifications/unread-count' | Out-Null
Invoke-ApiTest '1.3 Marcar como lida sem token (401)' 'PATCH' '/notifications/1/read' | Out-Null
Invoke-ApiTest '1.4 Denunciar sem token (401)' 'POST' "/recipes/$RB/report" '' '{"reason":"spam"}' | Out-Null

# ---------- 2. Curtir ----------
Invoke-ApiTest '2.1 A curte a receita de B (201)' 'POST' "/recipes/$RB/toggle-like" $A.Token | Out-Null
Invoke-ApiTest '2.2 B tem 1 não lida (unreadCount 1)' 'GET' '/notifications/unread-count' $B.Token | Out-Null
Invoke-ApiTest '2.3 Lista de B: aviso com Actor (sem password/email/isAdmin) e a receita' 'GET' '/notifications' $B.Token | Out-Null
Invoke-ApiTest '2.4 A curte a própria receita (201)' 'POST' "/recipes/$RA/toggle-like" $A.Token | Out-Null
Invoke-ApiTest '2.5 A continua com 0 não lidas' 'GET' '/notifications/unread-count' $A.Token | Out-Null
Invoke-ApiTest '2.6 A descurte a receita de B (200)' 'POST' "/recipes/$RB/toggle-like" $A.Token | Out-Null
Invoke-ApiTest '2.7 Descurtir apagou o aviso (unreadCount 0)' 'GET' '/notifications/unread-count' $B.Token | Out-Null
Invoke-ApiTest '2.8 A curte de novo (201)' 'POST' "/recipes/$RB/toggle-like" $A.Token | Out-Null
Invoke-ApiTest '2.9 Só um aviso de curtida (unreadCount 1)' 'GET' '/notifications/unread-count' $B.Token | Out-Null

# ---------- 3. Comentar ----------
Invoke-ApiTest '3.1 C comenta na receita de B (201)' 'POST' "/recipes/$RB/comments" $C.Token '{"content":"Ficou ótima! Vou fazer no domingo."}' | Out-Null
Invoke-ApiTest '3.2 B ganhou um aviso (unreadCount 2)' 'GET' '/notifications/unread-count' $B.Token | Out-Null
Invoke-ApiTest '3.3 B comenta na própria receita (201)' 'POST' "/recipes/$RB/comments" $B.Token '{"content":"Obrigado!"}' | Out-Null
Invoke-ApiTest '3.4 B não ganhou aviso (unreadCount 2)' 'GET' '/notifications/unread-count' $B.Token | Out-Null

# ---------- 4. Seguir ----------
Invoke-ApiTest '4.1 A segue B (201)' 'POST' "/users/$($B.Id)/toggle-follow" $A.Token | Out-Null
Invoke-ApiTest '4.2 Lista de B: aviso follow com recipeId nulo' 'GET' '/notifications?limit=1' $B.Token | Out-Null
Invoke-ApiTest '4.3 A deixa de seguir B (200)' 'POST' "/users/$($B.Id)/toggle-follow" $A.Token | Out-Null
Invoke-ApiTest '4.4 Deixar de seguir apagou o aviso (unreadCount 2)' 'GET' '/notifications/unread-count' $B.Token | Out-Null
Invoke-ApiTest '4.5 A segue B de novo (201)' 'POST' "/users/$($B.Id)/toggle-follow" $A.Token | Out-Null
Invoke-ApiTest '4.6 Só um aviso de follow (unreadCount 3)' 'GET' '/notifications/unread-count' $B.Token | Out-Null

# ---------- 5. Lista ----------
Invoke-ApiTest '5.1 Lista de B: a mais nova primeiro' 'GET' '/notifications' $B.Token | Out-Null
Invoke-ApiTest '5.2 ?limit=1&page=2 (só a segunda)' 'GET' '/notifications?limit=1&page=2' $B.Token | Out-Null
Invoke-ApiTest '5.3 Página além do fim (lista vazia)' 'GET' '/notifications?page=99' $B.Token | Out-Null
Invoke-ApiTest '5.4 ?page=abc&limit=-5 (padrões)' 'GET' '/notifications?page=abc&limit=-5' $B.Token | Out-Null
Invoke-ApiTest '5.5 B segue C (201)' 'POST' "/users/$($C.Id)/toggle-follow" $B.Token | Out-Null
Invoke-ApiTest '5.6 C vê só as dela (um follow de B)' 'GET' '/notifications' $C.Token | Out-Null

# ---------- 6. Marcar como lida ----------
$listB = Invoke-ApiTest 'Preparação: id da notificação mais nova de B' 'GET' '/notifications?limit=1' $B.Token -Quiet
$N = [int]$listB.data[0].id
Invoke-ApiTest "6.1 C marca a notificação $N de B (403)" 'PATCH' "/notifications/$N/read" $C.Token | Out-Null
Invoke-ApiTest '6.2 Notificação inexistente (404)' 'PATCH' '/notifications/999999/read' $B.Token | Out-Null
Invoke-ApiTest '6.3 Id abc (400)' 'PATCH' '/notifications/abc/read' $B.Token | Out-Null
Invoke-ApiTest "6.4 B marca a $N (200, unreadCount 2)" 'PATCH' "/notifications/$N/read" $B.Token | Out-Null
Invoke-ApiTest "6.5 B repete (200, mesmo unreadCount)" 'PATCH' "/notifications/$N/read" $B.Token | Out-Null
Invoke-ApiTest '6.6 unread-count reflete (2)' 'GET' '/notifications/unread-count' $B.Token | Out-Null
Invoke-ApiTest '6.7 A lista reflete (isRead true na mais nova)' 'GET' '/notifications?limit=1' $B.Token | Out-Null

# ---------- 7. Denúncia ----------
Invoke-ApiTest '7.1 C denuncia a receita de B (201)' 'POST' "/recipes/$RB/report" $C.Token '{"reason":"spam"}' | Out-Null
Invoke-ApiTest '7.2 C denuncia de novo (409)' 'POST' "/recipes/$RB/report" $C.Token '{"reason":"other"}' | Out-Null
Invoke-ApiTest '7.3 A denuncia a mesma receita (201)' 'POST' "/recipes/$RB/report" $A.Token '{"reason":"copyright"}' | Out-Null
Invoke-ApiTest '7.4 Sem reason (400)' 'POST' "/recipes/$RB/report" $C.Token '{}' | Out-Null
Invoke-ApiTest '7.5 reason fora da lista (400)' 'POST' "/recipes/$RB/report" $C.Token '{"reason":"chato"}' | Out-Null
Invoke-ApiTest '7.6 Rótulo em vez da chave (400)' 'POST' "/recipes/$RB/report" $C.Token '{"reason":"Spam ou golpes"}' | Out-Null
Invoke-ApiTest '7.7 Id abc (400)' 'POST' '/recipes/abc/report' $C.Token '{"reason":"spam"}' | Out-Null
Invoke-ApiTest '7.8 Receita 99999 (404)' 'POST' '/recipes/99999/report' $C.Token '{"reason":"spam"}' | Out-Null
Invoke-ApiTest '7.9 O dono denunciando (400)' 'POST' "/recipes/$RB/report" $B.Token '{"reason":"spam"}' | Out-Null
Invoke-ApiTest '7.10 O dono não ganhou notificação (unreadCount 2)' 'GET' '/notifications/unread-count' $B.Token | Out-Null

# ---------- 9. Excluir o item (8 é no banco) ----------
Invoke-ApiTest '9.1 B exclui a receita curtida, comentada e denunciada (200)' 'DELETE' "/recipes/$RB" $B.Token | Out-Null
Invoke-ApiTest '9.2 Lista de B: só sobra o aviso de follow' 'GET' '/notifications' $B.Token | Out-Null

# ---------- 10. O erro do logout ----------
Write-Output "`n=== 10. Logout com corpo `"null`" (400 COM Access-Control-Allow-Origin) ==="
$nullFile = [IO.Path]::GetTempFileName()
[IO.File]::WriteAllText($nullFile, 'null', $utf8)
& curl.exe -sS -i -X POST "$BaseUrl/logout" -H "Origin: $Origin" -H 'Content-Type: application/json' --data-binary "@$nullFile"
Remove-Item -LiteralPath $nullFile -Force -ErrorAction SilentlyContinue
Write-Output ''
Invoke-ApiTest '10.2 Logout sem corpo (200)' 'POST' '/logout' $A.Token | Out-Null

# ---------- 11. Regressão ----------
Invoke-ApiTest '11.1 Curtir (201)' 'POST' "/recipes/$RA/toggle-like" $C.Token | Out-Null
Invoke-ApiTest '11.2 Descurtir (200)' 'POST' "/recipes/$RA/toggle-like" $C.Token | Out-Null
Invoke-ApiTest '11.3 Comentar (201)' 'POST' "/recipes/$RA/comments" $C.Token '{"content":"Regressão da aula 14."}' | Out-Null
Write-Output "`n=== 11.4 Upload (201) e edição (200) ==="
$RX = New-Recipe $A 'Receita de regressão (aula 14)'
Write-Output "upload: receita $RX criada"
& curl.exe -sS -w "`nHTTP_STATUS:%{http_code}" -X PUT "$BaseUrl/recipes/$RX" -H "Authorization: Bearer $($A.Token)" -F 'title=Receita de regressão editada' -F 'description=Edição feita pela bateria da aula 14.'
Write-Output ''
Invoke-ApiTest '11.5 Seguidores de A' 'GET' "/users/$($A.Id)/followers" | Out-Null
Invoke-ApiTest '11.6 Quem A segue' 'GET' "/users/$($A.Id)/following" | Out-Null
Invoke-ApiTest '11.7 Minhas coleções' 'GET' '/my-collections' $A.Token | Out-Null
Invoke-ApiTest '11.8 Busca' 'GET' '/search?q=aula' | Out-Null
Invoke-ApiTest '11.9 Feed' 'GET' '/feed?limit=2' $A.Token | Out-Null
Invoke-ApiTest '11.10 Feed Seguindo' 'GET' '/following-recipes' $A.Token | Out-Null
Invoke-ApiTest '11.11 GET /users/abc/followers (400)' 'GET' '/users/abc/followers' | Out-Null
