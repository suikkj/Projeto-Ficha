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

router.post('/:id/atualizar_pv', async (req,res) => {
    const { id } = req.params;
    const {pvAtual, pvMaximo} = req.body;

    if(pvAtual == null || pvMaximo == null){
        return res.status(400).json({sucesso: false, erro: 'Dados de PV incompletos'});
    }

    try{
        const ficha = await Ficha.findById(id);
        if(!ficha){
            return res.status(404).json({sucesso: false, erro: 'Ficha não encontrada'});
        }

        ficha.pontosDeVidaMax = pvMaximo;
        ficha.pontosDeVidaAtual = Math.min(Math.max(pvAtual, 0), pvMaximo);

        await ficha.save();

        res.json({
            sucesso: true,
            fichaAtualizada: {
                pontosDeVidaAtual: ficha.pontosDeVidaAtual,
                pontosDeVidaMax: ficha.pontosDeVidaMax
            }
        });
    } catch(error){
        console.error(error);
        res.status(500).json({sucesso: false, erro: 'Erro no servidor'});
    }
});



router.post('/atualizar_foto_personagem/:id', fichaController.atualizarFotoPersonagem);

router.post('/atualizar_classe/:id', fichaController.atualizarClasse);

router.post('delete/:id', async (req,res) => {
    try{
        const fichaId = req.params.id;
        await Ficha.findByIdAndDelete(fichaId);
        res.redirect('/fichas');
    } catch(err){
        console.error('Erro ao excluir a ficha:', err);
        res.status(500).send('Erro ao excluir a ficha');
    }
});



module.exports = router;