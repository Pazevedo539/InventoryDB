document.getElementById('searchValue').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchData();
    }
});

function searchData() {
    const field = document.getElementById('searchField').value;
    const value = document.getElementById('searchValue').value;

    fetch(`http://localhost/meu_projeto/assets/PHP/searchped.php?field=${field}&value=${encodeURIComponent(value)}`)
        .then(response => response.json())
        .then(data => updateTable(data))
        .catch(error => console.error('Erro ao buscar dados:', error));
}

function updateTable(data) {
    console.log('Dados retornados da API:', data); 
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = '';

    data.forEach(item => {
        console.log('Item atual:', item); 
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-pedido" value="${item.numeropedido}" onclick="selectSingle(this)"></td>
            <td>${item.id !== undefined ? item.id : 'N/A'}</td>
            <td>${item.idpedidoparceiro !== undefined ? item.idpedidoparceiro : 'N/A'}</td>
            <td>${item.numeropedido !== undefined ? item.numeropedido : 'N/A'}</td>
            <td>${item.valorfrete !== undefined ? item.valorfrete : 'N/A'}</td>
            <td>${item.prazoentrega !== undefined ? item.prazoentrega : 'N/A'}</td>
            <td>${item.valortotalcompra !== undefined ? item.valortotalcompra : 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function selectSingle(checkbox) {
    const checkboxes = document.querySelectorAll('.select-pedido');
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });

}

function sortTable(field) {
    const order = document.getElementById('productTable').dataset.order === 'asc' ? 'desc' : 'asc';

    fetch(`http://localhost/meu_projeto/assets/PHP/shortped.php?field=${field}&order=${order}`)
        .then(response => response.json())
        .then(data => {
            updateTable(data);
            document.getElementById('productTable').dataset.order = order;
        })
        .catch(error => console.error('Erro ao ordenar dados:', error));
}

document.getElementById('viewButton').addEventListener('click', function () {
    const selectedCheckbox = document.querySelector('.select-pedido:checked');
    
    if (!selectedCheckbox) {
        alert('Por favor, selecione um pedido para aprovar.');
        return;
    }

    const selectedRow = selectedCheckbox.closest('tr');
    const numeropedido = selectedRow.querySelector('td:nth-child(4)').textContent.trim();
    const idPedidoParceiro = selectedRow.querySelector('td:nth-child(3)').textContent.trim();

    const jsonData = {
        numeropedido: numeropedido,
        idPedidoParceiro: idPedidoParceiro
    };

    console.log('JSON montado:', JSON.stringify(jsonData, null, 4));

    fetch('https://localhost/meu_projeto/assets/PHP/proxypedaprov.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pedido: jsonData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.pedido && data.pedido.mensagem === 'Pedido aprovado com Sucesso') {
        } else {
            alert(data.pedido.mensagem || 'Erro desconhecido');
        }
    })
    .catch(error => {
        console.error('Erro na requisição ao PHP:', error);
        alert('Erro ao processar a aprovação do pedido.');
    });
});

document.getElementById('ButtonDelet').addEventListener('click', function () {
    const selectedCheckbox = document.querySelector('.select-pedido:checked');
    
    if (!selectedCheckbox) {
        alert('Por favor, selecione um pedido para deletar.');
        return;
    }

    const selectedRow = selectedCheckbox.closest('tr');
    const numeropedido = selectedRow.querySelector('td:nth-child(4)').textContent.trim();
    const idPedidoParceiro = selectedRow.querySelector('td:nth-child(3)').textContent.trim();

    const jsonData = {
        numeropedido: numeropedido,
        idPedidoParceiro: idPedidoParceiro
    };

    console.log('JSON montado:', JSON.stringify(jsonData, null, 4));

    fetch('https://localhost/meu_projeto/assets/PHP/proxypeddel.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pedido: jsonData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.pedido && data.pedido.mensagem === 'Pedido deletado com Sucesso') {
        } else {
            alert(data.pedido.mensagem || 'Erro desconhecido');
        }
    })
    .catch(error => {
        console.error('Erro na requisição ao PHP:', error);
        alert('Erro ao deletar o pedido.');
    });
});

window.onload = function() {
    fetch('http://localhost/meu_projeto/assets/PHP/buscaped.php')
        .then(response => response.json())
        .then(data => updateTable(data))
        .catch(error => console.error('Erro ao carregar dados:', error));
};

window.onload = function() {
    fetch('http://localhost/meu_projeto/assets/PHP/buscaped.php')
        .then(response => response.json())
        .then(data => updateTable(data))
        .catch(error => console.error('Erro ao carregar dados:', error));
};
