const mongoose = require('mongoose');
const Ficha = require('../models/Ficha');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado ao MongoDB');

        const resultado = await Ficha.updateMany(
            { atributos: { $exists: false }},
            {
                $set:{
                    atributos:{
                        forca: 0,
                        destreza: 0,
                        constituicao: 0,
                        inteligencia: 0,
                        sabedoria: 0,
                        carisma: 0,
                    }
                }
            }
        );

        console.log(`Fichas atualizadas: ${resultado.nModified}`);

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });