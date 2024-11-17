const express = require('express');
const router = express.Router();
const Ficha = require('../models/Ficha');
const fichaController = require('../controllers/fichaController');

router.get('/', fichaController.visualizarFicha);

router.post('/atualizar_nivel/:id', async (req,res) => {
    const fichaId = req.params.id;
    const {nivel} = req.body

    try{
        const ficha = await Ficha.findByIdAndUpdate(
            fichaId,
            {nivel},
            {new: true}
        );

        if(!ficha){
            return res.status(404).json({erro: 'Ficha não encontrada'});
        }

        res.json({sucesso: true, ficha});
    } catch(error){
        console.error(error);
        res.status(500).json({erro: 'Erro no servidor.'});
    }
});

router.post('/atualizar_foto_personagem/:id', fichaController.atualizarFotoPersonagem);

module.exports = router;