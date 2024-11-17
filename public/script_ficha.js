// script_ficha.js

document.addEventListener('DOMContentLoaded', () => {
    const fichaIdElement = document.getElementById('fichaIdData');
    const listaPericiasElement = document.getElementById('listaPericiasData');
    const periciaAtributoMapElement = document.getElementById('periciaAtributoMapData');

    if(!fichaIdElement || !listaPericiasElement || !periciaAtributoMapElement){
        console.error('Elementos não encontrados');
        return;
    }

    const fichaId = fichaIdElement.textContent.trim();
    console.log(`ID da ficha: ${fichaId}`);
    const listaPericias = JSON.parse(listaPericiasElement.textContent);
    const periciaAtributoMap = JSON.parse(periciaAtributoMapElement.textContent);

    const atributos= {};

    const uploadFoto = document.getElementById('uploadFotoPersonagem');

    if (uploadFoto && fichaIdElement) {
        const fichaId = fichaIdElement.textContent.trim();

        uploadFoto.addEventListener('change', function () {
            const form = document.getElementById('fotoPersonagemForm');
            if (!form) {
                console.error('Formulário de foto não encontrado.');
                return;
            }

            const formData = new FormData(form);

            // Log para verificar o conteúdo do FormData
            for (const pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            fetch(`/ficha/atualizar_foto_personagem/${fichaId}`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta do servidor:', data);
                const fotoElement = document.getElementById('fotoPersonagem');
                if (fotoElement && data.caminho) {
                    fotoElement.src = data.caminho;
                } else if (data.erro) {
                    alert(data.erro);
                } else {
                    console.error("Elemento 'fotoPersonagem' não encontrado ou 'data.caminho' não definido.");
                    alert('Erro ao atualizar a foto do personagem.');
                }
            })
            .catch(error => {
                console.error('Erro ao enviar foto:', error);
            });
        });
    } else {
        console.error("Elemento 'uploadFotoPersonagem' ou 'fichaIdData' não encontrado");
    }

    //Vida e Mana\\

    const pvDecrease = document.getElementById('pv-decrease');
    const pvIncrease = document.getElementById('pv-increase');
    const pvDisplay = document.getElementById('pv-display');

    const pmDecrease = document.getElementById('pm-decrease');
    const pmIncrease = document.getElementById('pm-increase');
    const pmDisplay = document.getElementById('pm-display');

    if(pvDecrease && pvIncrease && pmDecrease && pmIncrease){
        pvDecrease.addEventListener('click', () => alterarPontos('pv', -1));
        pvIncrease.addEventListener('click', () => alterarPontos('pv', 1));
        pmDecrease.addEventListener('click', () => alterarPontos('pm', -1));
        pmIncrease.addEventListener('click', () => alterarPontos('pm', 1));
    }

    async function alterarPontos(tipo, valor){
        try{
            const response = await fetch(`/ficha/${fichaId}/alterarPontos`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ tipo, valor }),
            });

            if(!response.ok){
                throw new Error('Erro ao alterar pontos');
            }

            const fichaAtualizada = await response.json();

            if(tipo === 'pv'){
                pvDisplay.textContent = `${fichaAtualizada.pontosDeVidaAtual} / ${fichaAtualizada.pontosDeVidaMax}`;
            } else{
                pmDisplay.textContent = `${fichaAtualizada.pontosDeManaAtual} / ${fichaAtualizada.pontosDeManaMax}`;
            }
        } catch(error){
            console.error('Erro:', error);
        }
    }

    //Ações\\

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const addButtons = document.querySelectorAll('.add-button');

    function updateAddButtons(activeTabId){
        addButtons.forEach(function(button) {
            button.style.display = 'none';
        });

        const activeAddButton = document.querySelector(`#${activeTabId} .add-button`);
        if(activeAddButton){
            activeAddButton.style.display = 'block';
        } else{
            console.warn(`Nenhum botão de adicionar encontrado para a aba ${activeTabId}`);
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            console.log('Botão clicado:', targetTab);

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            const activeContent = document.getElementById(targetTab);
            console.log('Conteúdo ativo encontrado:', activeContent);
            
            if(activeContent){
                activeContent.classList.add('active');
            } else{
                console.warn(`Conteúdo da tab "${targetTab}" não encontrado.`);
            }

            // Atualiza os botões de adicionar ao mudar de tab
            updateAddButtons(targetTab);
        });
    });

    const activeTabButton = document.querySelector('.tab-button.active');
    const initialActiveTabId = activeTabButton ? activeTabButton.getAttribute('data-tab') : null;
    if(initialActiveTabId){
        updateAddButtons(initialActiveTabId);
    } else {
        console.error('Nenhuma aba ativa encontrada.');
    }

    function openModal(modalId){
        const modal = document.getElementById(modalId);
        if(modal){
            modal.style.display = 'block';
        }
    }
    function closeModal(modalId){
        const modal = document.getElementById(modalId);
        if(modal){
            modal.style.display = 'none';
        }
    }

    // Atualizado para selecionar a classe correta
    const closeModalButtons = document.querySelectorAll('.close-button');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            if(modal){
                modal.style.display = 'none';
            }
        });
    });

    function setupModal(addButtonId, modalId){
        const addButton = document.getElementById(addButtonId);
        const modal = document.getElementById(modalId);

        if(addButton && modal){
            addButton.addEventListener('click', function (){
                openModal(modalId);
            });

            modal.addEventListener('click', function(event){
                if(event.target.classList.contains('close-button') || event.target === modal){
                    closeModal(modalId);
                }
            });
        }
    }

    function voltarEtapas(){
        document.getElementById('etapas-habilidades').style.display = 'block';
        const respostas = document.querySelectorAll('.resposta-habilidade');
        respostas.forEach(resposta => resposta.style.display = 'none'); 
    }


    setupModal('add-combate', 'modal-combate');
    setupModal('add-habilidade', 'modal-habilidades');
    setupModal('add-magia', 'modal-magias');
    setupModal('add-item', 'modal-inventario');
    setupModal('add-arkamino-poder', 'modal-arkamino');


    function loadNestedSteps(containerId, items, callback){
        const container = document.getElementById(containerId);
        let content = '<ul>';

        items.forEach(item => {
            content += `<li data-value="${item}">${item}</li>`;
        });

        content += '</ul>';
        container.innerHTML = content;

        const nestedUl = container.querySelector('ul');
        if(nestedUl){
            nestedUl.addEventListener('click', function(event){
                if(event.target.tagName === 'LI'){
                    const value = event.target.dataset.value;
                    callback(value);
                }
            });
        }
    }

    // HABILIDADES \\

    const addHabilidadeBtn = document.getElementById('add-habilidade');
    if(addHabilidadeBtn){
        addHabilidadeBtn.addEventListener('click', () => openModal('modal-habilidades'));
    }

    const etapasHabilidades = document.getElementById('etapas-habilidades');
    if(etapasHabilidades){
        etapasHabilidades.addEventListener('click', function(event) {
            if(event.target.tagName === 'LI'){
                const step = event.target.dataset.step;

                const resposta = document.getElementById(step);
                if(resposta){
                    resposta.style.display = 'block';
                } else {
                    console.warn(`Resposta para a etapa ${step} não encontrada.`);
                }
            }
        });
    }

    const respostasHabilidadesData = {
        habilidadeRaca: ['Clássico', 'Ameaças de Arton', 'Deuses e Heróis', 'História dos Selos'],
        habilidadeClasse: ['Habilidades', 'Poderes'],
        poderesConcedidos: ['Aima', 'Moguto', 'Tago', 'Fidus', 'Ekvilli', 'Mythos', 'Mallumo', 'Rideto', 'Osto'],
    }

    document.getElementById('etapas-habilidades').addEventListener('click', function(event){
        if(event.target.tagName === 'LI'){

            const itens = document.querySelectorAll('#etapas-habilidades li');
            itens.forEach(item => item.classList.remove('active'));

            event.target.classList.add('active');

            const step = event.target.dataset.step;
            const respostas = respostasHabilidadesData[step];

            const respostasContainer = document.getElementById('respostas-habilidades');
            respostasContainer.innerHTML = '';

            if(respostas){
                respostas.forEach(function(resposta) {
                    const li = document.createElement('li');
                    li.textContent = resposta;
                    li.dataset.resposta = resposta;
                    li.dataset.step = step;

                    li.addEventListener('click', function() {
                        const respostaItens = document.querySelectorAll('#respostas-habilidades li');
                        respostaItens.forEach(item => item.classList.remove('active'));

                        li.classList.add('active');

                        mostrarListaDeHabilidades(step, resposta);
                    });
                    respostasContainer.appendChild(li);
                });
                respostasContainer.style.display = 'flex';
            }
        }
    });

    function mostrarListaDeHabilidades(step, resposta){
        const habilidades = getHabilidadesPorResposta(step, resposta);

        const listaContainer = document.getElementById('lista-habilidades-disponiveis');
        listaContainer.innerHTML = '';

        habilidades.forEach(function(habilidade){
            const habilidadeDiv = document.createElement('div');
            habilidadeDiv.classList.add('habilidade-item');

            const nome = document.createElement('span');
            nome.textContent = habilidade.nome;
            nome.classList.add('habilidade-nome');

            const addButton = document.createElement('button');
            addButton.innerHTML = '<i class="bi bi-plus"></i>';
            addButton.classList.add('habilidade-add-button');
            addButton.addEventListener('click', function(){
                adicionarHabilidade(habilidade);
            });

            habilidadeDiv.appendChild(nome);
            habilidadeDiv.appendChild(addButton);
            listaContainer.appendChild(habilidadeDiv);
        });

        listaContainer.style.display = 'block';
    }

    function getHabilidadesPorResposta(step, resposta){
        return [
            {nome: 'Teste 1'},
            {nome: 'Teste 2'},
        ];
    }

    function adicionarHabilidade(habilidade){
        fetch('/ficha/adicionar_habilidade', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                fichaId: fichaData.fichaId,
                habilidade: habilidade
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if(data.success){
                closeModal('modal-habilidades');
                const listaHabilidades = document.getElementById('lista-habilidades');
                const li = document.createElement('li');
                li.textContent = habilidade.nome;
                listaHabilidades.appendChild(li);
            } else {
                alert('Erro ao adicionar habilidade: '+ data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }


    function loadHabilidadesNestedSteps(step){
        const container = document.getElementById('habilidades-nested-steps');
        let content = '<ul>';

        if(step === 'habilidadeRaca'){
            content += `
            <li data-option="Elfo">Elfo</li>
            <li data-option="Anão">Anão</li>
            <li data-option="Humano">Humano</li>
            <!-- Outras raças -->
            `;
        } else if(step === 'habilidadeClasse'){
            content += `
            <li data-option="Arcanista">Arcanista</li>
            <li data-option="Druida">Druida</li>
            <li data-option="Clérigo">Clérigo</li>
            <!-- Outras classes -->
            `;
        }

        content += '</ul>';
        container.innerHTML = content;

        const nestedUl = container.querySelector('ul');
        if(nestedUl){
            nestedUl.addEventListener('click', function(event) {
                if(event.target.tagName === 'LI'){
                    const habilidade = event.target.dataset.option;
                    addHabilidade(habilidade);
                    closeModal('modal-habilidades');
                }
            });
        }
    }

    function addHabilidade(habilidade){
        const li = document.createElement('li');
        li.textContent = habilidade;
        document.getElementById('lista-habilidades').appendChild(li);
    }

    // MAGIAS \\

    document.getElementById('add-magia').addEventListener('click', function() {
        document.getElementById('modal-magias').style.display = 'block';
    });

    const etapasMagias = document.getElementById('etapas-magias');
    if(etapasMagias){
        etapasMagias.addEventListener('click', function(event) {
            if(event.target.tagName === 'LI'){
                const type = event.target.dataset.type;
                loadMagiasNestedSteps(type);
            }
        });
    }

    function loadMagiasNestedSteps(type){
        const container = document.getElementById('magias-nested-steps');
        let content = '<ul>';

        if(type === 'arcanas' || type === 'divinas'){
            content += `
            <li data-category="todas">Todas</li>
            <li data-category="abjur">Abjuração</li>
            <li data-category="adiv">Adivinhação</li>
            <li data-category="conv">Convocação</li>
            <li data-category="encan">Encantamento</li>
            <li data-category="evoc">Evocação</li>
            <li data-category="ilus">Ilusão</li>
            <li data-category="necro">Necromancia</li>
            <li data-category="trans">Transmutação</li>
            `;
        }

        content += '</ul>';
        container.innerHTML = content;

        const nestedUl = container.querySelector('ul');
        if(nestedUl){
            nestedUl.addEventListener('click', function(event) {
                if(event.target.tagName === 'LI'){
                    const category = event.target.dataset.category;
                    loadMagiasCircles(type, category);
                }
            });
        }
    }

    function loadMagiasCircles(type, category){
        const container = document.getElementById('magias-nested-steps');
        let content = `
        <ul>
            <li data-circle="1">Primeiro Círculo</li>
            <li data-circle="2">Segundo Círculo</li>
            <li data-circle="3">Terceiro Círculo</li>
            <li data-circle="4">Quarto Círculo</li>
            <li data-circle="5">Quinto Círculo</li>
        </ul>
        `;

        container.innerHTML = content;

        const nestedUl = container.querySelector('ul');
        if(nestedUl){
            nestedUl.addEventListener('click', function (event) {
                if(event.target.tagName === 'LI'){
                    const circle = event.target.dataset.circle;
                    listMagias(type, category, circle);
                }
            });
        }
    }

    function listMagias(type, category, circle){
        const container = document.getElementById('magias-nested-steps');
        const magias = getMagias(type, category, circle);
        let content = '<ul>';

        magias.forEach(magia => {
            content += `<li data-magia="${magia}">${magia}</li>`;
        });

        content += '</ul>';
        container.innerHTML = content;

        const nestedUl = container.querySelector('ul');
        if(nestedUl){
            nestedUl.addEventListener('click', function (event){
                if(event.target.tagName === 'LI'){
                    const magia = event.target.dataset.magia;
                    addMagia(magia);
                    closeModal('modal-magias');
                }
            });
        }
    }

    function addMagia(magia){
        const li = document.createElement('li');
        li.textContent = magia;
        document.getElementById('lista-magias').appendChild(li);
    }

    function getMagias(type, category, circle){
        return [
            'Magia 1',
            'Magia 2',
            'Magia 3',
            'Magia 4',
            'Magia 5',
            'Magia 6',
            'Magia 7',
            'Magia 8',
            'Magia 9',
        ];
    }

    // INVENTÁRIO \\

    document.getElementById('add-item').addEventListener('click', function() {
        document.getElementById('modal-inventario').style.display = 'block';
    });

    const etapasInventario = document.getElementById('etapas-inventario');
    if(etapasInventario){
        etapasInventario.addEventListener('click', function(event){
            if(event.target.tagName === 'LI'){
                const category = event.target.dataset.category;
                loadInventarioItems(category);
            }
        });
    }

    function loadInventarioItems(category){
        const container = document.getElementById('inventario-nested-steps');
        const items = getInventarioItems(category);
        let content = '<ul>';

        items.forEach(item => {
            content += `<li data-item="${item}">${item}</li>`;
        });

        content += '</ul>';
        container.innerHTML = content;

        const nestedUl = container.querySelector('ul');
        if(nestedUl){
            nestedUl.addEventListener('click', function(event) {
                if(event.target.tagName === 'LI'){
                    const item = event.target.dataset.item;
                    addItem(item);
                    closeModal('modal-inventario');
                }
            });
        }
    }

    function addItem(item){
        const li = document.createElement('li');
        li.textContent = item;
        document.getElementById('lista-itens').appendChild(li);
    }

    function getInventarioItems(category){
        return [
            'Item 1',
            'Item 2',
            'Item 3',
            'Item 4',
            'Item 5',
            'Item 6',
            'Item 7',
            'Item 8',
            'Item 9',
        ];
    }

    // ARKAMINO \\

    // Remova este event listener redundante
    // document.getElementById('add-arkamino-poder').addEventListener('click', function() {
    //     openModal('modal-arkamino');
    // });

    const etapasArkamino = document.getElementById('etapas-arkamino');
    if(etapasArkamino){
        etapasArkamino.addEventListener('click', function(event){
            if(event.target.tagName === 'LI'){
                const poder = event.target.dataset.poder;
                loadArkaminoPoderes(poder);
            }
        });
    }

    function loadArkaminoPoderes(poder){
        const container = document.getElementById('arkamino-nested-steps');
        const poderes = getArkanimoPoderes(poder);
        let content = '<ul>';

        poderes.forEach(p => {
            content += `<li data-poder="${p}">${p}</li>`;
        });

        content += '</ul>';
        container.innerHTML = content;

        const nestedUl = container.querySelector('ul');
        if(nestedUl){
            nestedUl.addEventListener('click', function(event){
                if(event.target.tagName === 'LI'){
                    const selectedPoder = event.target.dataset.poder;
                    addArkanimoPoder(selectedPoder);
                    closeModal('modal-arkamino');
                }
            });
        }
    }

    function addArkanimoPoder(poder){
        const li = document.createElement('li');
        li.textContent = poder;
        document.getElementById('lista-arkamino-poderes').appendChild(li);
    }

    function getArkanimoPoderes(poder){
        return [
            'Poder 1',
            'Poder 2',
            'Poder 3',
            'Poder 4',
            'Poder 5',
            'Poder 6',
            'Poder 7',
            'Poder 8',
            'Poder 9',
        ];
    }

    // Vida e Mana Bars
    const pvAtualInput = document.getElementById('pv-atual');
    const pvMaximoInput = document.getElementById('pv-maximo');
    const barraPv = document.getElementById('barra-pv');
    const pvIncreaseBtnBar = document.querySelector('.pv-increase');
    const pvDecreaseBtnBar = document.querySelector('.pv-decrease');

    const pmAtualInput = document.getElementById('pm-atual');
    const pmMaximoInput = document.getElementById('pm-maximo');
    const barraPm = document.getElementById('barra-pm');
    const pmIncreaseBtnBar = document.querySelector('.pm-increase');
    const pmDecreaseBtnBar = document.querySelector('.pm-decrease');

    // Função para atualizar a barra
    function atualizarBarra(atual, maximo, barra) {
        const percentual = (atual / maximo) * 100;
        barra.style.width = `${percentual}%`;
    }

    // Atualizar barra inicialmente
    if(pvAtualInput && pvMaximoInput && barraPv){
        atualizarBarra(pvAtualInput.value, pvMaximoInput.value, barraPv);
    }
    if(pmAtualInput && pmMaximoInput && barraPm){
        atualizarBarra(pmAtualInput.value, pmMaximoInput.value, barraPm);
    }

    // Eventos para botões de Vida
    if(pvIncreaseBtnBar && pvDecreaseBtnBar){
        pvIncreaseBtnBar.addEventListener('click', () => {
            let valorAtual = parseInt(pvAtualInput.value);
            const maximo = parseInt(pvMaximoInput.value);
            if (valorAtual < maximo) {
                valorAtual++;
                pvAtualInput.value = valorAtual;
                atualizarBarra(valorAtual, maximo, barraPv);
            }
        });

        pvDecreaseBtnBar.addEventListener('click', () => {
            let valorAtual = parseInt(pvAtualInput.value);
            if (valorAtual > 0) {
                valorAtual--;
                pvAtualInput.value = valorAtual;
                atualizarBarra(valorAtual, pvMaximoInput.value, barraPv);
            }
        });
    }

    // Eventos para botões de Mana
    if(pmIncreaseBtnBar && pmDecreaseBtnBar){
        pmIncreaseBtnBar.addEventListener('click', () => {
            let valorAtual = parseInt(pmAtualInput.value);
            const maximo = parseInt(pmMaximoInput.value);
            if (valorAtual < maximo) {
                valorAtual++;
                pmAtualInput.value = valorAtual;
                atualizarBarra(valorAtual, maximo, barraPm);
            }
        });

        pmDecreaseBtnBar.addEventListener('click', () => {
            let valorAtual = parseInt(pmAtualInput.value);
            if (valorAtual > 0) {
                valorAtual--;
                pmAtualInput.value = valorAtual;
                atualizarBarra(valorAtual, pmMaximoInput.value, barraPm);
            }
        });
    }

    // Eventos para inputs de Vida
    if(pvAtualInput && pvMaximoInput && barraPv){
        pvAtualInput.addEventListener('input', () => {
            const valorAtual = parseInt(pvAtualInput.value);
            const maximo = parseInt(pvMaximoInput.value);
            atualizarBarra(valorAtual, maximo, barraPv);
        });

        pvMaximoInput.addEventListener('input', () => {
            const valorAtual = parseInt(pvAtualInput.value);
            const maximo = parseInt(pvMaximoInput.value);
            atualizarBarra(valorAtual, maximo, barraPv);
        });
    }

    // Eventos para inputs de Mana
    if(pmAtualInput && pmMaximoInput && barraPm){
        pmAtualInput.addEventListener('input', () => {
            const valorAtual = parseInt(pmAtualInput.value);
            const maximo = parseInt(pmMaximoInput.value);
            atualizarBarra(valorAtual, maximo, barraPm);
        });

        pmMaximoInput.addEventListener('input', () => {
            const valorAtual = parseInt(pmAtualInput.value);
            const maximo = parseInt(pmMaximoInput.value);
            atualizarBarra(valorAtual, maximo, barraPm);
        });
    }

    const classesData = {
        'Arcanista':{
            basePV: 8,
            pvPorNivel: 2,
            basePM: 6,
            pmPorNivel: 6
        },
        'Bárbaro':{
            basePV: 24,
            pvPorNivel: 6,
            basePM: 3,
            pmPorNivel: 3
        },
    }

    function calcularPontos(){
        const nivel = parseInt(nivelSelect.value);
        const constituicao = parseInt(document.getElementById('constituicao').value) || 0;

        const classe = document.getElementById('classe').value;

        if(classesData[classe]){
            const classeInfo = classesData[classe];

            const pvBase = classeInfo.basePV + constituicao;
            const pvNivel = (nivel - 1) * (classeInfo.pvPorNivel + constituicao);
            const pvTotal = pvBase + pvNivel;

            const pmBase = classeInfo.basePM;
            const pmNivel = (nivel - 1) * classeInfo.pmPorNivel;
            const pmTotal = pmBase + pmNivel;

            pvAtualInput.value = pvTotal;
            pvMaximoInput.value = pvTotal;
            pmAtualInput.value = pmTotal;
            pmMaximoInput.value = pmTotal;

            atualizarBarra(pvTotal, pvTotal, barraPv);
            atualizarBarra(pmTotal, pmTotal, barraPm);
        }
    }

    const nivelSelect = document.getElementById('nivel');
    const atributosInputs = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'];


    if(nivelSelect){
        nivelSelect.addEventListener('change', calcularPontos);
    }
    const constituicaoInput = document.getElementById('constituicao');
    if(constituicaoInput){
        constituicaoInput.addEventListener('input', calcularPontos);
    }

    calcularPontos();

    fetch(`/ficha/atualizar_nivel/${fichaId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nivel: nivelSelect.value })
    })
    .then(response => {
        if(!response.ok){
            return response.text().then(text => {throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if(!data.sucesso){
            alert('Erro ao atualizar nível no servidor.');
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar nível:', error.message);
    });

    // pericias \\

    const atributoIdMap = {
        FOR: 'forca',
        DES: 'destreza',
        CON: 'constituicao',
        INT: 'inteligencia',
        SAB: 'sabedoria',
        CAR: 'carisma',
    };

    const fichaData = {
        fichaId: fichaIdElement ? fichaIdElement.textContent.trim() : ''
    };


    function calcularTotal(pericia){
        const meioNivel = Math.floor(nivelSelect.value / 2);
        const atributoSelecionado = periciaAtributoMap[pericia];
        let atributo = 0;

        if(atributoSelecionado && atributoIdMap[atributoSelecionado]){
            const atributoInput = document.getElementById(atributoIdMap[atributoSelecionado]);
            if(atributoInput){
                atributo = parseInt(atributoInput.value) || 0;
            }
        }

        const treinadoCheckbox = document.querySelector(`.treinado[data-pericia="${pericia}"]`);
        const treinado = treinadoCheckbox && treinadoCheckbox.checked ? 2 : 0;

        const outrosInput = document.querySelector(`.outros[data-pericia="${pericia}"]`);
        const outros = outrosInput ? parseInt(outrosInput.value) || 0 : 0;

        const total = meioNivel + atributo + treinado + outros;

        const totalElement = document.getElementById(`total-${pericia}`);
        if(totalElement){
            totalElement.innerText = total;
        }

        const meioNivelElement = document.getElementById(`meio-nivel-${pericia}`);
        if(meioNivelElement){
            meioNivelElement.innerText = meioNivel;
        }
    }

    atributosInputs.forEach(attrId => {
        const input = document.getElementById(attrId);
        if(input){
            input.addEventListener('input', () => {
                listaPericias.forEach(pericia => calcularTotal(pericia));
            });
        }
    });

    if(nivelSelect){
        nivelSelect.addEventListener('change', () => {
            listaPericias.forEach(pericia => calcularTotal(pericia));
        });
    }

    listaPericias.forEach(pericia => calcularTotal(pericia));

    const rolarButtons = document.querySelectorAll('.rolar-button');
    if(rolarButtons.length > 0){
        console.log(`Encontrados ${rolarButtons.length} botões 'rolar-button'`);
    } else{
        console.warn("Nenhum botão com a classe 'rolar-button' encontrado.");
    }

    rolarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pericia = button.getAttribute('data-pericia');
            if(!pericia){
                console.error("Botão sem o atributo 'data-pericia'.");
                return;
            }
            console.log(`Botão de rolagem clicado para a perícia: ${pericia}`);

            const totalElement = document.getElementById(`total-${pericia}`);
            if(!totalElement){
                console.error(`Elemento com ID 'total-${pericia}' não encontrado.`);
                return;
            }

            const total = parseInt(totalElement.innerText) || 0;
            const roll = Math.floor(Math.random() * 20) + 1;
            const resultado = roll + total;
            alert(`Rolagem de ${pericia}: ${roll} + ${total} = ${resultado}`);
        });
    });

    document.querySelectorAll('.atributo input').forEach(input => {
        input.addEventListener('change', () => {
            const atributo = input.id.toUpperCase();
            atributos[atributo] = parseInt(input.value) || 0;
            listaPericias.forEach(pericia => calcularTotal(pericia));
        });
    });

    //Botão Editar\\
    const editInfoButton = document.getElementById('edit-info-button');
    if(editInfoButton){
        editInfoButton.addEventListener('click', function() {
            const isEditing = this.classList.toggle('editing');
            const icon = this.querySelector('i.bi');
            const inputs = document.querySelectorAll('.dados-personagem input');

            if(isEditing){
                inputs.forEach(input => input.removeAttribute('readonly'));
                icon.classList.remove('bi-pencil');
                icon.classList.add('bi-check2');
            } else{
                const updatedData = {};
                inputs.forEach(input => {
                    updatedData[input.id] = input.value;
                });

                fetch(`/ficha/atualizar_info/${fichaId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                })
                .then(response => response.json())
                .then(data => {
                    if(data.mensagem){
                        console.log(data.mensagem);
                    } else if(data.erro){
                        alert(data.erro);
                    }
                })
                .catch(error => {
                    console.error('Erro ao atualizar informações:', error);
                });

                inputs.forEach(input => input.setAttribute('readonly', 'true'));
                icon.classList.remove('bi-check2');  
                icon.classList.add('bi-pencil');
            }
        });
    }

    // Botão Editar Atributos
    const editAtributosButton = document.getElementById('edit-atributos-button');
    if(editAtributosButton){
        editAtributosButton.addEventListener('click', function(){
            const isEditing = this.classList.toggle('editing');
            const icon = this.querySelector('i.bi');
            const inputs = document.querySelectorAll('.atributos input[type="number"]');

            if(isEditing){
                inputs.forEach(input => input.removeAttribute('readonly'));
                icon.classList.remove('bi-pencil');
                icon.classList.add('bi-check2');
            } else{
                const updatedAttributes = {};
                inputs.forEach(input => {
                    updatedAttributes[input.id] = input.value;
                });

                fetch(`/ficha/atualizar_atributos/${fichaId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedAttributes)
                })
                .then(response => response.json())
                .then(data => {
                    if(data.mensagem){
                        console.log(data.mensagem);
                    } else if(data.erro){
                        alert(data.erro);
                    }
                })
                .catch(error => {
                    console.error('Erro ao atualizar atributos:', error);
                });

                inputs.forEach(input => input.setAttribute('readonly', 'true'));
                icon.classList.remove('bi-check2');  
                icon.classList.add('bi-pencil');
            }
        });
    }

});