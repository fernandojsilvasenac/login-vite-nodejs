const express = require("express");
var cors = require('cors');
const app = express();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { validaToken } = require('./middlewares/auth');
const User = require('./models/User');
const Categories = require('./models/Categories');
const Products = require('./models/Products');

const router = require('./routes/index');

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization")
    app.use(cors());
    next();
});

app.get("/", function (request, response) {
    response.send("Serviço API Rest iniciada...");
})

app.use(router);


// app.get("/validatoken", validaToken, async (req, res) => {
//     await User.findByPk(req.userId, { attributes: ['id', 'name', 'email'] })
//         .then((user) => {
//             return res.json({
//                 erro: false,
//                 user
//             });
//         }).catch(() => {
//             return res.status(400).json({
//                 erro: true,
//                 mensagem: "Erro: Necessário realizar o login para acessar a página!"
//             });
//         });

// });

app.listen(3032, () => {
    console.log("Servidor iniciado na porta 3032: http://localhost:3032");
});