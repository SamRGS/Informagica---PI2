const express = require('express'); 
const bodyParser = require('body-parser'); 
const database = require('./database'); 
const app = express(); 
const PORT = 3000; 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})); 

//Get
app.get('/cadastro', (req, res) => { 
    database.all('SELECT * FROM cadastro', (err, rows) => { 
        if(err) return res.status(500).json({erro: err.message}); 
        res.json(rows); 
    });
});


//Post
app.post('/cadastro', (req, res) => { 
    const {Nome, CPF, ID, Login, Senha} = req.body; 
    if(!Nome || !CPF) {
        return res.status(400).json({erro: 'Os campos "Nome" e "CPF" são obrigatórios'});
    }
    
    const query = `INSERT INTO cadastro (Nome, CPF, ID, Login, Senha) VALUES (?, ?, ?, ?, ?)`; 
    database.run(query, [Nome, CPF, ID, Login, Senha], function (err) { 
        if(err) return res.status(500).json({erro: err.message}); 
        res.status(201).json({ID: this.lastID, Nome, CPF, Login, Senha}); 
    });
});


//Put
app.put('/cadastro/:ID', (req, res) => { 
    const{ID} = req.params; 
    const{Nome, CPF, Login, Senha} = req.body; 

    const query = `UPDATE cadastro SET Nome = ?, CPF = ?, Login = ?, Senha = ? WHERE ID = ?`; 
    database.run(query, [Nome, CPF, Login, Senha, ID], function (err) { 
        if(err) return res.status(500).json({erro: err.message}); 
        if(this.changes === 0) return res.status(404).json({erro: 'Cadastro não encontrado'}); 
        res.json({ID, Nome, CPF, Login, Senha});

    }); 
});

//Delete
app.delete('/cadastro/:id', (req, res) => { 
    const{ID} = req.params; 
    database.run(`DELETE FROM cadastro WHERE ID = ?`, [ID], function (err){ 
        if(err) return res.status(500).json({erro: err.message}); 
        if(this.changes === 0) return res.status(404).json({err: 'Cadastro não encontrado'}); 
        res.json({mensagem: 'Cadastro excluido com sucesso'}); 
    });
});


//Iniciar o servidor 
app.listen(PORT, () => { 
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
