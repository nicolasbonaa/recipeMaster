# Executa os testes reais da Parte A.
# O script principal fica no backend para também ser chamado por npm.
& (Join-Path $PSScriptRoot '..\..\..\backend-recipemaster\scripts\teste-aula-11.ps1')
exit $LASTEXITCODE
