const express = require("express");
var cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { validaToken } = require('./middlewares/auth');
const User = require('./models/User');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization")
    app.use(cors());
    next();
});

app.get("/users", validaToken, async (req, res) => {

    await User.findAll({
        attributes: ['id', 'name', 'email', 'password'],
        order: [['id', 'ASC']]
    })
        .then((users) => {
            return res.json({
                erro: false,
                users
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!"
            });
        });
});

app.get("/user/:id", validaToken, async (req, res) => {
    const { id } = req.params;

    //await User.findAll({ where: { id: id } })
    await User.findByPk(id)
        .then((user) => {
            return res.json({
                erro: false,
                user: user
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!"
            });
        });
});

app.post("/user", validaToken, async (req, res) => {
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);

    await User.create(dados)
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não cadastrado com sucesso!"
            });
        });
});

app.put("/user", validaToken, async (req, res) => {
    const { id } = req.body;

    await User.update(req.body, { where: { id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário editado com sucesso!"
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não editado com sucesso!"
            });
        });
});

app.put("/user-senha", validaToken, async (req, res) => {
    const { id, password } = req.body;

    var senhaCrypt = await bcrypt.hash(password, 8);

    await User.update({ password: senhaCrypt }, { where: { id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Senha editada com sucesso!"
            });

        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Senha não editada com sucesso!"
            });
        });
});

app.delete("/user/:id", validaToken, async (req, res) => {
    const { id } = req.params;

    await User.destroy({ where: { id } })
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuário apagado com sucesso!"
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não apagado com sucesso!"
            });
        });
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            email: req.body.email
        }
    });
    if (user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta!"
        });
    };

    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta!"
        });
    };

    var token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 600 // 10min
        // expiresIn: '7d', // 7 dia
    });

    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        token
    });
});

app.get("/validatoken", validaToken, async (req, res) => {
    await User.findByPk(req.userId, { attributes: ['id', 'name', 'email'] })
        .then((user) => {
            return res.json({
                erro: false,
                user
            });
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página!"
            });
        });

});

app.listen(4500, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:4500");
});