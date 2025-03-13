require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require('./historiaarquipelagosite-firebase-adminsdk-ssrcb-14641a712f.json');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const Usuario = require('./models/Usuario');
const fichaRoutes = require('./routes/ficha.Routes');
const { admin, bucket } = require('./firebaseAdmin');
const Ficha = require('./models/Ficha');
const {
    registrarUsuario,
    loginUsuario,
    atualizarUsername,
    atualizarEmail,
    atualizarSenha,
    atualizarFotoPerfil,
    usuarioAtual
} = require('./controllers/usuarioController');
const fichaController = require('./controllers/fichaController'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware de Autenticação
const autenticarUsuario = (req, res, next) => {
    const token = req.cookies.tokenAcesso;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.session.userId = decoded.id;
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido'), false);
        }
    }
});

// Rotas

// Página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Rotas de Autenticação
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/registrar', (req, res) => {
    res.render('registrar');
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.json({ erro: 'Email não encontrado' });
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.json({ erro: 'Senha incorreta' });
        }
        const tokenAcesso = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('tokenAcesso', tokenAcesso, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.json({ mensagem: 'Login realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

app.post('/registrar', async (req, res) => {
    const { username, email, senha, confirmaSenha } = req.body;
    if (senha !== confirmaSenha) {
        return res.json({ erro: 'As senhas não coincidem' });
    }
    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = new Usuario({ username, email, senha: senhaHash });
        await novoUsuario.save();
        return res.json({ mensagem: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        if (error.code === 11000) {
            const campoDuplicado = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ erro: `${campoDuplicado.charAt(0).toUpperCase() + campoDuplicado.slice(1)} já está em uso` });
        }
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Configurações do Usuário
app.get('/configuracoes_usuario', autenticarUsuario, (req, res) => {
    res.render('configuracoes_usuario');
});

app.get('/usuario_atual', autenticarUsuario, usuarioAtual);

app.post('/atualizar_username', autenticarUsuario, atualizarUsername);
app.post('/atualizar_email', autenticarUsuario, atualizarEmail);
app.post('/atualizar_senha', autenticarUsuario, atualizarSenha);
app.post('/ficha/atualizar_foto_personagem/:fichaId', async (req, res) => {
    try {
        const { photoURL } = req.body;
        if (!photoURL) {
            return res.status(400).json({ erro: 'Nenhum link de foto fornecido.' });
        }
        await Ficha.findByIdAndUpdate(req.params.fichaId, { fotoPersonagem: photoURL });
        res.json({ caminho: photoURL, mensagem: 'Foto atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar foto:', error);
        res.status(500).json({ erro: error.message });
    }
});
app.post('/atualizar_foto_perfil', autenticarUsuario, upload.single('uploadFotodePerfil'), async (req, res) => {
    try {
        console.log('Iniciando upload da foto de perfil');
        if (!req.file) {
            console.log('Arquivo não encontrado');
            return res.status(400).json({ erro: 'Arquivo não encontrado' });
        }
        if (!req.file.mimetype.startsWith('image/')) {
            console.log('Arquivo não é uma imagem');
            return res.status(400).json({ erro: 'Por favor, envie um arquivo de imagem.' });
        }
        const filePath = `uploads/${uuidv4()}-${req.file.originalname}`;
        console.log(`Caminho do arquivo: ${filePath}`);

        const file = bucket.file(filePath);

        await file.save(req.file.buffer, {
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        console.log('Upload concluído');

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '01-01-2040',
        });
        console.log(`URL assinada: ${url}`);
        await Usuario.findByIdAndUpdate(req.userId, { fotoPerfil: url });
        res.json({ mensagem: 'Foto de perfil atualizada com sucesso!', caminho: url });
    } catch (error) {
        console.error('Erro ao atualizar foto de perfil:', error);
        res.status(500).json({ erro: 'Erro ao atualizar foto de perfil' });
    }
});

// Rotas das Fichas
app.get('/nova_ficha', autenticarUsuario, (req, res) => {
    res.render('nova_ficha');
});

app.post('/salvarFicha', autenticarUsuario, async (req, res) => {
    try{
        const fichaData = req.body;
        fichaData.userId = req.userId;

        const novaFicha = new Ficha(fichaData);
        await novaFicha.save();

        res.json({success: true, fichaId: novaFicha._id});
    } catch(error){
        console.error('Erro ao salvar a ficha:', error);
        res.status(500).json({ success: false, message: 'Erro ao salvar ficha'});
    }
})

app.post('/salvarRaca', autenticarUsuario, fichaController.salvarRaca);
app.post('/salvarClasse', autenticarUsuario, fichaController.salvarClasse);
console.log('Rota POST /salvarClasse definida');
app.post('/salvarOrigem', autenticarUsuario, fichaController.salvarOrigem);
app.post('/salvarArkamino', autenticarUsuario, fichaController.salvarArkamino);
app.use('/ficha', fichaRoutes);

app.get('/fichas', autenticarUsuario, async (req, res) => {
    try{
        const fichas = await Ficha.find({userId: req.userId}).lean();
        res.render('fichas', {fichas});
    } catch(error){
        console.error('Erro ao recuperar fichas:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.delete('/fichas/delete/:id', autenticarUsuario, async (req, res) => {
    const { id } = req.params;
    try {
        const fichaDeletada = await Ficha.findByIdAndDelete(id);
        if (!fichaDeletada) {
            return res.status(404).json({ erro: 'Ficha não encontrada' });
        }
        res.status(200).json({ mensagem: `Ficha ${id} deletada com sucesso.` });
    } catch (error) {
        console.error('Erro ao deletar ficha:', error);
        res.status(500).json({ erro: 'Erro ao deletar ficha' });
    }
});

// Outras Rotas
app.get('/campanhas', autenticarUsuario, (req, res) => {
    res.render('campanhas');
});

app.get('/arkaminos', autenticarUsuario, (req, res) => {
    res.render('arkaminos');
});


// Rota da Ficha

app.get('/ficha/:id', autenticarUsuario, async (req, res) => {
    const fichaId = req.params.id;

    try{
        const ficha = await Ficha.findById(fichaId).lean();

        if(ficha){
            const fichaPreparada = fichaController.prepararFicha(ficha);

            res.render('fichaTemplate', {
                ficha: fichaPreparada,
                listaPericias: fichaController.listaPericias,
                pvAtual: ficha.pontosDeVidaAtual,
                pvMaximo: ficha.pontosDeVidaMax,
                pmAtual: ficha.pontosDeManaAtual,
                pmMaximo: ficha.pontosDeManaMax,
                pontosDeVidaAtual: ficha.pontosDeVidaAtual,
                pontosDeManaAtual: ficha.pontosDeManaAtual
            });
        } else{
            res.status(404).send('Ficha não encontrada');
        }
    } catch(error){
        console.error('Erro ao recuperar a ficha:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/ficha/:id/dados', autenticarUsuario, async (req, res) => {
    const fichaId = req.params.id;
    try {
      const ficha = await Ficha.findById(fichaId);
      if (!ficha) {
        return res.status(404).json({ erro: 'Ficha não encontrada' });
      }
      return res.json({
        pontosDeVidaAtual: ficha.pontosDeVidaAtual,
        pontosDeVidaMax: ficha.pontosDeVidaMax,
        pontosDeManaAtual: ficha.pontosDeManaAtual,
        pontosDeManaMax: ficha.pontosDeManaMax,
      });
    } catch (error) {
      console.error('Erro ao buscar ficha:', error);
      return res.status(500).json({ erro: 'Erro ao buscar ficha' });
    }
  });

app.post('/ficha/:id/alterarPontos', autenticarUsuario, async (req, res) => {
    const fichaId = req.params.id;
    const { tipo, valor } = req.body; // Extrair 'tipo' e 'valor'

    try {
        const ficha = await Ficha.findById(fichaId);
        if (!ficha) {
            return res.status(404).json({ erro: 'Ficha não encontrada' });
        }

        if (tipo === 'pv') {
            ficha.pontosDeVidaAtual = Math.max(0, Math.min(ficha.pontosDeVidaAtual + valor, ficha.pontosDeVidaMax));
        } else if (tipo === 'pm') {
            ficha.pontosDeManaAtual = Math.max(0, Math.min(ficha.pontosDeManaAtual + valor, ficha.pontosDeManaMax));
        } else {
            return res.status(400).send('Tipo inválido');
        }

        await ficha.save();
        return res.json(ficha); // Retornar a ficha atualizada
    } catch (error) {
        console.error('Erro ao alterar pontos:', error);
        return res.status(500).send('Erro interno do servidor');
    }
});




app.post('/atualizar_divindade/:id', autenticarUsuario, async (req,res) => {
    try{
        const fichaId = req.params.id;
        const {divindade} = req.body;
        await Ficha.findByIdAndUpdate(fichaId, {divindade});
        res.json({mensagem: 'Divindade atualizada com sucesso!'});
    } catch(error){
        console.error('Erro ao atualizar divindade:', error);
        res.status(500).json({erro: 'Erro ao atualizar divindade'});
    }
});

//Atualizar Info\\
app.post('/ficha/atualizar_info/:id', async (req,res) => {
    const fichaId = req.params.id;
    const {nomePersonagem, origem, raca, classe, arkamino} = req.body;

    try{
        const fichaAtualizada = await Ficha.findByIdAndUpdate(
            fichaId,
            {identidade: {nomePersonagem}, origem, raca, classe, arkamino},
            {new: true}
        );

        if (!fichaAtualizada){
            return res.status(404).json({erro: 'Ficha não encontrada'});
        }

        console.log(`Ficha Atualizada - PV Max: ${fichaAtualizada.pontosDeVidaMax}`);


        res.json({mensagem: 'Informações atualizadas com sucesso!'});
    } catch(err){
        console.error(err);
        res.status(500).json({erro: 'Erro ao atualizar informações'});
    }
});

//Atualizar Atributos\\
app.post('/ficha/atualizar_atributos/:id', async (req,res) => {
    const fichaId = req.params.id;
    const atributos = req.body;

    try{
        const fichaAtualizada = await Ficha.findByIdAndUpdate(
            fichaId,
            {atributos},
            {new: true}
        );

        if(!fichaAtualizada){
            return res.status(404).json({erro: 'Ficha não encontrada'});
        }

        res.json({mensagem: 'Atributos atualizados com sucesso!'});
    } catch(err){
        console.error('Erro ao atualizar atributos:', err);
        res.status(500).json({erro: 'Erro ao atualizar atributos'});
    }
});


//Rota Habilidades\\
app.post('/ficha/adicionar_habilidade', async (req,res) => {
    let {fichaId, habilidade} = req.body;

    fichaId = fichaId.trim();

    if(!fichaId || !habilidade || !habilidade.nome){
        console.log('Dados incompletos:', req.body);
        return res.status(400).json({success: false, message: 'Dados incompletos.'});
    }

    fichaId = fichaId.trim();

    try{
        const ficha = await Ficha.findById(fichaId);

        if(!ficha){
            console.log(`Ficha não encontrada: ${fichaId}`);
            return res.json({success: false, message: 'Ficha não encontrada'});
        }

        ficha.adicionarHabilidade(habilidade.nome.trim());

        await ficha.save();
        console.log(`Habilidade adicionada: ${habilidade.nome.trim()} à ficha ID: ${fichaId}`);
        res.json({success: true});
    } catch(error){
        console.error('Erro ao adicionar habilidade:', error);
        res.status(500).json({success: false, message: 'Erro ao salvar a ficha'});
    }
});

app.post('/ficha/:id/atualizar_pv', autenticarUsuario, async (req, res) => {
    const fichaId = req.params.id;
    const { pvAtual, pvMaximo } = req.body;

    try {
        const ficha = await Ficha.findById(fichaId);
        if (!ficha) {
            return res.status(404).json({ erro: 'Ficha não encontrada' });
        }

        ficha.pontosDeVidaAtual = pvAtual;
        ficha.pontosDeVidaMax = pvMaximo;

        await ficha.save();
        return res.json({ pvAtual: ficha.pontosDeVidaAtual, pvMaximo: ficha.pontosDeVidaMax, mensagem: 'PV atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar PV:', error);
        return res.status(500).json({ erro: 'Erro ao atualizar PV' });
    }
});

app.post('/ficha/:id/atualizar_pm', autenticarUsuario, async (req, res) => {
    const fichaId = req.params.id;
    const { pmAtual, pmMaximo } = req.body;

    try {
        const ficha = await Ficha.findById(fichaId);
        if (!ficha) {
            return res.status(404).json({ erro: 'Ficha não encontrada' });
        }

        ficha.pontosDeManaAtual = pmAtual;
        ficha.pontosDeManaMax = pmMaximo;

        await ficha.save();
        return res.json({ mensagem: 'PM atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar PM:', error);
        return res.status(500).json({ erro: 'Erro ao atualizar PM' });
    }
});

app.post('/ficha/:id/atualizar_nivel', autenticarUsuario, async (req, res)=> {
    const fichaId = req.params.id;
    const {nivel} = req.body;  
    
    try{
        const ficha = await Ficha.findById(fichaId);
        if(!ficha){
            return res.status(404).json({erro: 'Ficha não encontrada'});
        }

        ficha.nivel = nivel;

        await ficha.save();
        res.json({mensagem: 'Nível atualizado com sucesso!'});
    } catch(error){
        console.error('Erro ao atualizar nível:', error);
        res.status(500).json({erro: 'Erro ao atualizar nível'});
    }
});

async function removeHabilidade(fichaId,habilidadeNome){
    try{
        const ficha = await Ficha.findById(fichaId);
        if(!ficha){
            throw new Error('Ficha não encontrada');
        }

        console.log('Habilidades:', ficha.habilidades);

        const habilidadeIndex = ficha.habilidades.findIndex(hab => 
            hab.nome.trim().toLowerCase() === habilidadeNome.trim().toLowerCase() 
        );

        if(habilidadeIndex === -1){
            throw new Error('Habilidade não encontrada');
        }

        console.log(`Removendo habilidade: ${habilidadeNome} da ficha ID: ${fichaId}`);
        ficha.habilidades.splice(habilidadeIndex, 1);

        await ficha.save();
        console.log('Habilidade removida:', ficha.habilidades);
    } catch(error){
        throw error;
    }
}


app.post('/ficha/remover_habilidade/:fichaId', async (req, res) => {
    console.log('Rota POST /ficha/remover_habilidade/:fichaId acionada');
    const fichaId = req.params.fichaId.trim();
    const {habilidadeNome} = req.body;

    if(!fichaId || !habilidadeNome){
        return res.status(400).json({success: false, message: 'Dados incompletos.'});
    }

    try{ 
        const ficha = await Ficha.findById(fichaId);
        if(!ficha){
            console.log(`Ficha não encontrada: ${fichaId}`);
            return res.status(404).json({success: false, message: 'Ficha não encontrada'});
        }

        console.log('Habilidades antes da remoção:', ficha.habilidades);

        const removido = ficha.removerHabilidade(habilidadeNome);
        if(!removido){
            return res.status(404).json({success: false, message: 'Habilidade não encontrada'});
        }

        await ficha.save();
        console.log(`Habilidade removida: ${habilidadeNome} da ficha ID: ${fichaId}`);
        console.log('Habilidades após a remoção:', ficha.habilidades);
        res.json({success: true});
    } catch(error){
        console.error('Erro ao remover habilidade:', error);
        res.status(500).json({success: false, message: 'Erro ao remover habilidade'});
    }
});





app.post('/test-upload', upload.single('uploadFotoPersonagem'), (req,res) => {
    if(!req.file){
        return res.status(400).json({erro: 'Nenhum arquivo enviado.'});
    }
    res.json({mensagem: 'Arquivo recebido!', file: req.file});
})

app.get('/teste-upload', (req, res) => {
    res.render('testeUpload');
});

// Middleware 404 (deve ser definido após todas as rotas)
app.use((req, res) => {
    res.status(404).send('Página não encontrada');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
