const mongoose = require('mongoose');
const Classe = require('./models/Classe');
const Origem = require('./models/Origem');
const Arkamino = require('./models/Arkamino');


const classes = [
    {
        nome: 'Arcanista',
        descricao: 'Mago poderoso'
    },
    {
        nome: 'Bárbaro',
        descricao: 'Guerreiro selvagem'
    }
];

const origens = [
    {
        nome: 'Nobre',
        descricao: 'Filho de um rei'
    },
    {
        nome: 'Órfão',
        descricao: 'Sem pais'
    }
];

const arkaminos = [
    {
        nome: 'Fogo',
        descricao: 'Elemento do fogo'
    },
    {
        nome: 'Água',
        descricao: 'Elemento da água'
    }
];


async function seedDatabase() {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado ao MongoDB');

        await Classe.deleteMany();
        await Origem.deleteMany();
        await Arkamino.deleteMany();

        await Classe.insertMany(classes);
        await Origem.insertMany(origens);
        await Arkamino.insertMany(arkaminos);

        console.log('Classes, origens e arkaminos inseridos com sucesso');

        mongoose.connection.close();
    } catch(error){
        console.error('Erro ao inserir dados:', error);
    }
}


seedDatabase();