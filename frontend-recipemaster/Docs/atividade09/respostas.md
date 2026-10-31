# Respostas - Atividade 09

## 1. 401, 403 e 404

`401` significa que a pessoa nao esta autenticada ou enviou um token invalido. `403` significa que ela esta autenticada, mas nao tem permissao para aquela operacao. `404` significa que o recurso nao existe. A verificacao de existencia vem antes da verificacao de dono para nao tratar um item inexistente como se fosse um item real de outra pessoa e para manter a resposta correta para ids que nao existem.

## 2. Banco antes do disco

Ao excluir ou trocar uma imagem, o registro deve ser atualizado primeiro e o arquivo antigo depois. Assim, se o banco falhar, o arquivo ainda continua associado ao registro. Se o disco fosse alterado primeiro e o banco falhasse, poderiamos apagar a imagem que o registro ainda aponta ou deixar o banco apontando para um arquivo que ja nao existe.

## 3. Arquivo orfao

Arquivo orfao e um upload que ficou no disco sem um registro correspondente no banco. Neste projeto, isso pode acontecer quando uma imagem e enviada no `PUT` de uma receita de outra conta e a autorizacao retorna `403`, ou quando o titulo vazio faz a validacao retornar `400` depois que o Multer salvou a imagem. A limpeza acontece no `errorHandler`, que remove `req.file` quando a requisicao falha.

## 4. Excluir dentro de um link e modal dentro do card

O botao de excluir nao deve ficar dentro de um `<a>` porque sao comandos diferentes: clicar em excluir poderia navegar para o detalhe e gerar comportamento ambiguo. O modal deve ficar fora do card porque e uma camada de interface independente; dentro do card ele pode herdar overflow, posicionamento e eventos de clique do item.

## 5. Esconder Editar nao e seguranca

Esconder o botao melhora a interface, mas qualquer pessoa ainda pode chamar a API diretamente pelo navegador, curl ou Postman. A seguranca real esta no backend, que exige autenticacao e compara o `userId` do token com o dono da receita antes de editar ou excluir.
