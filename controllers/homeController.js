const mongoose = require('mongoose');
const Post = mongoose.model('Post');


// Middlware

// exports.userMiddleware = (req, res, next) =>{
//     let info = {name:'Andersson', id:12}
//     req.userInfo = info;
//     next();
// }


exports.index = async (req, res) => {
    let responseJson = {
        pageTitle: 'HOME',
        posts:[]
    };

    const posts = await Post.find();
    responseJson.posts = posts;

    res.render('home', responseJson)
}


