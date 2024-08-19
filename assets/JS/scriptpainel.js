document.getElementById('searchValue').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchData();
    }
});

document.getElementById('viewButton').addEventListener('click', function() {
    const selectedCheckbox = document.querySelector('.select-product:checked');
    if (selectedCheckbox) {
        const productId = selectedCheckbox.value;
        window.location.href = `https://localhost/meu_projeto/assets/EditCadProd.html?id=${productId}`;
    } else {
        alert('Por favor, selecione um produto para editar.');
    }
});

function searchData() {
    const field = document.getElementById('searchField').value;
    const value = document.getElementById('searchValue').value;

    fetch(`http://localhost/meu_projeto/assets/PHP/search.php?field=${field}&value=${encodeURIComponent(value)}`)
        .then(response => response.json())
        .then(data => updateTable(data))
        .catch(error => console.error('Erro ao buscar dados:', error));
}

function updateTable(data) {
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-product" value="${item.id}" onclick="selectSingle(this)"></td>
            <td>${item.id}</td>
            <td>${item.sku}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.status}</td>
            <td>${item.price}</td>
        `;
        tableBody.appendChild(row);
    });
}

function selectSingle(checkbox) {
    const checkboxes = document.querySelectorAll('.select-product');
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
}

function sortTable(field) {
    const order = document.getElementById('productTable').dataset.order === 'asc' ? 'desc' : 'asc';

    fetch(`http://localhost/meu_projeto/assets/PHP/sortped.php?field=${field}&order=${order}`)
        .then(response => response.json())
        .then(data => {
            updateTable(data);
            document.getElementById('pedidoTable').dataset.order = order;
        })
        .catch(error => console.error('Erro ao ordenar dados:', error));
}

window.onload = function() {
    fetch('http://localhost/meu_projeto/assets/PHP/buscaproducts.php')
        .then(response => response.json())
        .then(data => updateTable(data))
        .catch(error => console.error('Erro ao carregar dados:', error));
};
