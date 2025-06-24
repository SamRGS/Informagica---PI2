//Importa o modulo express 
const express = require('express'); 

//Importa o modulo body-parser - Permite que o POST seja enviado via JSON
const bodyParser = require('body-parser'); 

//Importa o database.js que vai permitir acesso ao banco de dados via sqlite3
const database = require('./database'); 

//Cria a instância da aplicação express
const app = express(); 

//Define a porta que o servidor vai rodar
const PORT = 3000; 

//Interpreta requisições em JSON
app.use(bodyParser.json()); 

//Faz a leitura de formulário HTML
app.use(bodyParser.urlencoded({extended: true})); 

//Get - Define uma rota http para o metodo GET em http://localhost:3000/cadastro  - req = request e res = response
app.get('/cadastro', (req, res) => { 

//Executa uma consulta no banco de dados e retorna todos os resutltados.
    database.all('SELECT * FROM cadastro', (err, rows) => { 

//Se houver erro na consulta no banco de dados, será retornado um erro para o usuário (erro 500)
        if(err) return res.status(500).json({erro: err.message}); 

//Se não houver erro irá retornar as linhas com os resultados da pesquisa        
        res.json(rows); 
    });
});


//Post - Define uma rota http para o metodo POST - req = request e res = response 
app.post('/cadastro', (req, res) => { 

//Pega os dados enviados via JSON e transforma em req.body
    const {Nome, CPF, ID, Login, Senha} = req.body; 

//Se os campos Nome ou CPF estiverem vazios, irá retornar um erro para o usuário informando que os campos são obrigatórios
    if(!Nome || !CPF) {
        return res.status(400).json({erro: 'Os campos "Nome" e "CPF" são obrigatórios'});
    }

//Cria uma query para inserir informações dentro do banco de dados
    const query = `INSERT INTO cadastro (Nome, CPF, ID, Login, Senha) VALUES (?, ?, ?, ?, ?)`; 

//Executa a query definida no banco de dados 
    database.run(query, [Nome, CPF, ID, Login, Senha], function (err) { 

//Se houver algum irá retornar para o usuário uma mensagem informando
        if(err) return res.status(500).json({erro: err.message}); 

//Se a execução da query for bem sucedida irá retornar o codigo 201, informando que foi criado com sucesso
        res.status(201).json({ID: this.lastID, Nome, CPF, Login, Senha}); 
    });
});



//Put - Define uma rota HTTP para o metodo PUT em http://localhost:3000/cadastro/:ID - req = require e res = response
app.put('/cadastro/:ID', (req, res) => { 

//Pega o ID que sera consultado. Ex: ID = 5 localhost:3000/cadastro/5    
    const{ID} = req.params; 

//Extrai os dados enviados via JSON
    const{Nome, CPF, Login, Senha} = req.body; 

//Query SQL que vai realizar a atualização do cadastro de acordo com o ID
    const query = `UPDATE cadastro SET Nome = ?, CPF = ?, Login = ?, Senha = ? WHERE ID = ?`; 

//Vai executar a query SQL no banco de dados 
    database.run(query, [Nome, CPF, Login, Senha, ID], function (err) { 

//Se houver algum erro, irá retornar ao usuário como erro 500. 
        if(err) return res.status(500).json({erro: err.message}); 

//Se o ID não for encontrado no banco de dados irá retornar o erro 404 ao usuário
        if(this.changes === 0) return res.status(404).json({erro: 'Cadastro não encontrado'}); 

//Se não houver erros, os novos dados serão atualizados dentro do banco de dados.
        res.json({ID, Nome, CPF, Login, Senha});

    }); 
});

//Delete - Define uma rota http para o metodo DELETE
app.delete('/cadastro/:id', (req, res) => { 

//Pega o ID que será excluido
    const{ID} = req.params; 

//Executa a query SQL para deletar o cadastro baseado no ID informado
    database.run(`DELETE FROM cadastro WHERE ID = ?`, [ID], function (err){ 

//Se houver algum erro na execução da query será informado ao usuário atraves do erro 500
        if(err) return res.status(500).json({erro: err.message}); 

//Se a consulta no banco de dados não encontrar o ID, sera informado ao usuário atraves do erro 404
        if(this.changes === 0) return res.status(404).json({err: 'Cadastro não encontrado'}); 

//Informa ao usuário que a operação foi bem sucedida 
        res.json({mensagem: 'Cadastro excluido com sucesso'}); 
    });
});


//Inicia o servidor pegando a porta que foi informando na const PORT
app.listen(PORT, () => { 
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
