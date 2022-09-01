const express = require("express");
var cors = require('cors');
const app = express();

/********* Trabalhar com arquivos FS file system ****************/
const fs = require('fs');

/***** Caminho de pasta Path ******/
const path = require('path');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { validaToken } = require('./middlewares/auth');
const User = require('./models/User');
const Categories = require('./models/Categories');
const Products = require('./models/Products');

const router = require('./routes/index');

app.use(express.json());

// caminho para pasta de upload
app.use('/files', express.static(path.resolve(__dirname, "public", "upload")))

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

app.listen(3032, () => {
    console.log("Servidor iniciado na porta 3032: http://localhost:3032");
});