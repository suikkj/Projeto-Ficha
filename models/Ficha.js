const mongoose = require('mongoose');
const classesData = require('../config/classesData');   




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

const habilidadeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    descricao:{
        type: String,
        required: true,
    }
})



const fichaSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
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

    pontosDeVidaMax: {
        type: Number,
        required: true, 
        default: 0
    },
    pontosDeManaMax: {
        type: Number, 
        required: true,
        default: 0
    },
    pontosDeVidaAtual: {
        type: Number,
        required: true, 
        default: 0
    },
    pontosDeManaAtual: {
        type: Number,
        required: true, 
        default: 0
    },

    pericias: {
        type: [String],
        default: [],
    },
    identidade: {
        nomePersonagem: {type: String, required: true, default: 'Insurgente'},
    },
    habilidades: [habilidadeSchema],
    fotoPersonagem:{type: String},
    defesa:{type: Number, default: 0},
    cdMagia:{type: Number, default: 0},
    deslocamento:{type: Number, default: 0},
    divindade:{type: String},
});

fichaSchema.methods.adicionarHabilidade = function(habilidadeNome){
    if(!this.habilidades.some(hab => hab.nome.toLowerCase() === habilidadeNome.toLowerCase())){
        this.habilidades.push({nome: habilidadeNome.trim()});
    }
};

fichaSchema.methods.removerHabilidade = function(habilidadeNome){
    const index = this.habilidades.findIndex(
        hab => hab.nome.toLowerCase() === habilidadeNome.toLowerCase()
    );
    if(index !== -1){
        this.habilidades.splice(index, 1);
        return true;
    }
    return false;
};

fichaSchema.pre('save', function(next){
    if(this.isModified('classe') || this.isModified('atributos') || this.isModified('nivel')){
        console.log(`Classe sendo salva: ${this.classe}`);
        const classeInfo = classesData[this.classe];
        console.log(`Informações da classe:`, classeInfo);

        if(classeInfo){
            this.pontosDeVidaMax = classeInfo.basePV + (this.nivel - 1) * classeInfo.pvPorNivel;
            this.pontosDeManaMax = classeInfo.basePM + (this.nivel - 1) * classeInfo.pmPorNivel;
            console.log(`pontosDeVidaMax definido: ${this.pontosDeVidaMax}`);
            console.log(`pontosDeManaMax definido: ${this.pontosDeManaMax}`);
        } else{
            console.log(`Classe não encontrada: ${this.classe}`);
            this.pontosDeVidaMax = 0;
            this.pontosDeManaMax = 0;
        }

        this.pontosDeVidaAtual = Math.min(this.pontosDeVidaAtual, this.pontosDeVidaMax);
        this.pontosDeManaAtual = Math.min(this.pontosDeManaAtual, this.pontosDeManaMax);
        console.log(`pontosDeVidaAtual após ajuste: ${this.pontosDeVidaAtual}`);
        console.log(`pontosDeManaAtual após ajuste: ${this.pontosDeManaAtual}`);
    }
    next();
});

module.exports = mongoose.model('Ficha', fichaSchema);