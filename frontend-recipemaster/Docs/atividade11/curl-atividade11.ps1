# Atividade 11 - Parte A, Etapa 4 (bateria de testes da API de seguir)
# Uso (PowerShell, com a API rodando):  .\curl-atividade11.ps1
# Cria tres contas novas (A, B e C), publica 1 receita para B e executa os testes 1 a 6.
# Tire um print de cada bloco "TESTE n" para a entrega.

$ErrorActionPreference = 'Stop'
$BASE = 'http://localhost:3000/api'
$suffix = Get-Date -Format 'HHmmss'
$pass = 'senha123'
$img = Join-Path $PSScriptRoot '..\..\img\povao.png'

function Title($text) { Write-Host "`n==================== $text ====================" -ForegroundColor Cyan }
function Run($label, [string[]]$curlArgs) {
    Write-Host "`n> $label" -ForegroundColor Yellow
    & curl.exe -s -w "`n<- HTTP %{http_code}`n" @curlArgs
}

function NewUser($letter) {
    $username = "$($letter.ToLower())_$suffix"
    $email = "$username@a11.com"
    $body = @{ username = $username; email = $email; password = $pass; confirmPassword = $pass; fullName = "Conta $letter" } | ConvertTo-Json
    $reg = Invoke-RestMethod -Method Post -Uri "$BASE/register" -ContentType 'application/json' -Body $body
    $login = Invoke-RestMethod -Method Post -Uri "$BASE/login" -ContentType 'application/json' -Body (@{ email = $email; password = $pass } | ConvertTo-Json)
    [pscustomobject]@{ Letter = $letter; Id = $reg.data.id; Username = $username; Token = $login.data.token }
}

Title 'PREPARACAO: contas A, B, C e 1 receita de B'
$A = NewUser 'A'; $B = NewUser 'B'; $C = NewUser 'C'
$A, $B, $C | Format-Table Letter, Id, Username
& curl.exe -s -o NUL -X POST "$BASE/recipes" -H "Authorization: Bearer $($B.Token)" -F "title=Receita do B" -F "description=Receita publicada pela conta B" -F "image=@$img"
$hA = "Authorization: Bearer $($A.Token)"; $hB = "Authorization: Bearer $($B.Token)"; $hC = "Authorization: Bearer $($C.Token)"

Title 'TESTE 1 - erros do toggle-follow'
Run 'sem token -> 401'            @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow")
Run 'id abc -> 400'               @('-X', 'POST', "$BASE/users/abc/toggle-follow", '-H', $hA)
Run 'seguir a si mesmo -> 400'    @('-X', 'POST', "$BASE/users/$($A.Id)/toggle-follow", '-H', $hA)
Run 'usuario 99999 -> 404'        @('-X', 'POST', "$BASE/users/99999/toggle-follow", '-H', $hA)

Title 'TESTE 2 - alternancia'
Run 'A segue B -> 201, followersCount 1'         @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow", '-H', $hA)
Run 'A de novo -> 200, followersCount 0'         @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow", '-H', $hA)
Run 'A de novo -> 201, followersCount 1'         @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow", '-H', $hA)
Run 'C segue B -> 201, followersCount 2'         @('-X', 'POST', "$BASE/users/$($B.Id)/toggle-follow", '-H', $hC)
Run 'B segue A -> 201, followersCount 1'         @('-X', 'POST', "$BASE/users/$($A.Id)/toggle-follow", '-H', $hB)

Title 'TESTE 3 - contadores dos dois lados'
Run "B (esperado 2 seguidores / 1 seguindo)" @("$BASE/profile/$($B.Username)")
Run "A (esperado 1 / 1)"                     @("$BASE/profile/$($A.Username)")
Run "C (esperado 0 / 1)"                     @("$BASE/profile/$($C.Username)")

Title 'TESTE 4 - follow-status e isFollowing'
Run 'visitante olhando B -> isFollowing false'           @("$BASE/profile/$($B.Username)")
Run 'A: follow-status de B -> true'                      @("$BASE/users/$($B.Id)/follow-status", '-H', $hA)
Run 'A olhando perfil de B -> isFollowing true'          @("$BASE/profile/$($B.Username)", '-H', $hA)
Run 'C: follow-status de A -> false'                     @("$BASE/users/$($A.Id)/follow-status", '-H', $hC)
Run 'C olhando perfil de A -> isFollowing false'         @("$BASE/profile/$($A.Username)", '-H', $hC)
Run 'B olhando o proprio perfil -> false, isOwner true'  @("$BASE/profile/$($B.Username)", '-H', $hB)

Title 'TESTE 5 - listas publicas'
Run 'followers de B -> C e A (mais recente primeiro), sem password' @("$BASE/users/$($B.Id)/followers")
Run 'following de A -> B'                                           @("$BASE/users/$($A.Id)/following")
Run 'followers de 99999 -> 404'                                     @("$BASE/users/99999/followers")

Title 'TESTE 6 - feed filtrado /following-recipes'
Run 'sem token -> 401'                                   @("$BASE/following-recipes")
Run 'A (segue B) -> so receitas de B'                    @("$BASE/following-recipes", '-H', $hA)
Run '?page=2&limit=1 -> [] (B tem 1 receita)'            @("$BASE/following-recipes?page=2&limit=1", '-H', $hA)
$D = NewUser 'D'
Run 'conta D (nao segue ninguem) -> []'                  @("$BASE/following-recipes", '-H', "Authorization: Bearer $($D.Token)")

Title 'TESTE 8 - regressao rapida'
Run 'GET /feed com token de A -> 200' @("$BASE/feed?limit=2", '-H', $hA)

Write-Host "`nIds usados: A=$($A.Id) B=$($B.Id) C=$($C.Id). Para o TESTE 7, rode follows-duplicado.sql no cliente de banco com A e B." -ForegroundColor Green
