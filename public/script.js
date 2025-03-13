
console.log('script.js carregado');

// Login e Registro

document.getElementById('loginForm')?.addEventListener('submit', async(event) => {
    event.preventDefault();
    console.log('Login form submitted');
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    console.log('Dados enviados para login:', data);

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'same-origin' // Adicione esta linha para enviar cookies
    });

    const result = await response.json();
    console.log('Resultado do login:', result);

    if (result.erro) {
        document.getElementById('erroMsg').style.display = 'block';
        document.getElementById('erroMsg').textContent = "Email ou Senha incorretos. Tente Novamente.";
    } else {
        window.location.href = '/configuracoes_usuario';
    }
});

document.getElementById('registrarForm')?.addEventListener('submit', async(event) => {
    event.preventDefault();
    console.log('Registrar form submitted');
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    console.log('Dados enviados para registro:', data);

    if(data.senha !== data.confirmaSenha){
        document.getElementById('erroMsg').style.display = 'block';
        document.getElementById('erroMsg').textContent = 'As senhas não coincidem. Tente novamente.';
        return;
    }

    const response = await fetch('/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('Resultado do registro:', result);

    if(result.erro){
        document.getElementById('erroMsg').style.display = 'block';
        document.getElementById('erroMsg').textContent = result.erro;
    } else{
        window.location.href = '/login';
    }
});


// Atualizar Senha
document.getElementById('updatePasswordForm')?.addEventListener('submit', async(event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
        alert('As senhas não coincidem. Tente novamente.');
        return;
    }

    const response = await fetch('/atualizar_senha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.erro) {
        alert(result.erro);
    } else {
        alert('Senha atualizada com sucesso!');
    }
});

// Atualizar Foto de Perfil
document.getElementById('uploadProfilePictureForm')?.addEventListener('submit', async(event) => {
    event.preventDefault();
    const fileInput = document.getElementById('uploadFotodePerfil');
    const file = fileInput.files[0];
    console.log('Arquivo selecionado no submit event:', file);
    if (!file) {
        alert('Por favor, selecione um arquivo.');
        return;
    }
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
    }
    const formData = new FormData();
    formData.append('uploadFotodePerfil', file);

    const response = await fetch('/atualizar_foto_perfil', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    if (result.erro) {
        alert(result.erro);
    } else {
        const url = result.caminho;
        document.getElementById('profileButton').style.backgroundImage = `url(${url})`;
        document.getElementById('profileLink').style.backgroundImage = `url(${url})`;
        localStorage.setItem('fotoPerfil', url);

        const messageDiv = document.getElementById('profileUpdateMessage');
        messageDiv.style.display = 'block';
        messageDiv.textContent = 'Foto de perfil atualizada com sucesso!';

        const wrapper = document.querySelector('.wrapper');
        wrapper.style.height = `${wrapper.offsetHeight + 50}px`;

        setTimeout(() => {
            messageDiv.style.display = 'none';
            wrapper.style.height = `${wrapper.offsetHeight - 50}px`;
        }, 5000);
    }
});

document.getElementById('uploadFotodePerfil')?.addEventListener('change', (event) => {
    const file = event.target.files[0];
    console.log('Arquivo selecionado no change event:', file);
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
    }
    const reader = new FileReader();

    reader.onload = function(e) {
        const Urlfotoperfil = e.target.result;
        document.getElementById('profileButton').style.backgroundImage = `url(${Urlfotoperfil})`;
        document.getElementById('profileLink').style.backgroundImage = `url(${Urlfotoperfil})`;
        localStorage.setItem('fotoPerfil', Urlfotoperfil);
    };

    reader.readAsDataURL(file);
});


document.getElementById('editUsernameBtn')?.addEventListener('click', () => {
    const wrapper = document.querySelector('.wrapper');
    wrapper.style.height = `${wrapper.offsetHeight +100}px`;

    document.getElementById('usernameSection')?.style.setProperty('display', 'none');
    document.getElementById('updateUsernameForm')?.style.setProperty('display', 'block');
});

document.getElementById('username')?.addEventListener('input', () => {
    document.querySelector('#updateUsernameForm .btn').style.display = 'block';
});


document.getElementById('editEmailBtn')?.addEventListener('click', () => {
    const wrapper = document.querySelector('.wrapper');
    wrapper.style.height = `${wrapper.offsetHeight +120}px`;

    document.getElementById('emailSection')?.style.setProperty('display', 'none');
    document.getElementById('updateEmailForm')?.style.setProperty('display', 'block');
});

document.getElementById('email')?.addEventListener('input', () => {
    document.querySelector('#updateEmailForm .btn').style.display = 'block';
});


window.addEventListener('load', async () => {
    const response = await fetch('/usuario_atual');
    const data = await response.json();
    console.log('Dados do usuário:', data);

    if (data) {
        document.getElementById('currentUsername').textContent = data.username;
        document.getElementById('currentEmail').textContent = data.email;
        if (data.fotoPerfil) {
            console.log('Caminho da foto de perfil:', data.fotoPerfil);
            document.getElementById('profileButton').style.backgroundImage = `url(${data.fotoPerfil})`;
            document.getElementById('profileLink').style.backgroundImage = `url(${data.fotoPerfil})`;
            localStorage.setItem('fotoPerfil', data.fotoPerfil);
        }
    }
});


console.log('Cookies:', document.cookie);

window.addEventListener('load', async () => {
    try{
    const response = await fetch('/usuario_atual');
    const data = await response.json();
    console.log('Dados do usuário:', data); 

    if (data) {
        const currentUsernameElement = document.getElementById('currentUsername');
        const currentEmailElement = document.getElementById('currentEmail');

        if(currentUsernameElement){
            currentUsernameElement.textContent = data.username;
        } 
        if(currentEmailElement){
            currentEmailElement.textContent = data.email;
        }
        
        if (data.fotoPerfil) {
            document.getElementById('profileButton')?.style.setProperty('background-image', `url(${data.fotoPerfil})`);
            document.getElementById('profileLink')?.style.setProperty('background-image', `url(${data.fotoPerfil})`);
            localStorage.setItem('fotoPerfil', data.fotoPerfil);
        }
    }

    const Urlfotoperfil = localStorage.getItem('fotoPerfil');
    if (Urlfotoperfil) {
        console.log('Foto de perfil do localStorage:', Urlfotoperfil);
        document.getElementById('profileButton').style.backgroundImage = `url(${Urlfotoperfil})`;
        document.getElementById('profileLink').style.backgroundImage = `url(${Urlfotoperfil})`;
    }
} catch (error){
    console.error('Erro ao carregar dados do usuário:', error);
}
});

window.addEventListener('load', carregarDadosUsuario);

document.getElementById('profileButton')?.addEventListener('click', () => {
    document.getElementById('uploadFotodePerfil').click();
});

document.getElementById('uploadFotodePerfil')?.addEventListener('change', (event) => {
    const file = event.target.files[0];
    console.log('Arquivo selecionado no change event:', file); 
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
    }
    const reader = new FileReader();

    reader.onload = function(e) {
        const Urlfotoperfil = e.target.result;
        document.getElementById('profileButton').style.backgroundImage = `url(${Urlfotoperfil})`;
        document.getElementById('profileLink').style.backgroundImage = `url(${Urlfotoperfil})`;
        localStorage.setItem('fotoPerfil', Urlfotoperfil);
    };

    reader.readAsDataURL(file);
});

document.getElementById('uploadFotodePerfil')?.addEventListener('change', (event) => {
    const file = event.target.files[0];
    console.log('Arquivo selecionado no change event:', file); 
});

document.getElementById('profileButton')?.addEventListener('click', () => {
    document.getElementById('uploadFotodePerfil').click();
});

const profileButton = document.getElementById('profileButton');
profileButton?.addEventListener('click', () => {
    document.getElementById('uploadFotodePerfil').click();
});





document.getElementById('nova_ficha')?.addEventListener('click', () => {
    window.location.href = '/nova_ficha';
});


let ficha = {
    primeiraRaca: '',
    classe: '',
    origem: '',
    arkamino: '',
};

function resetFicha(){
    ficha = {
        primeiraRaca: '',
        classe: '',
        origem: '',
        arkamino: '',
    };
}

let currentStep = 0;

function showStep(index){
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, i) => {
        step.classList.toggle('active', i === index);
    });
    console.log(`Exibindo passo: ${index}`);
}

function proximoPasso(){
    currentStep++;
    showStep(currentStep);
}

function coletarDadosPasso(chave, valor){
    ficha[chave] = valor;
    console.log(`Dados da ficha atualizados: ${chave} = ${valor}`);
}

async function enviarFicha(){
    try{
        const response = await fetch('/salvarFicha', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(ficha),
            credentials: 'include',
        });

        if(!response.ok){
            const erroMsg = await response.text();
            throw new Error(`Erro: ${erroMsg}`);
        }

        const result = await response.json();
        console.log('Ficha completa salva no servidor:', result);

        window.location.href = `/ficha/${result.fichaId}`;
    } catch(error){
        console.error('Erro ao salvar a ficha:', error);
        alert('Erro ao salvar a ficha. Tente novamente.');
    }
}

async function enviarDados(url,dado,tipo){
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ [tipo]: dado}),
            credentials: 'include',
        });

        if(!response.ok){
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`${tipo} salvo no servidor:`, result);
        if(tipo === 'arkamino'){
            await enviarFicha();
        } else{
            proximoPasso();
        }
    } catch(error){
        console.error(`Erro ao enviar ${tipo}:`, error);
    }
}

function coletarDadosPasso(chave, valor){
    ficha[chave] = valor;
    console.log(`Dados da ficha atualizados: ${chave} = ${valor}`);
}

async function carregarDadosUsuario(){
    try{
        const response = await fetch('/usuario_atual');
        if(!response.ok){
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados do usuário:', data);

        if(data){
            const currentUsernameElement = document.getElementById('currentUsername');
            const currentEmailElement = document.getElementById('currentEmail');

            if(currentUsernameElement){
                currentUsernameElement.textContent = data.username;
            } else{
                console.error('Elemento com ID "currentUsername" não encontrado.');
            }

            if(currentEmailElement){
                currentEmailElement.textContent = data.email;
            } else{
                console.error('Elemento com ID "currentEmail" não encontrado.');
            }

            if(data.fotoPerfil){
                document.getElementById('profileButton').style.backgroundImage = `url(${data.fotoPerfil})`;
                document.getElementById('profileLink').style.backgroundImage = `url(${data.fotoPerfil})`;
                localStorage.setItem('fotoPerfil', data.fotoPerfil);
            } else{
                const defaultFoto = '/images/default-profile.png';
                document.getElementById('profileButton').style.backgroundImage = `url(${defaultFoto})`;
                document.getElementById('profileLink').style.backgroundImage = `url(${defaultFoto})`;
            }
    }
} catch(error){
    console.error('Erro ao carregar dados do usuário:', error);
}

}

async function salvarFicha(){
    const nomePersonagem = document.getElementById('nomePersonagem').value.trim();
    const nomeJogador = document.getElementById('nomeJogador').value.trim();
    const descricao = document.getElementById('descricao').value.trim();

    if(!nomePersonagem || !nomeJogador || !descricao){
        alert('Preencha todos os campos.');
        return;
    }

    ficha.identidade = { nomePersonagem, nomeJogador, descricao };

    try{
        const response = await fetch('/salvarFicha', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(ficha),
            credentials: 'include',
        });

        if(!response.ok){
            const erroMsg = await response.text();
            throw new Error(`Erro: ${erroMsg}`);
        }

        const result = await response.json();
        alert('Ficha salva com sucesso!');
        console.log('Ficha completa salva no servidor:', result);
        showStep(currentStep + 1);
    } catch(error){
        console.error('Erro ao salvar a ficha:', error);
        alert('Erro ao salvar a ficha. Tente novamente.');
    }
}
 

let selectedRace = '';
let selectedSecondRace = '';
let selectedClass = '';
let selectedOrigin = '';
let selectedArkamino = '';


document.addEventListener('DOMContentLoaded', function() {
    carregarDadosUsuario();
    console.log('DOM carregada para toggle-info');

    const Urlfotoperfil = localStorage.getItem('fotoPerfil');
    if (Urlfotoperfil) {
        console.log('Foto de perfil do localStorage:', Urlfotoperfil);
        document.getElementById('profileButton').style.backgroundImage = `url(${Urlfotoperfil})`;
        document.getElementById('profileLink').style.backgroundImage = `url(${Urlfotoperfil})`;
    }

    initToggleButtons('.race-button', '.race-content');
    initToggleButtons('.class-button', '.class-content');
    initToggleButtons('.origin-button', '.origin-content');
    initToggleButtons('.arkamino-button', '.arkamino-content');

    
    const deleteIcons = document.querySelectorAll('.delete-icon');
    
    
    const modal = document.getElementById('modalConfirmDelete');
    let closeButton, cancelButton, deleteForm;
    if (modal) {
        closeButton = modal.querySelector('.close-button');
        cancelButton = document.getElementById('cancelButton');
        deleteForm = document.getElementById('deleteForm');
    } else {
        console.warn('Elemento modalConfirmDelete não encontrado.');
    }

    function initToggleButtons(buttonSelector, contentSelector) {
        const buttons = document.querySelectorAll(buttonSelector);
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
               
                buttons.forEach(b => {
                    if (b !== button) {
                        b.classList.remove('active');
                        let content = b.querySelector(contentSelector);
                        
                        if (!content) {
                            content = b.nextElementSibling;
                        }
                        if (content && content.matches(contentSelector)) {
                            content.classList.remove('active');
                        }
                    }
                });
                
                button.classList.toggle('active');
                let content = button.querySelector(contentSelector);
                if (!content) {
                    content = button.nextElementSibling;
                }
                if (content && content.matches(contentSelector)) {
                    content.classList.toggle('active', button.classList.contains('active'));
                }
            });
        });
    }
    
    function initSelectButtonsToActivateStep(buttonSelector, targetStepIndex) {
        const buttons = document.querySelectorAll(buttonSelector);
        const steps = document.querySelectorAll('.step');
    
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                steps.forEach((step, index) => {
                    step.classList.toggle('active', index === targetStepIndex);
                });
            });
        });
    }
    
    initSelectButtonsToActivateStep('.select-race', 1);
    initSelectButtonsToActivateStep('.select-class', 2);
    initSelectButtonsToActivateStep('.select-origin', 3);
    initSelectButtonsToActivateStep('.select-arkamino', 4);
    

    function selecionarRaca(raca) {
        console.log("Raça selecionada:", raca);
        ficha.race = raca;
    }

    function selecionarClasse(classe) {
        console.log("Classe selecionada:", classe);
        ficha.class = classe;
        
    }

    function selecionarOrigem(origem) {
        console.log("Origem selecionada:", origem);
        ficha.origem = origem;
    }

    function selecionarArkamino(arkamino) {
        console.log("Arkamino selecionado:", arkamino);
        ficha.arkamino = arkamino;
    }
    const sections = [{
        name: 'race',
        className: 'race',
        dataAttr: 'data-primeira-raca',
        fichaKey: 'primeiraRaca',
        url: '/salvarRaca',
        tipo: 'raca',
        selectButtonClass: '.select-race'
    },
    {
        name: 'secondRace',
        className: 'race',
        dataAttr: 'data-segundaRaca',
        fichaKey: 'segundaRaca',
        url: '',
        tipo: '',
        selectButtonClass: '.select-second-race'
    },
    {
        name: 'classe',
        className: 'class',
        dataAttr: 'data-class',
        fichaKey: 'classe',
        url: '/salvarClasse',
        tipo: 'classe',
        selectButtonClass: '.select-class'
    },
    {
        name: 'origin',
        className: 'origin',
        dataAttr: 'data-origin',
        fichaKey: 'origem',
        url: '/salvarOrigem',
        tipo: 'origem',
        selectButtonClass: '.select-origin'
    },
    {
        name: 'arkamino',
        className: 'arkamino',
        dataAttr: 'data-arkamino',
        fichaKey: 'arkamino',
        url: '/salvarArkamino',
        tipo: 'arkamino',
        selectButtonClass: '.select-arkamino'
    }
];

showStep(currentStep);

// ----------------------------------------------------------------------------------------------------
function initSelectionFlow() {
    sections.forEach((section) => {
        const buttons = document.querySelectorAll(section.selectButtonClass);
        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const value = button.getAttribute(section.dataAttr);

                // Salva diretamente no objeto ficha:
                ficha[section.fichaKey] = value;
                console.log(`${section.fichaKey} selecionado:`, value);

                // Se for o último passo (arkamino), salva a ficha final e redireciona
                if (section.tipo === 'arkamino') {
                    try {
                        const response = await fetch('/salvarFicha', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(ficha),
                            credentials: 'include',
                        });

                        if (!response.ok) {
                            const erroMsg = await response.text();
                            throw new Error(`Erro: ${erroMsg}`);
                        }

                        const result = await response.json();
                        console.log('Ficha completa salva no servidor:', result);
                        // Redireciona para a página da ficha com o ID único
                        window.location.href = `/ficha/${result.fichaId}`;
                    } catch (error) {
                        console.error('Erro ao salvar a ficha:', error);
                        alert('Erro ao salvar a ficha. Tente novamente.');
                    }
                } else {
                    // Senão, apenas avança para o próximo passo
                    proximoPasso();
                }
            });
        });
    });
}

// 2. Inicializa o fluxo que escreve no objeto ficha assim que selecionar algo:
initSelectionFlow();
// ----------------------------------------------------------------------------------------------------
document.getElementById('identidadeForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Identidade form submitted');

    const nomePersonagem = document.getElementById('nomePersonagem').value.trim();
    const nomeJogador = document.getElementById('nomeJogador').value.trim();
    const descricao = document.getElementById('descricao').value.trim();

    if (!nomePersonagem || !nomeJogador || !descricao) {
        alert('Preencha todas as informações da identidade.');
        return;
    }

    coletarDadosPasso('identidade', {
        nomePersonagem,
        nomeJogador,
        descricao
    });
    await enviarFicha();
});


    document.getElementById('identidadeForm')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Identidade form submitted');

        const nomePersonagem = document.getElementById('nomePersonagem').value.trim();
        const nomeJogador = document.getElementById('nomeJogador').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        if(!nomePersonagem || !nomeJogador || !descricao){
            alert('Preencha todas as informações da identidade.');
            return;
        }

        coletarDadosPasso('identidade', { nomePersonagem, nomeJogador, descricao });
        await enviarFicha();
    });

    async function enviarFicha(){
        try{
            const response = await fetch('/salvarFicha', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(ficha),
                credentials: 'include',
            });

            if(!response.ok){
                const erroMsg = await response.text();
                throw new Error(`Erro: ${erroMsg}`);
            }

            const result = await response.json();
            alert('Ficha salva com sucesso!');
            console.log('Ficha completa salva no servidor:', result);
            showStep(currentStep + 1);
        } catch(error){
            console.error('Erro ao salvar a ficha:', error);
            alert('Erro ao salvar a ficha. Tente novamente.');
        }
    }

    async function carregarFotoPerfil(){
        try{
            const response = await fetch('/usuario_atual');
            const data = await response.json();

            if(data && data.fotoPerfil){
                console.log('Caminho da foto de perfil:', data.fotoPerfil);
                document.getElementById('profileButton').style.backgroundImage = `url(${data.fotoPerfil})`;
                document.getElementById('profileLink').style.backgroundImage = `url(${data.fotoPerfil})`;
                localStorage.setItem('fotoPerfil', data.fotoPerfil);
            } else{
                const defaultFoto = '/images/default-profile.png';
                document.getElementById('profileButton').style.backgroundImage = `url(${defaultFoto})`;
                document.getElementById('profileLink').style.backgroundImage = `url(${defaultFoto})`;
            }
        } catch(error){
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }

    window.addEventListener('load', () => {
        carregarFotoPerfil();
    });

    
    window.addEventListener('load', () => {
        carregarDadosUsuario();
    })

    

    document.getElementById('email')?.addEventListener('input', () => {
        document.querySelector('#updateEmailForm .btn').style.display = 'block';
    });
 
    window.addEventListener('load', async () => {
        try{
            const response = await fetch('/usuario_atual');
            const data = await response.json();
        } catch(error){
            console.error('Erro ao carregar dados do usuário:', error);
        }
    });

    deleteIcons.forEach(icon => {
        icon.addEventListener('click', function(event){
            event.stopPropagation();
            const fichaId = this.getAttribute('data-ficha-id');
            deleteForm.action = `/fichas/delete/${fichaId}`;
            modal.style.display = 'block';
        });
    });

    deleteForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const fichaId = deleteForm.action.split('/').pop();
        try {
            const response = await fetch(`/fichas/delete/${fichaId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
    
            if (!response.ok) {
                throw new Error(`Erro: ${response.status} ${response.statusText}`);
            }
    
            console.log(`Ficha ${fichaId} deletada com sucesso.`);
    
            modal.style.display = 'none';
    
            const fichaElement = document.getElementById(`ficha-${fichaId}`);
            if(fichaElement) {
                fichaElement.remove();
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('Erro ao deletar a ficha:', error);
            alert('Erro ao deletar a ficha. Tente novamente.');
        }
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    cancelButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event){
        if(event.target == modal){
            modal.style.display = 'none';
        }
    });
    

  });


console.log('script.js carregado');

function showStep(index) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, i) => {
        step.classList.toggle('active', i === index);
    });
    console.log(`Exibindo passo: ${index}`);
}

async function enviarRaca(raca) {
    try {
        const response = await fetch('/salvarRaca', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({raca}),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Raça salva no servidor', data);
        proximoPasso();
    } catch (error) {
        console.error('Erro ao enviar raça:', error);
    }
}

async function enviarClasse(classe) {
    try {
        const response = await fetch('/salvarClasse', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({classe}),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Classe salva no servidor', data);
        proximoPasso();
    } catch (error) {
        console.error('Erro ao enviar classe:', error);
    }
}

async function enviarOrigem(origem) {
    try {
        const response = await fetch('/salvarOrigem', { 
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({origem}),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Origem salva no servidor', data);
        proximoPasso();
    } catch (error) {
        console.error('Erro ao enviar origem:', error);
    }
}

async function enviarArkamino(arkamino) {
    try {
        const response = await fetch('/salvarArkamino', { 
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({arkamino}),
        });

        const result = await response.json();
        if(response.ok){
            console.log(result.mensagem);
            const fichaId = result.fichaId;
            console.log(`Ficha ID recebido: ${fichaId}`);

            window.location.href = `/ficha/${fichaId}`;
        } else{
            console.error(result.erro);
            alert(result.erro);
        }
        } catch(error){
            console.error('Erro ao enviar Arkamino:', error);
            alert('Erro ao salvar a ficha. Tente novamente.');
        }
    }

//---------------------------------------- Códigos para fichas ----------------------------------------\\




function gerarIdUnico(){
    return uuidv4();
}

