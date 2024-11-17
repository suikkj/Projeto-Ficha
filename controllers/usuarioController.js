const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Criação de conta e salvamento em banco de dados
exports.registrarUsuario = async(req, res) => {
    console.log('Rota de registro chamada');
    try {
        const { username, email, senha } = req.body;
        console.log('Dados recebidos:', { username, email, senha });
        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = new Usuario({ username, email, senha: senhaHash });
        console.log('Tentando salvar novo usuário:', novoUsuario);
        await novoUsuario.save();
        const tokenAcesso = gerarToken(novoUsuario._id, '15m');
        const tokenAtualizacao = gerarToken(novoUsuario._id, '7d');
        console.log('Usuário salvo com sucesso');
        res.status(201).json({
            mensagem: 'Usuário registrado com sucesso!',
            tokenAcesso,
            tokenAtualizacao,
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        if (error.code === 11000) {
            return res.status(400).json({ erro: 'Nome de usuário ou email já está em uso' });
        }
        res.status(500).json({ erro: 'Erro ao registrar usuário.' });
    }
};

// Login da conta
exports.loginUsuario = async(req, res) => {
    const { email, senha } = req.body;
    console.log("Função de login foi chamada");
    console.log("Tentando fazer login com:", { email, senha });
    console.log('Conteúdo do req.body:', req.body);
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            console.log('Usuário não encontrado');
            return res.status(401).json({ erro: 'Usuário não encontrado.' });
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            console.log('Senha incorreta');
            return res.status(401).json({ erro: 'Credenciais Inválidas' });
        }
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('tokenAcesso', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        req.session.userId = usuario._id;
        console.log('Login realizado com sucesso');
        res.status(200).json({ mensagem: 'Login realizado com sucesso!!!!!' });
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ erro: 'Erro ao processar a solicitação' });
    }
};

// Atualização de Nome de Usuário
exports.atualizarUsername = async (req, res) => {
    const { username } = req.body;
    try {
        const usuarioExistente = await Usuario.findOne({ username });
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Nome de usuário já está em uso' });
        }
        const usuario = await Usuario.findByIdAndUpdate(req.userId, { username }, { new: true });
        res.json({ mensagem: 'Nome de usuário atualizado com sucesso!', username: usuario.username });
    } catch (error) {
        console.error('Erro ao atualizar nome de usuário:', error);
        res.status(500).json({ erro: 'Erro ao atualizar nome de usuário' });
    }
};

// Atualização de Email
exports.atualizarEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Email já está em uso' });
        }
        const usuario = await Usuario.findByIdAndUpdate(req.userId, { email }, { new: true });
        res.json({ mensagem: 'Email atualizado com sucesso!', email: usuario.email });
    } catch (error) {
        console.error('Erro ao atualizar email:', error);
        res.status(500).json({ erro: 'Erro ao atualizar email' });
    }
};

// Atualização de Senha
exports.atualizarSenha = async (req, res) => {
    const { currentPassword, password } = req.body;
    try {
        const usuario = await Usuario.findById(req.userId);
        const senhaCorreta = await bcrypt.compare(currentPassword, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ erro: 'Senha atual incorreta' });
        }
        const senhaHash = await bcrypt.hash(password, 10);
await Usuario.findByIdAndUpdate(req.userId, { senha: senhaHash });
res.json({ mensagem: 'Senha atualizada com sucesso!' });
} catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ erro: 'Erro ao atualizar senha' });
}
};

// Atualização de Foto de Perfil
exports.atualizarFotoPerfil = async (req, res) => {
    
    try{
        const{fotoPerfil} = req.body;
        await Usuario.findByIdAndUpdate(req.userId, {fotoPerfil});
        res.json({mensagem: 'Foto de perfil atualizada com sucesso!', caminho: fotoPerfil});
    } catch(error){
        res.status(500).json({erro:'Erro ao atualizar foto de perfil'});
    }
}




// Token JWT (user_id)
function gerarToken(id, expiresIn) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
}


// Atualizar imagem outros locais

exports.usuarioAtual = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.session.userId);
        if(!usuario){
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        res.json({ username: usuario.username, email: usuario.email, fotoPerfil: usuario.fotoPerfil });
    } catch (error) {
        console.error('Erro ao buscar usuário atual:', error);
        res.status(500).json({ erro: 'Erro ao buscar usuário atual' });
    }
};
