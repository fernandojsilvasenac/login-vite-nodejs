const Products = require('../models/Products');
const Categories = require('../models/Categories');

exports.findAll = async (req, res) => {
    await Products.findAll({
        attributes: ['id', 'name', 'description', 'quantity', 'price', 'categorieId'],
        order:[['name', 'ASC']],
        include:[Categories]
    })
    .then( (products) =>{
        return res.json({
            erro: false,
            products
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhuma Produtos encontrado!!!`
        })
    })
}

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try {
        // const products = await Products.findByPk(id);
        const products = await Products.findAll({ 
            where: {id: id},
            include:[Categories]
        })
        if(!products){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhuma Produtos encontrado!"
            })
        }
        res.status(200).json({
            erro:false,
            products
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
};

exports.create = async (req, res) => {
    var dados = req.body;

    await Products.create(dados)
    .then( ()=>{
        return res.json({
            erro: false,
            mensagem: 'Produtos cadastrada com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Produtos não cadastrada... ${err}`
        })
    })
};

exports.update = async (req, res) => {
    const { id } = req.body;

    await Products.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Produtos alterada com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Produtos não alterada ...${err}`
        })
    })
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    await Products.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Produtos apagada com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Produtos não apagada...`
        });
    });
};
