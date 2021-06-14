const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.index = async (req, res)=>{
    let responseJson = { 
        pageTitle:'HOME',
        posts:[],
        tags:[],
        tag:''
    };

    responseJson.tag = req.query.t;
    const postFilter = (typeof responseJson.tag != 'undefined') ? {tags:responseJson.tag}: {};

    const tagsPromise = Post.getTagsList();
    const postsPromise = Post.find(postFilter).populate('author');

    const [ tags, posts ] = await Promise.all([ tagsPromise, postsPromise ]);

    for(let i in tags) {
        if(tags[i]._id == responseJson.tag) {
            tags[i].class = "selected";
        }
    }

    if(req.isAuthenticated()) {
        for(let i in posts) {
            if(posts[i].author._id.toString() == req.user._id.toString()) {
                posts[i].canEdit = true;
            }
        }
    }

    responseJson.tags = tags;
    responseJson.posts = posts;

    res.render('home', responseJson);
}