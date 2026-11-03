param(
    [string]$BaseUrl = 'http://localhost:3000/api',
    [string]$TokenA = $env:RECIPEMASTER_TOKEN_A,
    [string]$TokenB = $env:RECIPEMASTER_TOKEN_B,
    [int]$RecipeId = 1,
    [int]$CollectionId = 1
)

$ErrorActionPreference = 'Continue'
$headersA = @{}
$headersB = @{}
if ($TokenA) { $headersA.Authorization = "Bearer $TokenA" }
if ($TokenB) { $headersB.Authorization = "Bearer $TokenB" }

function Invoke-ApiTest {
    param([string]$Name, [string]$Method, [string]$Url, [hashtable]$Headers = @{}, [string]$Body)
    Write-Output "`n=== $Name ==="
    $args = @('-sS', '-X', $Method, '-H', 'Content-Type: application/json', '-w', "`nHTTP_STATUS:%{http_code}", "$BaseUrl$Url")
    if ($Headers.Authorization) { $args += @('-H', "Authorization: $($Headers.Authorization)") }
    $bodyFile = $null
    if ($Body) {
        $bodyFile = Join-Path $env:TEMP 'recipemaster-aula13-body.json'
        Set-Content -Path $bodyFile -Value $Body -Encoding utf8
        $args += @('--data-binary', "@$bodyFile")
    }
    & curl.exe @args
    if ($bodyFile) { Remove-Item -LiteralPath $bodyFile -Force -ErrorAction SilentlyContinue }
}

Invoke-ApiTest 'Criar sem token (401)' 'POST' '/collections' @{} '{"title":"Minha coleção"}'
Invoke-ApiTest 'Título curto (400)' 'POST' '/collections' $headersA '{"title":"ab"}'
Invoke-ApiTest 'Título só com espaços (400)' 'POST' '/collections' $headersA '{"title":"   "}'
Invoke-ApiTest 'isPublic inválido (400)' 'POST' '/collections' $headersA '{"title":"Coleção de teste","isPublic":"sim"}'
Invoke-ApiTest 'Criar privada (201)' 'POST' '/collections' $headersA '{"title":"Coleção privada","description":"Teste da aula"}'
Invoke-ApiTest 'Criar pública (201)' 'POST' '/collections' $headersA '{"title":"Coleção pública","isPublic":true}'
Invoke-ApiTest 'Listar minhas coleções' 'GET' '/my-collections' $headersA
Invoke-ApiTest 'Adicionar receita (201 ou 404)' 'POST' "/collections/$CollectionId/recipes" $headersA (@{ recipeId = $RecipeId } | ConvertTo-Json)
Invoke-ApiTest 'Repetir adição (200)' 'POST' "/collections/$CollectionId/recipes" $headersA (@{ recipeId = $RecipeId } | ConvertTo-Json)
Invoke-ApiTest 'Adicionar receita inexistente (404)' 'POST' "/collections/$CollectionId/recipes" $headersA '{"recipeId":99999}'
Invoke-ApiTest 'Adicionar com id inválido (400)' 'POST' "/collections/$CollectionId/recipes" $headersA '{"recipeId":"abc"}'
Invoke-ApiTest 'Status das coleções da receita' 'GET' "/recipes/$RecipeId/collections-status" $headersA
Invoke-ApiTest 'Coleção pública sem token' 'GET' "/collections/$CollectionId"
Invoke-ApiTest 'Coleção privada por outra conta (403)' 'GET' "/collections/$CollectionId" $headersB
Invoke-ApiTest 'Remover receita' 'DELETE' "/collections/$CollectionId/recipes/$RecipeId" $headersA
Invoke-ApiTest 'Remover novamente (404)' 'DELETE' "/collections/$CollectionId/recipes/$RecipeId" $headersA
Invoke-ApiTest 'Coleção inexistente (404)' 'GET' '/collections/99999'
Invoke-ApiTest 'Coleção com id inválido (400)' 'GET' '/collections/abc'
Invoke-ApiTest 'Busca sem termo' 'GET' '/search'
Invoke-ApiTest 'Busca com uma letra' 'GET' '/search?q=a'
Invoke-ApiTest 'Busca com curingas escapados' 'GET' '/search?q=%25%25'
Invoke-ApiTest 'Busca por receita' 'GET' '/search?q=bolo'
Invoke-ApiTest 'Busca com query repetida' 'GET' '/search?q=ab&q=cd'
Invoke-ApiTest 'Regressão feed' 'GET' '/feed' $headersA
Invoke-ApiTest 'Regressão id de usuário inválido' 'GET' '/users/abc/followers' $headersA
