const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/********* Trabalhar com arquivos FS file system ****************/
const fs = require('fs');


exports.findAll = async (req, res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email', 'password', 'image'],
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
};

exports.findOne = async (req, res) => {
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
};

exports.create = async (req, res) => {
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
};

exports.update = async (req, res) => {
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
};

exports.changepassword = async (req, res) => {
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
};

exports.delete = async (req, res) => {

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
};

exports.login = async (req, res) => {

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
        token,
        user: user.id
    });
};

exports.validaToken = async (req, res) => {

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

};

exports.editProfileImage = async (req, res) => {
    if(req.file){
        console.log(req.file);

        await User.findByPk(req.userId)
        .then( user =>{
            console.log(user);
            const imgOld = './public/upload/users/' + user.dataValues.image

            fs.access(imgOld, (err) =>{
                if(!err){
                    fs.unlink(imgOld, () =>{})
                }

            })

        }).catch( (err) =>{
            return res.status(400).json({
                erro: true,
                mensagem: `Erro: Perfil do Usuário não encontrado! ${err}`
            })
        })


        await User.update({image: req.file.filename}, 
            {where: {id: req.userId}})
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Imagem do Usuário editada com sucesso!",
                image: process.env.URL_IMG + '/files/users' + req.file.filename                
            })
        }).catch( () =>{
            return res.status(400).json({
                erro: true,
                mensagem: `Erro: Imagem não editada...`,
            })
        })        

        
    } else {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Selecione uma imagem válida (.png, .jpg) !"
        })
    }
}

exports.viewProfile = async (req, res) => {    
    const { id } = req.params;
    try {
        // await User.findAll({ where: {id: id}})
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário encontrado!"
            })
        }
        if(users.image){
            var endImagem = process.env.URL_IMG + "/files/users/"+ users.image;
        } else {
            var endImagem = "";
        }
        res.status(200).json({
            erro:false,
            users,
            endImagem
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
}