const User = require('../models/User');
const crypto = require('crypto');
const mailHandler = require('../Handlers/mailHandler')



exports.login = (req, res) => {
    res.render('login');
};

exports.loginAction = (req, res) => {
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result) => {
        if(!result) {
            req.flash('error', 'Seu e-mail e/ou senha estão errados!');
            res.redirect('/users/login');
            return;
        }

        req.login(result, ()=>{});

        req.flash('success', 'Você foi logado com sucesso!');
        res.redirect('/');
    });
};

exports.register = (req, res) => {
    res.render('register');
};

exports.registerAction = (req, res) => {
    const newUser = new User(req.body);
    User.register(newUser, req.body.password, (error)=>{
        if(error) {
            req.flash('error', 'Ocorreu um erro, tente mais tarde.');
            res.redirect('/users/register');
            return;
        }
        
        req.flash('success', 'Registro efetuado com sucesso. Faça o login.');
        res.redirect('/users/login');
    });
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.profile = (req, res) => {
    res.render('profile');
};

exports.profileAction = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id:req.user._id },
            { name:req.body.name, email:req.body.email },
            { new:true, runValidators:true }
        );
    } catch(e) {
        req.flash('error', 'Ocorreu algum erro: '+e.message);
        res.redirect('/profile');
        return;
    }

    req.flash('success', 'Dados atualizados com sucesso!');
    res.redirect('/profile');
};

exports.forget = (req, res) => {
    res.render('forget');
};


exports.forgetAction = async (req, res) => {
   // Verifica se o Usuario existe
   const user = await User.findOne({email:req.body.email}).exec();

   if(!user){
       req.flash('error', 'Email não cadastrado');
       res.redirect('/user/forget');
       return;
   }
   // gera token e salva no banco

   user.resetPassowrdToken = crypto.randomBytes(20).toString('hex');
   user.resetPassowrdExpires = Date.now() +36000000;
   await user.save();


   // gerar link com token 
   const resetLink = `http:${req.headers.host}/users/reset/${user.resetPassowrdToken}`

    // envia linl por email

   const to = `${user.name} <${user.email}>` 
   const html = `Testando email com link:<br/><a href="${resetLink}">Resetart sua senha</a>`
   const text = ` Testando email com link: ${resetLink}`
    mailHandler.send({
        to,
        subject:'Resetar sua senha', 
        html,
        text

    })

   req.flash('success', 'Email enviado com instruções ');
   res.redirect('/users/login');
  
   
};

exports.forgetToken = async (req,res) => {
    const user = await User.findOne({
        resetPassowrdToken: req.params.token,
        resetPassowrdExpires: {$gt: Date.now()}
    }).exec();

    if(!user) {
        req.flash('error', 'Token expirado');
        res.redirect('/users/forget');
        return;
    }
    res.render('forgetPassword')
};

exports.forgetTokenAction = async (req,res) => {
    const user = await User.findOne({
        resetPassowrdToken: req.params.token,
        resetPassowrdExpires: {$gt: Date.now()}
    }).exec();

    if(!user) {
        req.flash('error', 'Token expirado');
        res.redirect('/users/forget');
        return;
    }

    if(req.body.password != req.body['password-confirm']) {
        req.flash('error', 'Senhas não batem');
        res.redirect('back');
        return;
    }

    user.setPassword(req.body.password, async ()=>{
        await user.save();

        req.flash('success', 'Senha alterada com sucesso!');
        res.redirect('/');
    });
}