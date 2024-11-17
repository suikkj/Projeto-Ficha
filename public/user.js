console.log('Script carregado com sucesso!');

async function carregarDadosUsuario(){
    try{
        const response = await fetch('/usuario_atual');
        const data = await response.json();
        console.log('Dados do usuário:', data);

        if(data){
            const currentUsernameElement = document.getElementById('currentUsername');
            const currentEmailElement = document.getElementById('currentEmail');

            if(currentUsernameElement){
                currentUsernameElement.textContent = data.username;
            }

            if(currentEmailElement){
                currentEmailElement.textContent = data.email;
            }

            if(data.fotoPerfil){
                document.getElementById('profileButton').style.backgroundImage = `url(${data.fotoPerfil})`;
                document.getElementById('profileLink').style.backgroundImage = `url(${data.fotoPerfil})`;
                localStorage.setItem('fotoPerfil', data.fotoPerfil);
            } else{
                const defaultFoto = '/images/default_profile.png';
                document.getElementById('profileButton').style.backgroundImage = `url(${defaultFoto})`;
                document.getElementById('profileLink').style.backgroundImage = `url(${defaultFoto})`;
            }
        }
    } catch(error){
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

window.addEventListener('load', carregarDadosUsuario);