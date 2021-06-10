exports.userMiddleware = (req, res, next) =>{
    let info = {name:'Andersson', id:12}
    req.userInfo = info;
    next();
}


exports.index = (req, res) => {
    let obj = {
        pageTitle:'HOME',
        userInfo:req.userInfo
    };

    res.render('home', obj)
}


