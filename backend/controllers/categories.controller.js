const Categories = require('../models/Categories');


exports.findAll = async (req, res) => {
    await Categories.findAll({
        attributes: ['id', 'name', 'description'],
        order:[['name', 'ASC']]
    })
    .then( (categories) =>{
        return res.json({
            erro: false,
            categories
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhuma Categoria encontrado!!!`
        })
    })
}

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try {
        // await Categories.findAll({ where: {id: id}})
        const categories = await Categories.findByPk(id);
        if(!categories){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhuma Categoria encontrado!"
            })
        }
        res.status(200).json({
            erro:false,
            categories
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

    await Categories.create(dados)
    .then( ()=>{
        return res.json({
            erro: false,
            mensagem: 'Categoria cadastrada com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Categoria não cadastrada... ${err}`
        })
    })
};

exports.update = async (req, res) => {
    const { id } = req.body;

    await Categories.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Categoria alterada com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Categoria não alterada ...${err}`
        })
    })
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    await Categories.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Categoria apagada com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Categoria não apagada...`
        });
    });
};
