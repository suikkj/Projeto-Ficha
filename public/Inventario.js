export const inventarioData = {
    items: [
        'Espada Longa',
        'Arco Curto',

    ]
};

export function adicionarItem(item){
    const li = document.createElement('li');
    li.textContent = item;
    document.getElementById('lista-itens').appendChild(li);
}