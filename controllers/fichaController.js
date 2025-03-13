const Ficha = require('../models/Ficha');
const multer = require('multer');
const { admin, bucket } = require('../firebaseAdmin');
const { v4: uuidv4 } = require('uuid');
const classesData = require('../config/classesData');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})

const salvarClasse = async (req, res) => {
    const fichaId = req.params.id;
    const {classe} = req.body;

    try{
        const ficha = await Ficha.findById(fichaId);
        if(!ficha){
            return res.status(404).json({sucesso: false, mensagem: 'Ficha não encontrada'});
        }

        if(!classeData[classe]){
            return res.status(400).json({sucesso: false, mensagem: 'Classe não encontrada'});
        }

        ficha.classe = classe;
        await ficha.save();

        res.json({mensagem: 'Classe atualizada com sucesso', ficha});
    } catch(error){
        console.error('Erro ao atualizar classe:', error);
        res.status(500).json({sucesso: false, mensagem: 'Erro no servidor'}); 
    }
};


const listaPericias = [
        'Acrobacia',
            'Adestramento',
            'Atletismo',
            'Atuação',
            'Cavalgar',
            'Conhecimento',
            'Cura',
            'Diplomacia',
            'Enganação',
            'Fortitude',
            'Furtividade',
            'Guerra',
            'Iniciativa',
            'Intimidação',
            'Intuição',
            'Investigação',
            'Jogatina',
            'Ladinagem',
            'Luta',
            'Misticismo',
            'Nobreza',
            'Ofício 1',
            'Ofício 2',
            'Percepção',
            'Pilotagem',
            'Pontaria',
            'Reflexos',
            'Religião',
            'Sobrevivência',
            'Vontade'
       ];

function calcularAtributos(ficha){
    ficha.atributos = {
        forca: 0,
        destreza: 0,
        constituicao: 0,
        inteligencia: 0,
        sabedoria: 0,
        carisma: 0,
    };

    ficha.nivel = ficha.nivel || 1;

    if(ficha.nivel < 1){
        ficha.nivel = 1;
    } else if(ficha.nivel > 20){
        ficha.nivel = 20;
    }

    // RAÇAS
    if(ficha.primeiraRaca === 'Anão'){
        ficha.atributos.constituicao += 2;
        ficha.atributos.sabedoria += 1;
        ficha.atributos.destreza -= 1;
    }

    const classeData = classesData[ficha.classe];

   if(classesData){
    const basePV = classeData.basePV + ficha.atributos.constituicao;
    const basePM = classeData.basePM;

    const pvPorNivel = classeData.pvPorNivel + ficha.atributos.constituicao;
    const pmPorNivel = classeData.pmPorNivel;

    ficha.pontosDeVidaMax = basePV + pvPorNivel * (ficha.nivel - 1);
    ficha.pontosDeManaMax = basePM + pmPorNivel * (ficha.nivel - 1);
   }


    //Pontos Atuais
    ficha.pontosDeVidaAtual = ficha.pontosDeVidaMax;
    ficha.pontosDeManaAtual = ficha.pontosDeManaMax;
};


exports.listaPericias = listaPericias;

function prepararFicha(ficha){
    if(!ficha.atributos){
        ficha.atributos = {
            forca: 0,
            destreza: 0,
            constituicao: 0,
            inteligencia: 0,
            sabedoria: 0,
            carisma: 0,
        };
    }

    if(!ficha.identidade){
        ficha.identidade = {nomePersonagem: 'Nome Padrão'};
    }

    if(!ficha.pericias || !Array.isArray(ficha.pericias)){
        ficha.pericias = [];
    }

    ficha.pontosDeVidaAtual = ficha.pontosdeVidaAtual || ficha.pontosDeVidaMax || 0;
    ficha.pontosDeManaAtual = ficha.pontosDeManaAtual || ficha.pontosDeManaMax || 0;

    return ficha;
}

exports.prepararFicha = prepararFicha;

exports.salvarRaca = async (req, res) => {
    try {
        const { raca } = req.body;
        if (!raca) {
            return res.status(400).json({ erro: 'Raça é obrigatória' });
        }

        let fichaExistente = await Ficha.findOne({ userId: req.session.userId });
        if (!fichaExistente) {
            fichaExistente = new Ficha({ userId: req.session.userId, pericias: [] });
        }

        fichaExistente.raca = raca;
        await fichaExistente.save();

        console.log(`Raça recebida no servidor: ${raca}`);
        res.status(200).json({ mensagem: 'Raça salva com sucesso', ficha: fichaExistente });
    } catch (error) {
        console.error('Erro ao salvar raça:', error);
        res.status(500).json({ erro: 'Erro ao salvar raça' });
    }
};

exports.salvarClasse = async (req, res) => {
    try {
        const { classe } = req.body;
        if (!classe) {
            return res.status(400).json({ erro: 'Classe é obrigatória' });
        }

        let fichaExistente = await Ficha.findOne({ userId: req.session.userId });
        if (!fichaExistente) {
            fichaExistente = new Ficha({ userId: req.session.userId });
        }

        fichaExistente.classe = classe;
        await fichaExistente.save();

        console.log(`Classe recebida no servidor: ${classe}`);
        res.status(200).json({ mensagem: 'Classe salva com sucesso', ficha: fichaExistente });
    } catch (error) {
        console.error('Erro ao salvar classe:', error);
        res.status(500).json({ erro: 'Erro ao salvar classe' });
    }
};

exports.salvarOrigem = async (req, res) => {
    try{
        const { origem } = req.body;
        const userId = req.session.userId;

        if(!origem){
            return res.status(400).json({erro: 'Origem é obrigatória'});
        }

        let fichaExistente = await Ficha.findOne({userId: userId});
        if(!fichaExistente){
            fichaExistente = new Ficha({userId});
        }

        fichaExistente.origem = origem;
        await fichaExistente.save();

        console.log(`Origem recebida no servidor: ${origem}`);
        res.status(200).json({mensagem: 'Origem salva com sucesso', ficha: fichaExistente});
    } catch(error){
        console.error('Erro ao salvar origem:', error);
        res.status(500).json({erro: 'Erro ao salvar origem'});
    }
};

exports.salvarArkamino = async (req, res) => {
    try{
        const {arkamino} = req.body;
        const userId = req.session.userId;

        if(!arkamino){
            return res.status(400).json({erro: 'Arkamino é obrigatório'});
        }

        let fichaExistente = await Ficha.findOne({userId: userId});
        if(!fichaExistente){
            fichaExistente = new Ficha({userId});
        }

        fichaExistente.arkamino = arkamino;
        await fichaExistente.save();

        console.log(`Arkamino recebido no servidor: ${arkamino}`);

        res.status(200).json({mensagem: 'Arkamino salvo com sucesso', fichaId: fichaExistente._id});
    } catch(error){
        console.error('Erro ao salvar arkamino:', error);
        res.status(500).json({erro: 'Erro ao salvar arkamino'});

    }
};

exports.salvarFicha = async (req, res) => {
   const fichaData = req.body;
   
   try{
    calcularAtributos(fichaData);

    if(!fichaData.pericias){
        fichaData.pericias = [];
    }

    const novaFicha = new Ficha(fichaData);
    await novaFicha.save();

    res.status(200).json({mensagem: 'Ficha salva com sucesso', fichaId: novaFicha._id});

    const novaFica = new Ficha({
     userId: req.userId,
    });
    await novaFicha.save();
    res.redirect(`/ficha/${novaFicha._id}`);
    
   } catch(error){
    console.error('Erro ao salvar ficha:', error);
    res.status(500).json({erro: 'Erro ao salvar ficha'});
   }
};


exports.visualizarFicha = async (req, res) => {
    try {
        const ficha = await Ficha.findOne({ userId: req.session.userId }).lean();

        if (!ficha) {
            return res.status(404).send('Ficha não encontrada');
        }

        const fichaPreparada = prepararFicha(ficha);

        // **Adicione um console.log para verificar 'listaPericias'**
        console.log('Lista de Perícias:', listaPericias);

        res.render('fichaTemplate', { ficha: fichaPreparada, listaPericias });
    } catch (error) {
        console.error('Erro ao visualizar ficha:', error);
        res.status(500).send('Erro ao carregar a ficha');
    }
};


exports.atualizarNivel = async (req,res) => {
    try{
        const fichaId = req.params.id;
        const {nivel} = req.body;

        await Ficha.findByIdAndUpdate(fichaId, {nivel: parseInt(nivel)});

        res.json({sucesso: true});
    } catch(error){
        console.error('Erro ao atualizar nível:', error);
        res.json({sucesso: false});
    }
};


exports.atualizarFotoPersonagem = async (req, res) => {
    try {
        const fichaId = req.params.id;
        console.log(`Recebendo upload para a ficha ID: ${fichaId}`);

        if (!req.file) {
            console.error('Arquivo não encontrado na requisição.');
            return res.status(400).json({ erro: 'Arquivo não encontrado' });
        }

        console.log('Arquivo recebido:', req.file);

        const uniqueFilename = `${uuidv4()}-${req.file.originalname}`;
        const filePath = `fichas/${fichaId}/foto_${uniqueFilename}`;
        const blob = bucket.file(filePath);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (error) => {
            console.error('Erro ao enviar arquivo para o Firebase:', error);
            res.status(500).json({ erro: 'Erro ao enviar arquivo' });
        });

        blobStream.on('finish', async () => {
            // Torna o arquivo público (opcional)
            await blob.makePublic();

            const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            console.log('Arquivo enviado com sucesso:', url);

            // Atualiza o banco de dados com a nova URL da foto
            await Ficha.findByIdAndUpdate(fichaId, { fotoPersonagem: url });

            res.status(200).json({ mensagem: 'Foto atualizada com sucesso', caminho: url });
        });

        // Envia o buffer do arquivo para o Firebase
        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error('Erro ao atualizar foto do personagem:', error);
        res.status(500).json({ erro: 'Erro ao atualizar foto do personagem' });
    }
};

exports.atualizarClasse = async (req,res) => {
    const fichaId = req.params.id;
    const novaClasse = req.body.classe;

    try{
        const ficha = await Ficha.findById(fichaId);
        if(!ficha){
            return res.status(404).json({sucesso: false, mensagem: 'Ficha não encontrada'});
        }

        ficha.classe = novaClasse;
        await ficha.save();

        res.json({sucesso: true, mensagem: 'Classe atualizada com sucesso'});
    } catch(error){
        console.error('Erro ao atualizar classe:', error);
        res.status(500).json({sucesso: false, mensagem: 'Erro no servidor'});
    }
};

exports.alterarPontos = async (req, res) => {
    const { fichaId } = req.params;
    const { tipo, valor } = req.body;

    if (!['pv', 'pm'].includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo inválido' });
    }

    try {
        const ficha = await Ficha.findById(fichaId);
        if (!ficha) {
            return res.status(404).json({ erro: 'Ficha não encontrada' });
        }

        if (tipo === 'pv') {
            ficha.pontosDeVidaAtual += valor;
            // Garantir que não ultrapasse os limites
            ficha.pontosDeVidaAtual = Math.max(0, Math.min(ficha.pontosDeVidaAtual, ficha.pontosDeVidaMax));
        } else if (tipo === 'pm') {
            ficha.pontosDeManaAtual += valor;
            ficha.pontosDeManaAtual = Math.max(0, Math.min(ficha.pontosDeManaAtual, ficha.pontosDeManaMax));
        }

        await ficha.save();

        res.json(ficha);
    } catch (error) {
        console.error('Erro ao alterar pontos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};