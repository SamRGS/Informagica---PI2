//Cria a constante de nome sqlite3 que vai armazenar o que for retornado da função require. 
const sqlite3 = require('sqlite3').verbose(); 

//Cria a constante de nome database que vai receber o arquivo de banco de dados SQLite.
const database = new sqlite3.Database('./databaseinformagica'); 

//Usa a constante database que está recebendo o arquivo databaseinformagica. O serialize garante que todas as funções SQL dentro do bloco sejam executadas respeitando a ordem. 
database.serialize(() => { 

//Executa os comandos SQL    
    database.run(`CREATE TABLE IF NOT EXISTS cadastro (
        Nome TEXT NOT NULL, 
        CPF INTEGER NOT NULL, 
        ID INTEGER PRIMARY KEY AUTO INCREMENT, 
        Login TEXT NOT NULL, 
        Senha NUMERIC NOT NULL )`);
}); 

//Cria e exporta um modulo database que poderá ser chamado no server.js 
module.exports = database; 
