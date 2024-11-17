require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Personagem = require('./models/Ficha.js');
const {registrarUsuario} = require('./controllers/usuarioController.js');
const Usuario = require('./models/Usuario.js');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

// Autenticar, fazer login e criar fichas
const autenticarUsuario = (req,res,next) => {
  const token = req.cookies.tokenAcesso;


if (!token) {
  return res.redirect('/login');
}

try{
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  next();
} catch (error){
  console.error('Erro ao verificar o token:', error);
  return res.redirect('/login');
}
};

const loginUsuario = async (req, res) =>{
  const{email,senha} = req.body;

  try{
    const usuario = await Usuario.findOne({email});
    if(!usuario){
      return res.status(401).json({mensagem:'Email não encontrado.'});
    }
    const senhaCorreta = await usuario.comparePassword(senha);
    if(!senhaCorreta){
      return res.status(401).json({mensagem:'Senha incorreta.'});
    }
    const tokenAcesso = jwt.sign({id: usuario._id}, process.env.JWT_SECRET, {expiresIn:'15m'});
    const tokenAtualizacao = jwt.sign({id: usuario._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.cookie('tokenAcesso', tokenAcesso, {httpOnly: true, secure:true, sameSite:'Strict' });
    res.status(200).json({
      mensagem: 'Login realizado com sucesso!!!',
      tokenAcesso,
      tokenAtualizacao
    });
  } catch(error){
    console.error(error);
    if (!res.headersSent){
      return res.status(500).json({erro: 'Erro o processar a solicitação'});
    }
  }
};

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

  console.log('MONGO_URI:', MONGO_URI);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


app.post('/Ficha.js', async (req, res) => {
  const novoPersonagem = new Personagem(req.body);
  try{
    await novoPersonagem.save();
    res.status(201).send(novoPersonagem);
} catch (error) {
  res.status(400).send(error);
}
});
app.get('c', async (req,res) => {
  try{
    const Personagens = await Personagem.find();
    res.status(200).send(Personagens)
  } catch (error){
    res.status(500).send(error);
  }
});
app.get('/Ficha.js/:id', async (req,res) => {
  const {id} = req.params;
  try{
    const personagem = await Personagem.findById(id);
    if(!personagem){
      return res.status(404).send('Personagem não encontrado');
    }
    res.status(200).send(personagem);
  } catch (error){
    res.status(500).send(error);
  }
});

app.delete('/Ficha.js/:id', async (req, res) => {
  const {id} = req.params;
  try{
    const deletarPersonagem = await Personagem.findByIdAndDelete(id);
    if(!deletarPersonagem){
      return res.status(404).send('Personagem não encontrado');
    }
    res.status(200).send('Personagem excluído com sucesso');
  } catch (error){
    res.status(500).send(error);
  }

});

app.post('/renovar-token', (req,res) => {
  const {tokenAtualizacao} = req.body;

  if(!tokenAtualizacao){
    return res.status(401).json({erro:'Token de atualização é necessário.'})
  }

  try{
    const payload = jwt.verify(tokenAtualizacao, process.env.JWT_SECRET);
    const novoTokenAcesso = jwt.sign({id:payload.id},process.env.JWT_SECRET, {expiresIn:'15m'});
    res.status(200).json({tokenAcesso: novoTokenAcesso});
  } catch(error){
    res.status(403).json({erro: 'Token de atualização inválido ou expirado'});
  }

})

app.get('/rota-protegida', autenticarUsuario, (req,res) => {
  res.status(200).json({mensagem:'Acesso autorizado'});

});

app.post('/logout', (req,res) =>{
  res.clearCookie('tokenAcesso', {httpOnly: true, secure: true, sameSite:'Strict'});
  res.status(200).json({mensagem:'Logout realizado com sucesos'});
});

app.post('/registrar', registrarUsuario);

app.post('/login', async (req,res,next) => {
  console.log('Solicitação de login recebida');
  await loginUsuario(req, res);
}, loginUsuario);



//Rota para frontend
app.get('/', (req,res)=>{
  res.render('index');
});

// Login e Registro

app.get('/login', (req,res) => {
  res.render('login');
});

app.get('/registrar', (req,res) => {
  res.render('registrar');
});

app.get('/configuracoes-usuario', autenticarUsuario, (req,res) => {
  res.render('configuracoes_usuario');
});

app.get('/fichas', (req,res) => {
  res.render('fichas');
});

app.get('/campanhas', (req,res) => {
  res.render('campanhas');
});

app.get('/arkaminos', (req,res) => {
  res.render('arkaminos');
})