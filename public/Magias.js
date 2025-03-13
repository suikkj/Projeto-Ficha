// Magias.js

// Dados das magias
export const magiasData = {
    arcanas: {
        todas: [
            'Bola de Fogo',
            'Teletransporte',
            'Invisibilidade',
            // ... outras magias arcanas
        ],
        abjuracao: [
            'Escudo Arcano',
            'Proteção contra Energia',
            // ... outras magias de abjuração
        ],
        adivinhacao: [
            'Detecção de Magia',
            'Visão Verdadeira',
            // ... outras magias de adivinhação
        ],
        // ... outras escolas de magia arcanas
    },
    divinas: {
        todas: [
            'Cura',
            'Bênção',
            'Purificação',
            // ... outras magias divinas
        ],
        // ... outras categorias se necessário
    },
    // ... outras categorias se necessário
};

// Função para listar magias
export function listarMagias(tipo, categoria, circulo) {
    // Implementação da função conforme sua lógica
    const magias = getMagias(tipo, categoria, circulo);
    const listaMagiasElement = document.getElementById('lista-magias');

    if (!listaMagiasElement) {
        console.error('Elemento "lista-magias" não encontrado.');
        return;
    }

    listaMagiasElement.innerHTML = ''; // Limpa a lista antes de adicionar

    magias.forEach(magia => {
        const li = document.createElement('li');
        li.textContent = magia;
        listaMagiasElement.appendChild(li);
    });
}

// Função auxiliar para obter magias com base nos parâmetros
function getMagias(tipo, categoria, circulo) {
    if (tipo && categoria && circulo) {
        // Lógica para filtrar magias com base nos parâmetros
        return magiasData[tipo][categoria] || [];
    }
    return [];
}