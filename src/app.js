const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

/* Array das Postagens */
const repositories = [];

/*Rota das Postagens */
app.get("/repositories", (request, response) => {
  // Listagem
  // Retorna todos os Objetos criados
  return response.json( repositories );
});

app.post("/repositories", (request, response) => {
   // Criação

   // Variável com os parâmetros do repositório 
   const { title, url, techs } = request.body;
   // Variável do repositório
   const repository = {
     id: uuid(),
     title,
     url,
     techs,
     likes: 0,
   }
   // Empurra o Objeto com Parametro da variável const repository
   repositories.push( repository );

   // Retorna o json com o Obejto criado
   return response.json( repository );

});

app.put("/repositories/:id", (request, response) => {
   // Modificação
  
   // Variável com os parâmetros do repositório 
   const { title, url, techs } = request.body;

   // Variável com Id do repositório informado
   const { id } = request.params;   

   // Variável que verifica se Id informado é igual o id do repositório
   const findRepositoryIndex = repositories.findIndex( 
     repository => repository.id == id );

     if( findRepositoryIndex < 0 ){
       // Imprimi a mensagem de erro com o status 400
       return response.status( 400 ).json( {error: 'Repositório inexistente!'} );
     } 
    
     else {

       // Substituir pelo novo dados
       repositories[findRepositoryIndex] = {
         id, //Mantém o mesmo Id
         // Se o parâmetro existir use-o, se não use o parâmetro antigo
         title: title ? title : repositories[findRepositoryIndex].title, 
         url: url ? url : repositories[findRepositoryIndex].url,
         techs: techs ? techs : repositories[findRepositoryIndex].techs,
        
         // Os likes não se alteram
         likes: repositories[findRepositoryIndex].likes 
       }
     }

     //Feito as modificações, retorna-se o repositório atualizado
     return response.json(repositories[findRepositoryIndex]);

});

 app.delete("/repositories/:id", (request, response) => {
   // Remoção
   // Variável com Id do repositório informado
   const { id } = request.params;
  
   // Variável que verifica se Id informado é igual o id do repositório
   const findRepositoryIndex = repositories.findIndex( 
     repository => repository.id == id );

   // Verifica se a Variável encontrada é maior que zero
   // Se condição for verdadeira  
   if( findRepositoryIndex >= 0 ){   
     // Remove o Objeto encontrado, neste caso, apenas 1  
     repositories.splice( findRepositoryIndex, 1 )
   }
   // Se a condição não for verdadeira
   else {
     // Imprimi a mensagem de erro com o status 400
     return response.status( 400 ).json( {error: 'Repositório inexistente!'} );
   }

   // Se a condição for verdadeira responde com status de código 204 e uma resposta vazia
   return response.status( 204 ).send();
});


app.post("/repositories/:id/like", (request, response) => {
   // Likes

  // Variável com Id do repositório informado
  const { id } = request.params;
  
  // Variável que verifica se Id informado é igual o id do repositório
  const findRepositoryIndex = repositories.findIndex( 
     repository => repository.id == id );
    
    if( findRepositoryIndex < 0 ){
      // Imprimi a mensagem de erro com o status 400
      return response.status( 400 ).json( {error: 'Repositório inexistente!'} );
    }
     
      // Adiciona mais uma like
      repositories[findRepositoryIndex].likes += 1;

      //Feito as modificações, retorna-se o repositório atualizado
      return response.json(repositories[findRepositoryIndex]);

});

module.exports = app;
