import {habilidadesData, addHabilidade} from './Habilidades.js';
import {magiasData, listarMagias} from './Magias.js';
import {inventarioData, adicionarItem} from './Inventario.js';
import {arkanimoData, adicionarPoder} from './Arkamino.js';


document.addEventListener('DOMContentLoaded', () => {
    const fichaIdElement = document.getElementById('fichaIdData');
    const listaPericiasElement = document.getElementById('listaPericiasData');
    const periciaAtributoMapElement = document.getElementById('periciaAtributoMapData');
    const pvAtualData = document.getElementById('pvAtualData');
    console.log('Conteúdo de pvAtualData:', pvAtualData ? pvAtualData.textContent.trim() : 'Elemento não encontrado');
    const pmAtualData = document.getElementById('pmAtualData');
    console.log('Conteúdo de pmAtualData:', pmAtualData ? pmAtualData.textContent.trim() : 'Elemento não encontrado');
    const habilidadeHeaders = document.querySelectorAll('.habilidade-header');
    const habilidadesNomes = document.querySelectorAll('.habilidade-nome');
    const modal = document.getElementById('modal-habilidades');
    const closeButton = document.querySelector('.close-button');
    const confirmDeleteBtn = document.querySelector('#confirmDeleteBtn');
    const cancelDeleteBtn = document.querySelector('#cancelDeleteBtn');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    console.log("vueCropperApp global:", window.vueCropperApp);



    const fichaData = {
        fichaId: fichaIdElement ? fichaIdElement.textContent.trim() : ''
    };

    if (habilidadeHeaders.length > 0) {
        habilidadeHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const detalhes = header.nextElementSibling;
                if (detalhes) {
                    detalhes.style.display = detalhes.style.display === 'none' ? 'block' : 'none';
                }
            });
        });
    } else {
        console.warn('Nenhum elemento com a classe .habilidade-header encontrado.');
    }


    if(!fichaIdElement || !listaPericiasElement || !periciaAtributoMapElement){
        console.error('Elementos não encontrados');
        return;
    }

    const fichaId = fichaIdElement.textContent.trim();
    console.log(`ID da ficha: ${fichaId}`);
    const listaPericias = JSON.parse(listaPericiasElement.textContent);
    const periciaAtributoMap = JSON.parse(periciaAtributoMapElement.textContent);

    const atributos= {};

    const nivelSelect = document.getElementById('nivel');

    const atributosInputs = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'];

    const uploadFoto = document.getElementById('uploadFotoPersonagem');


    let cropper;

    if (uploadFoto && fichaIdElement) {
        uploadFoto.addEventListener('change', function () {
          const file = this.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log("vueCropperApp:", window.vueCropperApp);
                window.vueCropperApp.initialImage = e.target.result;
                openCropperModal();
            };
            reader.readAsDataURL(file);
          }
        });
      } else {
        console.error("Elemento 'uploadFotoPersonagem' ou 'fichaIdData' não encontrado.");
      }
    
      // Ao confirmar o recorte, chama o método Vue que cuida do upload e atualização
      const cropperConfirmBtn = document.getElementById('cropper-confirm-btn');
      if (cropperConfirmBtn) {
        cropperConfirmBtn.addEventListener('click', () => {
            window.vueCropperApp.$refs.cropperComponent.onConfirmCrop();
        });
      }
    
      function openCropperModal() {
        window.vueCropperApp.isCropperVisible = true;
        const modal = document.getElementById('cropper-modal');
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => {
                window.vueCropperApp.$nextTick(() => {
                    const cropperInstance = window.vueCropperApp.$refs.cropperComponent.$refs.cropper;
                    if (cropperInstance && typeof cropperInstance.update === "function") {
                        cropperInstance.update();
                    }
                });
            }, 500); // tente 500ms
        } else {
            console.warn("Modal de recorte não encontrado.");
        }
    }
    
      // Função global para fechar o modal
      window.closeCropperModal = function () {
        const modal = document.getElementById('cropper-modal');
        if (modal) {
          modal.style.display = 'none';
        }
      };
    

    //Vida e Mana\\

    const classesData = {
        'Arcanista': {
            basePV: 8,
            pvPorNivel: 2,
            basePM: 6,
            pmPorNivel: 6
        },
        'Barbaro': { 
            basePV: 24,
            pvPorNivel: 6,
            basePM: 3,
            pmPorNivel: 3
        },
        'Bardo': {
            basePV: 12,
            pvPorNivel: 3,
            basePM: 4,
            pmPorNivel: 4
        },
        'Bucaneiro': {
            basePV: 16,
            pvPorNivel: 4,
            basePM: 3,
            pmPorNivel: 3
        },
        'Cacador': { 
            basePV: 16,
            pvPorNivel: 4,
            basePM: 4,
            pmPorNivel: 4
        },
        'Cavaleiro': {
            basePV: 20,
            pvPorNivel: 5,
            basePM: 3,
            pmPorNivel: 3
        },
        'Clerigo': { 
            basePV: 16,
            pvPorNivel: 4,
            basePM: 5,
            pmPorNivel: 5
        },
        'Druida': {
            basePV: 16,
            pvPorNivel: 4,
            basePM: 4,
            pmPorNivel: 4
        },
        'Frade': {
            basePV: 12,
            pvPorNivel: 3,
            basePM: 6,
            pmPorNivel: 6
        },
        'Guerreiro': {
            basePV: 20,
            pvPorNivel: 5,
            basePM: 3,
            pmPorNivel: 3
        },
        'Inventor': {
            basePV: 12,
            pvPorNivel: 3,
            basePM: 4,
            pmPorNivel: 4
        },
        'Ladino': {
            basePV: 12,
            pvPorNivel: 3,
            basePM: 4,
            pmPorNivel: 4
        },
        'Lutador': {
            basePV: 20,
            pvPorNivel: 5,
            basePM: 3,
            pmPorNivel: 3
        },
        'Nobre': {
            basePV: 16,
            pvPorNivel: 4,
            basePM: 4,
            pmPorNivel: 4
        },
        'Paladino': {
            basePV: 20,
            pvPorNivel: 5,
            basePM: 3,
            pmPorNivel: 3
        }
        
    }

    if (!fichaIdElement) {
        console.error('Elemento fichaIdData não encontrado.');
        return;
    }

    console.log(`ID da ficha: ${fichaId}`);

    /* Elementos de PV */
    const pvAtualInput = document.getElementById('pv-atual');
    const pvMaximoInput = document.getElementById('pv-maximo');
    const barraPv = document.getElementById('barra-pv');

    /* Elementos de PM */
    const pmAtualInput = document.getElementById('pm-atual');
    const pmMaximoInput = document.getElementById('pm-maximo');
    const barraPm = document.getElementById('barra-pm');

    // Se os inputs de máximo não vêm preenchidos, use valores padrão
if (!pvMaximoInput.value || parseInt(pvMaximoInput.value, 10) === 0) {
    pvMaximoInput.value = 100; // exemplo de valor cheio para PV
}
if (!pmMaximoInput.value || parseInt(pmMaximoInput.value, 10) === 0) {
    pmMaximoInput.value = 50; // exemplo de valor cheio para PM
}

// Ajuste a lógica de PV para não forçar PV = PV Máximo
if (pvAtualData && pvAtualInput) {
    let savedPV = parseInt(pvAtualData.textContent.trim(), 10);
    if (!isNaN(savedPV)) {
        pvAtualInput.value = savedPV;
    }
}

if (pmAtualData && pmAtualInput) {
    let savedPM = parseInt(pmAtualData.textContent.trim(), 10);
    if (!savedPM) {
        savedPM = parseInt(pmMaximoInput.value, 10);
    }
    pmAtualInput.value = savedPM;
}

    const pvAtual = parseInt(pvAtualInput.value, 10) || 0;
    const pvMaximo = parseInt(pvMaximoInput.value, 10) || 0;
    atualizarBarraPV(pvAtual, pvMaximo, barraPv);

    const pmAtual = parseInt(pmAtualInput.value, 10) || 0;
    const pmMaximo = parseInt(pmMaximoInput.value, 10) || 0;
    atualizarBarraPM(pmAtual, pmMaximo, barraPm);
 

    const pvDecrease = document.querySelector('.pv-decrease');
    const pvIncrease = document.querySelector('.pv-increase');
    const pmDecrease = document.querySelector('.pm-decrease');
    const pmIncrease = document.querySelector('.pm-increase');

    if (pvDecrease && pvIncrease && pmDecrease && pmIncrease) {
        pvDecrease.addEventListener('click', () => alterarPontos('pv', -1));
        pvIncrease.addEventListener('click', () => alterarPontos('pv', 1));
        pmDecrease.addEventListener('click', () => alterarPontos('pm', -1));
        pmIncrease.addEventListener('click', () => alterarPontos('pm', 1));
    }

    if (pvAtualInput && pvMaximoInput) {
        pvAtualInput.addEventListener('blur', () => {
            const pvAtual = parseInt(pvAtualInput.value, 10) || 0;
            const pvMaximo = parseInt(pvMaximoInput.value, 10) || 0;
            salvarPV(pvAtual, pvMaximo);
        });
        pvMaximoInput.addEventListener('blur', () => {
            const pvAtual = parseInt(pvAtualInput.value, 10) || 0;
            const pvMaximo = parseInt(pvMaximoInput.value, 10) || 0;
            salvarPV(pvAtual, pvMaximo);
        });
    }

    if (pmAtualInput && pmMaximoInput) {
        pmAtualInput.addEventListener('blur', () => {
            const pmAtual = parseInt(pmAtualInput.value, 10) || 0;
            const pmMaximo = parseInt(pmMaximoInput.value, 10) || 0;
            salvarPM(pmAtual, pmMaximo);
        });
        pmMaximoInput.addEventListener('blur', () => {
            const pmAtual = parseInt(pmAtualInput.value, 10) || 0;
            const pmMaximo = parseInt(pmMaximoInput.value, 10) || 0;
            salvarPM(pmAtual, pmMaximo);
        });
    }

    /* Flags para alterações manuais (se necessário) */
    let pvMaximoManual = false;
    let pmMaximoManual = false;
    if (pvMaximoInput) {
        pvMaximoInput.addEventListener('input', () => {
            pvMaximoManual = true;
        });
    }
    if (pmMaximoInput) {
        pmMaximoInput.addEventListener('input', () => {
            pmMaximoManual = true;
        });
    }

    /* AlterarPontos não é o problema*/
    async function alterarPontos(tipo, valor) {
        let currentInput, maxInput, barra, updateRoute, dataBody, displayElement;
    
        if (tipo === 'pv') {
            currentInput = pvAtualInput;
            maxInput = pvMaximoInput;
            barra = barraPv;
            updateRoute = `/ficha/${fichaId}/atualizar_pv`;
            displayElement = pvAtualData;
        } else {
            currentInput = pmAtualInput;
            maxInput = pmMaximoInput;
            barra = barraPm;
            updateRoute = `/ficha/${fichaId}/atualizar_pm`;
            displayElement = pmAtualData;
        }
    
        
        let current = parseInt(currentInput.value, 10) || 0;
        let max = parseInt(maxInput.value, 10) || 0;

        let newValue = Math.min(max, Math.max(0, current + valor));
    
        if (tipo === 'pv') {
            atualizarBarraPV(newValue, max, barra);
        } else {
            atualizarBarraPM(newValue, max, barra);
        }
        currentInput.value = newValue;
        if (displayElement) {
            displayElement.textContent = newValue;
        }
    
        // Prepara os dados para enviar ao servidor
        if (tipo === 'pv') {
            dataBody = { pvAtual: newValue, pvMaximo: max };
        } else {
            dataBody = { pmAtual: newValue, pmMaximo: max };
        }
    
        // Envia a atualização ao servidor
        try {
            const response = await fetch(updateRoute, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataBody),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao atualizar pontos');
            }
    
            const data = await response.json();
            console.log('Pontos atualizados com sucesso:', data);
        } catch (error) {
            console.error('Erro ao atualizar pontos:', error);
            alert('Não foi possível salvar as alterações. Tente novamente.');
        }
    }

    /* Funções de salvar via fetch */
    async function salvarPV(atual, maximo) {
        console.log('salvarPV iniciado com valores -> atual:', atual, 'máximo:', maximo);
        try {
            const response = await fetch(`/ficha/${fichaId}/atualizar_pv`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pvAtual: atual, pvMaximo: maximo }),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao salvar PV');
            }
    
            const data = await response.json();
            console.log('PV salvo:', data);
            atualizarBarraPV(atual, maximo, barraPv);
        } catch (error) {
            console.error('Erro ao salvar PV:', error);
            alert('Não foi possível salvar as alterações de PV. Tente Novamente');
        }
    }

    async function salvarPM(atual, maximo) {
        console.log('salvarPM iniciado com valores -> atual:', atual, 'máximo:', maximo);
        try {
            const response = await fetch(`/ficha/${fichaId}/atualizar_pm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pmAtual: atual, pmMaximo: maximo }),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar PM');
            }

            const data = await response.json();
            console.log('PM salvo:', data);
            atualizarBarraPM(atual, maximo, barraPm);
        } catch (error) {
            console.error('Erro ao salvar PM:', error);
            alert('Não foi possível salvar as alterações de PM. Tente Novamente');
        }
    }

    async function carregarDadosFicha() {
        try {
          const response = await fetch(`/ficha/${fichaId}/dados`);
          if (!response.ok) {
            throw new Error('Falha ao buscar os dados da ficha');
          }
          const dados = await response.json();
          // Atualiza os inputs de PV
          if (pvAtualInput && dados.pontosDeVidaAtual !== undefined) {
            pvAtualInput.value = dados.pontosDeVidaAtual;
            atualizarBarraPV(dados.pontosDeVidaAtual, dados.pontosDeVidaMax, barraPv);
          }
          // Atualize também PM se necessário...
        } catch (error) {
          console.error('Erro ao carregar dados da ficha:', error);
        }
      }

      carregarDadosFicha();

      function atualizarBarraPV(atual, maximo, barra) {
        if (!maximo || maximo <= 0) {
            console.error('PV Máximo inválido:', maximo);
            return;
        }
        const percentual = (atual / maximo) * 100;
        console.log(`PV Atual: ${atual}, PV Máximo: ${maximo}, Percentual: ${percentual}%`);
        
        barra.style.width = `${percentual}%`;
        
        let cor;
        if (percentual < 25) {
            cor = 'vermelha';
        } else if (percentual <= 50) {
            cor = 'amarela';
        } else {
            cor = 'verde';
        }
        console.log(`Cor PV selecionada: ${cor}`);
        
        // Atualiza as classes da barra
        barra.classList.remove('barra-verde', 'barra-amarela', 'barra-vermelha');
        barra.classList.add(`barra-${cor}`);
        
        alterarFundoBarraPV(barra, cor);
    }
    
    function alterarFundoBarraPV(barra, cor) {
        const barraContainer = barra.parentElement;
        barraContainer.classList.remove('fundo-verde', 'fundo-amarela', 'fundo-vermelha');
        barraContainer.classList.add(`fundo-${cor}`);
    }

    /* Função para atualizar a barra de PM */
    function atualizarBarraPM(atual, maximo, barra) {
        if (!maximo || maximo <= 0) {
            console.error('PM Máximo inválido:', maximo);
            return;
        }
        const percentual = (atual / maximo) * 100;
        console.log(`PM Atual: ${atual}, PM Máximo: ${maximo}, Percentual: ${percentual}%`);

        barra.style.width = `${percentual}%`;

        let cor;
        if (percentual <= 25) {
            cor = 'vermelha';
        } else if (percentual <= 50) {
            cor = 'amarela';
        } else {
            cor = 'verde';
        }
        console.log(`Cor PM selecionada: ${cor}`);

        /* Atualiza as classes da barra */
        barra.classList.remove('barra-pm-verde', 'barra-pm-amarela', 'barra-pm-vermelha');
        barra.classList.add(`barra-pm-${cor}`);
        console.log(`Classes PM após atualização: ${barra.className}`);

        alterarFundoBarraPM(barra, cor);
    }

    /* Função para atualizar o fundo da barra de PM */
    function alterarFundoBarraPM(barra, cor) {
        const barraContainer = barra.parentElement;
        barraContainer.classList.remove('fundo-pm-verde', 'fundo-pm-amarela', 'fundo-pm-vermelha');
        barraContainer.classList.add(`fundo-pm-${cor}`);
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

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if(modal){
            modal.style.display = 'block';
            console.log(`Abrindo modal: ${modalId}`);
        } else {
            console.warn(`Modal com ID '${modalId}' não encontrado.`);
        }
    }

    function closeModal(modalId){
        const modal = document.getElementById(modalId);
        if(modal){
            modal.style.display = 'none';
            console.log(`Fechando modal: ${modalId}`);
        }
    }

    function setupModal(addButtonId, modalId){
        const addButton = document.getElementById(addButtonId);
        const modal = document.getElementById(modalId);

        if(addButton && modal){
            addButton.addEventListener('click', () => {
                openModal(modalId);
            });

            modal.addEventListener('click', (event) => {
                if(event.target.classList.contains('close-button') || event.target === modal){
                    closeModal(modalId);
                }
            });

            console.log(`Modal '${modalId}' configurado para o botão '${addButtonId}'.`);
        } else {
            if(!addButton){
                console.warn(`Botão com ID '${addButtonId}' não encontrado.`);
            }
            if(!modal){
                console.warn(`Modal com ID '${modalId}' não encontrado.`);
            }
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
        addHabilidadeBtn.addEventListener('click', () => {
            console.log("'add-habilidade' foi clicado.");
            openModal('modal-habilidades');
        });
    } else {
        console.warn("Elemento 'add-habilidade' não encontrado.");
    }

    const editHabInfoButton = document.getElementById('edit-info-button');
    if(editHabInfoButton){
        editHabInfoButton.addEventListener('click', function(event){

        });
    } else {
        console.warn("Elemento 'edit-info-button' não encontrado.");
    }

    const etapasHabilidadesElement = document.getElementById('etapas-habilidades');
if(etapasHabilidadesElement){
    etapasHabilidadesElement.addEventListener('click', function(event){
        if(event.target.tagName === 'LI'){
            const itens = document.querySelectorAll('#etapas-habilidades li');
            itens.forEach(item => item.classList.remove('active'));

            event.target.classList.add('active');

            const step = event.target.dataset.step;
            console.log(`Step selecionado: ${step}`);
            const respostas = respostasHabilidadesData[step];
            console.log(`Respostas para o step ${step}:`, respostas);

            if(!habilidadesData || !habilidadesData[step]){
                console.error(`habilidadesData não contém o step: ${step}`);
                return;
            }

            const options = Object.keys(habilidadesData[step]);
            console.log(`Opções para o step ${step}:`, options);

            mostrarRespostas(step, options);

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
} else {
    console.warn("Elemento com ID 'etapas-habilidades' não encontrado.");
}

function mostrarRespostas(step, options){
    const respostasContainer = document.getElementById('respostas-habilidades');
    respostasContainer.innerHTML = '';

    if(!habilidadesData || !habilidadesData[step]){
        console.error(`habilidadesData não contém o step: ${step}`);
        return;
    }

    console.log(`Exibindo opções para o step ${step}:`, options);

    options.forEach(function(option){
        const li = document.createElement('li');
        li.textContent = option;
        li.dataset.option = option;
        li.dataset.step = step;

        li.addEventListener('click', function(){
            const optionItens = respostasContainer.querySelectorAll('li');
            optionItens.forEach(item => item.classList.remove('active'));

            li.classList.add('active');

            mostrarListaDeHabilidades(step, option);
        });
        respostasContainer.appendChild(li);
    });
    respostasContainer.style.display = 'flex';
}

    const respostasHabilidadesData = {
        habilidadeRaca: ['Clássico', 'Ameaças de Arton', 'Deuses e Heróis', 'História dos Selos'],
        habilidadeClasse: ['Habilidades', 'Poderes'],
        poderesConcedidos: ['Aima', 'Moguto', 'Tago', 'Fidus', 'Ekvilli', 'Mythos', 'Mallumo', 'Rideto', 'Osto'],
        poderesSelos: ['Poderes Gerais', 'Poderes Rúnicos'],
    }


    function mostrarListaDeHabilidades(step, option){
        const habilidades = habilidadesData[step]?.[option];
        if (!habilidades) {
            console.error(`Habilidades não encontradas para step: ${step}, option: ${option}`);
            return;
        }
    
        const listaContainer = document.getElementById('lista-habilidades-disponiveis');
        if (!listaContainer) {
            console.error('Elemento "lista-habilidades-disponiveis" não encontrado.');
            return;
        }
        listaContainer.innerHTML = '';
    
        habilidades.forEach(function(habilidade){
            const habilidadeDiv = document.createElement('div');
            habilidadeDiv.classList.add('habilidade-item');
    
            const habilidadeHeader = document.createElement('div');
            habilidadeHeader.classList.add('habilidade-header');    
    
            const nome = document.createElement('div');
            nome.textContent = habilidade.nome;
            nome.classList.add('habilidade-nome');
    
            const descricao = document.createElement('div');
            descricao.textContent = habilidade.descricao;
            descricao.classList.add('habilidade-descricao');
            descricao.style.maxHeight = '0';    
            descricao.style.overflow = 'hidden';
            descricao.style.transition = 'max-height 0.3s ease-out';
    
            const arrowIcon = document.createElement('i');
            arrowIcon.classList.add('bi', 'bi-chevron-down');
    
            nome.appendChild(arrowIcon);
    
            habilidadeHeader.addEventListener('click', function(){ 
                const allDescriptions = document.querySelectorAll('.habilidade-descricao');
                allDescriptions.forEach(desc => {
                    if(desc !== descricao){
                        desc.style.maxHeight = '0';
                    }
                });
    
                if(descricao){
                    const isOpen = descricao.style.maxHeight && descricao.style.maxHeight !== '0px';
                    if(isOpen){
                        descricao.style.maxHeight = '0';
                        arrowIcon.classList.replace('bi-chevron-up', 'bi-chevron-down');
                    } else{
                        descricao.style.maxHeight = descricao.scrollHeight + 'px';
                        arrowIcon.classList.replace('bi-chevron-down', 'bi-chevron-up');
                    }
                } else {
                    console.error('Elemento "descricao" não encontrado.');
                }
            });
    
            const addButton = document.createElement('button');
            addButton.innerHTML = '<i class="bi bi-plus"></i>';
            addButton.classList.add('habilidade-add-button');
            addButton.addEventListener('click', function(event){
                event.stopPropagation();    
                adicionarHabilidade(habilidade);
            });
    
            habilidadeHeader.appendChild(nome);
            habilidadeHeader.appendChild(addButton);
            habilidadeDiv.appendChild(habilidadeHeader);
            habilidadeDiv.appendChild(descricao);
            listaContainer.appendChild(habilidadeDiv);
        });
    
        listaContainer.style.display = 'block';
        const respostasHabilidades = document.getElementById('respostas-habilidades');
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

    function voltarEtapas(){
        document.getElementById('lista-habilidades-disponiveis').style.display = 'none';
        document.getElementById('respostas-habilidades').style.display = 'flex';
        etapasHabilidadesElement.style.display = 'flex';
        document.getElementById('voltar-etapas').style.display = 'none';
    }

    window.voltarEtapas = function(){
        const etapasHabilidadesElement = document.getElementById('etapas-habilidades');
        if(etapasHabilidadesElement){
            etapasHabilidadesElement.style.display = 'block';
        }

        const respostasHabilidades = document.getElementById('respostas-habilidades');
        if(respostasHabilidades){
            respostasHabilidades.style.display = 'none';
        }

        const listaHabilidadesDis = document.getElementById('lista-habilidades-disponiveis');
        if(listaHabilidadesDis){
            listaHabilidadesDis.style.display = 'none';
        }   

        const voltarEtapasBtn = document.getElementById('voltar-etapas');
        if(voltarEtapasBtn){
            voltarEtapasBtn.style.display = 'none';
        }
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

    //Vida e Mana\\
    const classeSelect = document.getElementById('classe');

    if(classeSelect){
        classeSelect.addEventListener('change', () => {
            calcularPontos();
            atualizarFichaClasse(classeSelect.value);
        });
    }

    function calcularPontos() {
    console.log('Início de calcularPontos');
    const nivel = parseInt(nivelSelect.value) || 1;
    console.log(`Nível selecionado: ${nivel}`);
    
    const constituicaoInput = document.getElementById('constituicao');
    const constituicao = parseInt(constituicaoInput.value) || 0;
    console.log(`Constituição: ${constituicao}`);
    
    const classe = classeSelect.value;
    console.log(`Classe selecionada: ${classe}`);
    
    if (classesData[classe]) {
        const classeInfo = classesData[classe];
        const pvBase = classeInfo.basePV + constituicao;
        const pvNivel = (nivel - 1) * classeInfo.pvPorNivel;
        const pvTotalCalculado = pvBase + pvNivel;
        console.log(`PV Base: ${pvBase}, PV por Nível: ${pvNivel}, PV Total: ${pvTotalCalculado}`);
        
        const pmBase = classeInfo.basePM;
        const pmNivel = (nivel - 1) * classeInfo.pmPorNivel;
        const pmTotalCalculado = pmBase + pmNivel;
        console.log(`PM Base: ${pmBase}, PM por Nível: ${pmNivel}, PM Total: ${pmTotalCalculado}`);
        
        if(!pvMaximoManual){
            pvMaximoInput.value = pvTotalCalculado;
        }

        if(!pmMaximoManual){
            pmMaximoInput.value = pmTotalCalculado;
        }

        atualizarBarraPV(parseInt(pvAtualInput.value) || 0, parseInt(pvMaximoInput.value) || 0, barraPv);
        atualizarBarraPM(parseInt(pmAtualInput.value) || 0, parseInt(pmMaximoInput.value) || 0, barraPm);
    } else {
        console.error(`Classe "${classe}" não encontrada em classesData.`);
    }
}

// Assegure-se de que os valores atuais sejam carregados do banco de dados corretamente
document.addEventListener('DOMContentLoaded', () => {
    console.log(`Valor inicial de nivelSelect: ${nivelSelect.value}`);
    calcularPontos();
});
    
    // Verifique o valor inicial de 'nivelSelect' após o DOM carregar
    document.addEventListener('DOMContentLoaded', () => {
        console.log(`Valor inicial de nivelSelect: ${nivelSelect.value}`);
        calcularPontos();
    });

    const atualizarNivelNoServidor = async (nivel) => {
        try {
            const response = await fetch(`/ficha/${fichaId}/atualizar_nivel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nivel })
            });

            if(!response.ok){
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao atualizar nível');
            }

            const data = await response.json();
            console.log(data.mensagem);
        } catch (error) {
            console.error('Erro ao atualizar nível:', error);
            alert('Não foi possível atualizar o nível. Tente novamente.');
        }
    };

    if(nivelSelect){
        nivelSelect.addEventListener('change', () => {
            const nivel = nivelSelect.value;
            atualizarNivelNoServidor(nivel);
            calcularPontos();
            listaPericias.forEach(pericia => calcularTotal(pericia));
        });
    }

    const constituicaoInput = document.getElementById('constituicao');
    if(constituicaoInput){
        constituicaoInput.addEventListener('input', calcularPontos);
    }

    classeSelect.addEventListener('change', () => {
        atualizarFichaClasse(classeSelect.value);
        calcularPontos();
    });

    function atualizarFichaClasse(novaClasse){
        fetch(`/ficha/atualizar_classe/${fichaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({classe: novaClasse })
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao atualizar classe no servidor');
            }
            return response.json();
        })
        .then(data => {
            if(!data.sucesso){
                alert('Erro ao atualizar classe no servidor.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }




    

    // pericias \\

    const atributoIdMap = {
        FOR: 'forca',
        DES: 'destreza',
        CON: 'constituicao',
        INT: 'inteligencia',
        SAB: 'sabedoria',
        CAR: 'carisma',
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
            calcularPontos();
            atualizarNivelNoServidor(nivelSelect.value);
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


    //Adicionar e Salvar Habilidade, Magia, Inventário e Arkamino\\
    function adicionarHabilidade(habilidade) {
        fetch('/ficha/adicionar_habilidade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
                adicionarAoDocumento('habilidades',habilidade.nome, habilidade.descricao);
                salvarNoLocalStorage('habilidades', habilidade);
            } else{
                alert('Erro ao adicionar habilidade: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

     
    function addMagia(magia) {
        fetch('/ficha/adicionar_magia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fichaId: fichaData.fichaId,
                magia: magia
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
                adicionarAoDocumento('magias', magia, 'Descrição do Item');
                salvarNoLocalStorage('magias', magia);
            } else{
                alert('Erro ao adicionar magias: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

     
    function addItem(Item) {
        fetch('/ficha/adicionar_item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fichaId: fichaData.fichaId,
                item: item
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
                adicionarAoDocumento('item', item, 'Descrição do Item');
                salvarNoLocalStorage('item', item);
            } else{
                alert('Erro ao adicionar item: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

     
    function addArkaminooPoder(poder) {
        fetch('/ficha/adicionar_arkamino_poder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fichaId: fichaData.fichaId,
                arkanimo: arkanimo
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
                adicionarAoDocumento('arkamino', arkamino, 'Descrição do Poder');
                salvarNoLocalStorage('arkamino', arkamino);
            } else{
                alert('Erro ao adicionar habilidade: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

     function adicionarAoDocumento(tipo, nome, descricao){
        const listaElement = document.getElementById(`lista-${tipo}`);
        if(listaElement){
            
            const container = document.createElement('div');
            container.classList.add(`${tipo}-item`);
            container.id = `habilidade-${Date.now()}`;

            const header = document.createElement('div');
            header.classList.add(`${tipo}-header`);

            const title = document.createElement('div');
            title.textContent = nome;
            title.classList.add(`${tipo}-nome`);

            const arrowIcon = document.createElement('i');
            arrowIcon.classList.add('bi', 'bi-chevron-down');
            title.appendChild(arrowIcon);

            const trashIcon = document.createElement('i');
            trashIcon.classList.add('bi', 'bi-trash', 'trash-icon');
            trashIcon.style.marginLeft = 'auto';
            trashIcon.style.cursor = 'pointer';
            header.appendChild(trashIcon);

            header.appendChild(title);
            container.appendChild(header);

            const description = document.createElement('div');
            description.textContent = descricao;
            description.classList.add(`${tipo}-descricao`);
            description.style.maxHeight = '0';
            description.style.overflow = 'hidden';
            description.style.transition = 'max-height 0.3s ease-out';

            container.appendChild(description);

            container.addEventListener('click', () => {
                const isOpen = description.style.maxHeight && description.style.maxHeight !== '0px';
                if(isOpen){
                    description.style.maxHeight = '0';
                    arrowIcon.classList.replace('bi-chevron-up', 'bi-chevron-down');
                } else{
                    description.style.maxHeight = description.scrollHeight + 'px';
                    arrowIcon.classList.replace('bi-chevron-down', 'bi-chevron-up');
                }

            });

            trashIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                const modal = document.getElementById('confirmDeleteModal');
                if(modal){
                    modal.style.display = 'block';
                    modal.dataset.targetId = container.id;
                    modal.dataset.habilidadeNome = nome;
                    modal.dataset.containerId = container.id;
                    modal.dataset.containerElement = container;
                }
            })

            listaElement.appendChild(container);
        }


        const modalContainer = document.getElementById(`modal-${tipo}-container`);
        if(modalContainer){
            const container = document.createElement('div');
            container.classList.add(`${tipo}-item`);

            const titulo = document.createElement('span');
            titulo.textContent = nome;
            titulo.classList.add(`${tipo}-nome`);
            titulo.style.cursor = 'pointer';

            titulo.addEventListener('click', () => {
                alert(descricao);
            });

            container.appendChild(titulo);
            modalContainer.appendChild(container);
        }
     }

     function salvarNoLocalStorage(tipo, item){
        let dados = JSON.parse(localStorage.getItem(tipo)) || [];
        dados.push(item);
        localStorage.setItem(tipo, JSON.stringify(dados));
     }

     function carregarDoLocalStorage(tipo){
        let dados = JSON.parse(localStorage.getItem(tipo)) || [];
        dados.forEach(item => {
            let nome = item.nome;
            let descricao = item.descricao || 'Descrição não disponível';
            adicionarAoDocumento(tipo, nome, descricao);
        });
     }

     habilidadesNomes.forEach(nome => {
        nome.addEventListener('click', () => {
            const descricao = nome.nextElementSibling;
    
            if (!descricao) {
                console.error('Descrição não encontrada para:', nome);
                return;
            }
    
            descricao.classList.toggle('active');
    
            const icon = nome.querySelector('i.bi');
            if (descricao.classList.contains('active')) {
                icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
                descricao.style.maxHeight = `${descricao.scrollHeight}px`;
            } else {
                icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
                descricao.style.maxHeight = '0';
            }
        });
    });

    if (confirmDeleteBtn && cancelDeleteBtn && closeButton) {
        closeButton.addEventListener('click', () => {
            confirmDeleteModal.style.display = 'none';
        });
    
        // Fechar o modal ao clicar em 'Não'
        cancelDeleteBtn.addEventListener('click', () => {
            confirmDeleteModal.style.display = 'none';
        });
    
        // Confirmar a exclusão
        confirmDeleteBtn.addEventListener('click', () => {
            const targetId = confirmDeleteModal.dataset.targetId;
            const container = document.getElementById(targetId);
    
            if(container){
                const habilidadeNome = confirmDeleteModal.dataset.habilidadeNome;
                const fichaId = fichaData.fichaId;

                console.log('HabilidadeNome enviado:', habilidadeNome);
    
                console.log('Removendo habilidade:', {
                    fichaId,
                    habilidadeNome
                });
                
                fetch(`/ficha/remover_habilidade/${fichaId}`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ habilidadeNome })
                })
                .then(response => {
                    if(!response.ok){
                        return response.text().then(text => {throw new Error(text || response.statusText) });
                    }
                    console.log('Status da resposta:', response.status);
                    console.log('Headers da resposta:', response.headers);
                    return response.json();
                })
                .then(data => { 
                    console.log('Dados recebidos do servidor:', data);
                    if(data.success){
                        container.remove();
                    } else {
                        alert('Erro ao remover habilidade: ' + data.message);
                    }
                })
                .catch(error => { 
                    console.error('Erro:', error);
                    alert('Erro ao remover a habilidade:' + error.message);
                });
            }
            confirmDeleteModal.style.display = 'none';
        });
    } else {
        console.error('Elementos do modal não encontrados. Verifique os IDs no HTML.');
    }
     





     
     ['habilidades', 'magias', 'item', 'arkamino'].forEach(tipo => carregarDoLocalStorage(tipo));

});