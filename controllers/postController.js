const mongoose = require('mongoose');
const { post } = require('../app');
const Post = mongoose.model('Post')

exports.add = (req, res) => {
    res.render('postAdd');
}

exports.addAction = async (req, res) => {
    const post = new Post(req.body);

    try {
        await post.save();
    } catch (error) {
        req.flash('error', 'Erro:' + error.message);
        return res.redirect('/post/add');
    }


    req.flash('success', 'Post salvo com sucesso');

    res.redirect('/');

};

exports.edit = async (req, res) => {
    //1. PEgar as informações  do post em questão
    const post = await Post.findOne({ slug: req.params.slug });
    //2. Carregar o formulário de edição
    res.render('postEdit', { post });
};

exports.editAction = async (req, res) => {
    //Procurar o item enviado 
    const post = await Post.findOneAndUpdate(
        {slug: req.params.slug},
        req.body,
        {
            new: true, //Retonar novo item atualizado 
            runValidators: true
        }
    );
    req.flash('success', 'Post atualizado com sucesso ');
    
    // Redirecionar para home
    res.redirect('/');
};