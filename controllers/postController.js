const mongoose = require('mongoose');
const slug = require('slug');
const Post = mongoose.model('Post');

exports.view = async (req, res) => {
    const post = await Post.findOne({ slug:req.params.slug });
    res.render('view', { post });
};

exports.add = (req, res) => {
    res.render('postAdd');
};

exports.addAction = async (req, res) => {
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());
    req.body.author = req.user._id;
    const post = new Post(req.body);

    try {
        await post.save();
    } catch(error) {
        req.flash('error', 'Ocorreu um erro! Tente novamente mais tarde');
        return res.redirect('/post/add');
    }

    req.flash('success', 'Post salvo com sucesso!');
    res.redirect('/');
};

exports.edit = async (req, res) => {
    const post = await Post.findOne({ slug:req.params.slug });
    res.render('postEdit', { post });
};

exports.editAction = async (req, res) => {
    req.body.slug = slug(req.body.title, {lower:true});
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());
    
    try {
        const post = await Post.findOneAndUpdate(
            { slug:req.params.slug },
            req.body,
            {
                new:true, // Retornar NOVO item atualizado
                runValidators:true
            }
        );
    } catch(error) {
        req.flash('error', 'Ocorreu um erro! Tente novamente mais tarde');
        return res.redirect('/post/'+req.params.slug+'/edit');
    };

    req.flash('success', 'Post atualizado com sucesso!');

    res.redirect('/');
};

module.exports.canEdit = async (req, res, next) => {
    const post = await Post.findOne({slug:req.params.slug}).exec();

    if(post) {
        if(post.author.toString() == req.user._id.toString()) {
            next();
            return;
        }
    }

    req.flash('error', 'Você não tem permissão de editar este post.');
    res.redirect('/');
    return;
};