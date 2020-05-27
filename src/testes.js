// importando as bibliotecas
const express = require('express');

// criando o servidor
const server = express();

server.use(express.json()); // aceitar json

// Tipos de parametros
// query = ?id=1 => req.query.id
// route params = user/1 
//     user/:id? => req.params.id
// request body = {"name": "Rodrigo Lopes", "idade": "35" } => req.body

let users = ['Rodrigo', 'Fernando', 'Karyna', 'Vinicius', 'Maikcon']

server.use((req, res, next) => {
  console.log(`metodo: ${req.method}, Url: ${req.url}` );
  return next();
})

// rotas
server.get('/', (req, res) => {
  return res.json({message: 'Server UP'});
});

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/user/:id?', (req, res) => {
  const {id} = req.params;
  return res.json(users[id]);
});

server.post('/user/', (req, res) => {
  const {name} = req.body;
  users.push(name);
  return res.json(users);
});

server.put('/user/:id?', (req, res) => {
  const {id} = req.params;
  const {name} = req.body; 

  users[id] = name;

  return res.json(users);
});

server.delete('/user/:id', (req, res) => {
  const {id} = req.params;
  users.splice(id, 1);

  return res.json(users);
});

// startando o servidor
server.listen(3000);