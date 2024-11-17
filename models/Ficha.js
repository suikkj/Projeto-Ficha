const mongoose = require('mongoose');

const atributosSchema = new mongoose.Schema({
    forca: {type: Number, default: 0},
    destreza: {type: Number, default: 0},
    constituicao: {type: Number, default: 0},
    inteligencia: {type: Number, default: 0},
    sabedoria: {type: Number, default: 0},
    carisma: {type: Number, default: 0},
}, { _id: false });

const periciaSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true,
    },


}); 

const fichaSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    raca:{
        type: String,
        
    },
    classe:{
        type: String,
        
    },
    origem:{
        type: String,
        
    },
    arkamino: {
        type: String,
       
    },
    nivel: {
        type: Number,
        default: 1,
        min: 1,
        max: 20,
    },
    atributos: {
        type: atributosSchema, default: () => ({}) },

    pontosDeVidaMax: {type: Number, default: 0},
    pontosDeManaMax: {type: Number, default: 0},
    pontosDeVidaAtual: {type: Number, default: 0},
    pontosDeManaAtual: {type: Number, default: 0},
    pericias: {
        type: [String],
        default: [],
    },
    identidade: {
        nomePersonagem: {type: String, required: true, default: 'Nome Padrão'},
    },
    fotoPersonagem:{type: String},
    defesa:{type: Number, default: 0},
    cdMagia:{type: Number, default: 0},
    deslocamento:{type: Number, default: 0},
    divindade:{type: String},
});



module.exports = mongoose.model('Ficha', fichaSchema);