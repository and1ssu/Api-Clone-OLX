const app = require('./app')
const mongoose = require('mongoose');

require('dotenv').config({path:'variables.env'})

//Conexão MongoDB
mongoose.connect(process.env.DATABASE, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('errro', (error) => {
    console.log("ERRO:" + error.mensage);
});

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () =>{
    console.log("Servidor Rodando na Porta: " +server.address().port); 
});
