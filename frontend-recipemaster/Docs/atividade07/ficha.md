# Ficha de preparacao - Atividade 07

| Dado | Seu valor |
| --- | --- |
| Nome do model da entidade principal | `Recipe` |
| Nome da tabela | `recipes` |
| Grupo | `B` |
| Campo do arquivo principal | `image` |
| Campo da capa | Nao se aplica ao Grupo B |
| Coluna de contagem no `User` | `recipesCount` |

## Decisoes

O Recipe Master menciona apenas o upload de novas receitas com imagens. Por isso, a imagem e o conteudo principal e nao existe uma capa separada. A rota usa `multer.single('image')`.

A associacao foi centralizada em `backend-recipemaster/config/associations.js`: `User.hasMany(Recipe)` e `Recipe.belongsTo(User)`. Isso informa ao Sequelize como montar a FK e os includes. Centralizar evita que os models precisem importar uns aos outros durante a inicializacao, reduzindo o risco de referencia circular.

O `onUploadProgress` recebe um evento Axios com `loaded` e `total`. A porcentagem exibida e calculada por `Math.round((loaded * 100) / total)`.
