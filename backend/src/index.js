const cors = require("cors");
const userModel = require('./models/user');

async function startup() {
    const sequelize = require('./database/index');
    const User = require('./models/user');
    try { //Como a operação no BD é assíncrona, precisamos usar o "await".
        await sequelize.sync(); //O comando sync vai verificar os modelos que existem no projeto para com as
                                //tabelas existentes no BD, garantindo que os dois estejam iguais.     
        console.log('Success');

    } catch (err) {
        console.log(err);
    }
}

startup();

const express = require('express'); // importa o express
//const { where } = require("sequelize/types");
const server = express(); // cria uma variável chamada server que chama a função express
server.use(express.json()); // faz com que o express entenda JSON
server.use(cors());
const users = []; // As informações ficarão armazenadas dentro deste array []


//Middleware GLOBAL, isto é, será chamado em todas as rotas.
server.use((req, res, next) => { // server.use cria o middleware global
    console.time('Request'); // marca o início da requisição
    console.log(`Method: ${ req.method }; URL: ${ req.url }`); // retorna qual o método e url foi chamada

next(); // função que chama as próximas ações

console.log('Finalizou'); // será chamado após a requisição ser concluída

console.timeEnd('Request'); // marca o fim da requisição
    });


//Middleware LOCAL, será chamado quando o invocarmos na rota especificamente.    
function checkNameUser(req, res, next) {
    if (!req.body.name) {
        return res.status(422).json({ error: 'User name is required' });
        // middleware local que irá checar se a propriedade name foi informada corretamente,
        // caso negativo, irá retornar um erro 422 – UNPROCESSABLE ENTITY
    }
    return next(); // se o nome for informado corretamente, a função next() chama as próximas ações
}
async function checkUserInArray(req, res, next) {
    const user = await userModel.findOne({where: {id: req.params.index}});
    if (!user) {
        return res.status(400).json({ error: 'User does not exists' });
    } // checa se o User existe no array, caso negativo informa que o index não existe no array

    req.user = user;

    return next();
}

//Rotas (endpoints) RESTful:

//READ (List) all the Users
server.get('/users', async(req, res) => {
    const users = await userModel.findAll(); //Traz os usuários do BD
    return res.json(users);
}); // Cria a rota /users com o método GET, para listar todos os users.

//READ (List) only one User 
server.get('/users/:index', checkUserInArray, async(req, res) => {
    const index = req.params.index;
    const user = await userModel.findOne({where: {index}});
    return res.json(user);
});

//CREATE User
server.post('/users', checkNameUser, async(req, res) => {
    const { name, email, password } = req.body; // assim esperamos buscar o name informado dentro do body da requisição
    const user = await userModel.create(
        {name, email, password}
    );

    return res.json(user); // retorna a informação da variável users
});

//UPDATE User
server.put('/users/:index', checkUserInArray, checkNameUser, async(req, res) => {
    const { name, email, password } = req.body;
    const index = req.params.index; // recupera o index com os dados
    const userUpdate = await userModel.update(
        {name, email, password},
        {where: {id: index}}
    ); // sobrepõe o index obtido na rota de acordo com o novo valor

    return res.json(userUpdate); // retorna novamente os users atualizados após o update
});

//DELETE User
server.delete('/users/:index', checkUserInArray, async(req, res) => {
    const { index } = req.params; // recupera o index com os dados
    
    await userModel.destroy({where: {id: index}})

    return res.send(); // retorna os dados após exclusão
});

server.listen(3001); // faz com que o servidor seja executado na porta 3001 do seu localhost:3001