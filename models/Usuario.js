const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    fotoPerfil: {
        type: String
    }
    // Adicione outros campos conforme necessário
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;