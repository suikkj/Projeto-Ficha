export const habilidadesData = {
    habilidadeRaca: {
        'Clássico': [
            {
                nome: 'Versátil',
                descricao: 'Você se torna treinado em duas perícias a sua escolha (não precisam ser da sua classe) Você pode trocar uma dessas perícias por um poder geral a sua escolha.'
            },
            {
                nome: 'Versátil',
                descricao: 'Você se torna treinado em duas perícias a sua escolha (não precisam ser da sua classe) Você pode trocar uma dessas perícias por um poder geral a sua escolha.'
            },
            {
                nome: 'Versátil',
                descricao: 'Você se torna treinado em duas perícias a sua escolha (não precisam ser da sua classe) Você pode trocar uma dessas perícias por um poder geral a sua escolha.'
            },
            {
                nome: 'Versátil',
                descricao: 'Você se torna treinado em duas perícias a sua escolha (não precisam ser da sua classe) Você pode trocar uma dessas perícias por um poder geral a sua escolha.'
            },
        ],

        'Ameaças de Arton':[
            {
                nome: 'Mimimimi',
                descricao: 'ronk shoo ronk shoo'
            }
        ],
        'Deuses e Heróis': [
            {
                nome: 'Se formar é bom. E estudar também',
                descricao: 'piranha inteligente não quer guerra com ninguém'
            }
        ],

        'História dos Selos': [
            {
                nome: 'Ydra',
                descricao: 'Ydra'
            }
        ],
    },

    habilidadeClasse: {
        'Habilidades': [
            {
                nome: 'Habilidade de Classe',
                descricao: 'Descrição da habilidade de classe'
            },
            {
                nome: 'Habilidade de Classe',
                descricao: 'Descrição da habilidade de classe'
            },
            {
                nome: 'Habilidade de Classe',
                descricao: 'Descrição da habilidade de classe'
            },
            {
                nome: 'Habilidade de Classe',
                descricao: 'Descrição da habilidade de classe'
            },
        ],

        'Poderes': [
            {
                nome: 'Poder de Classe',
                descricao: 'Descrição do poder de classe'
            }
        ]
    },

    poderesConcedidos: {
        'Poderes': [
            {
                nome: 'Poder Concedido',
                descricao: 'Descrição do poder concedido'
            },
            {
                nome: 'Poder Concedido',
                descricao: 'Descrição do poder concedido'
            },
            {
                nome: 'Poder Concedido',
                descricao: 'Descrição do poder concedido'
            },
            {
                nome: 'Poder Concedido',
                descricao: 'Descrição do poder concedido'
            },
        ]
    },
    poderesSelos: {
        'Poderes Gerais':[
            {
                nome: 'Dendaterra',
                descricao: 'Descrição do poder do selo'
            }
        ],
        'Poderes Rúnicos': [
            {
                nome: 'Visão Rùnica',
                descricao: 'Descrição do poder do selo'
            }
        ]

    }

};


export function addHabilidade(habilidade){
    const li = document.createElement('li');
    li.textContent = habilidade;
    document.getElementById('lista-habilidades').appendChild(li);
}
