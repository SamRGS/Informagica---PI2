const sqlite3 = require('sqlite3').verbose(); 
const database = new sqlite3.Database('./databaseinformagica'); 

database.serialize(() => { 
    database.run(`CREATE TABLE IF NOT EXISTS cadastro (
        Nome TEXT NOT NULL, 
        CPF INTEGER NOT NULL, 
        ID INTEGER PRIMARE KEY AUTO INCREMENT, 
        Login TEXT NOT NULL, 
        Senha NUMERIC NOT NULL )`);
}); 

module.exports = database; 
