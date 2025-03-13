export const arkanimoData = {
    // Seus dados de Arkamino aqui
    poderes: [
        'Poder 1',
        'Poder 2',
        'Poder 3',
        // ... outros poderes
    ]
};

export function adicionarPoder(poder) {
    const li = document.createElement('li');
    li.textContent = poder;
    const listaPoderes = document.getElementById('lista-arkamino-poderes');
    if (listaPoderes) {
        listaPoderes.appendChild(li);
    } else {
        console.error('Elemento "lista-arkamino-poderes" não encontrado.');
    }
}