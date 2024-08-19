function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadProductDetails(productId) {
    fetch(`https://localhost/meu_projeto/assets/PHP/carregproductsedit.php?id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const product = data.product;
                document.getElementById('productDetails').innerHTML = `
                    <label for="sku">SKU Pai:</label>
                    <input type="text" id="sku" name="sku" value="${product.sku}" readonly class="readonly">

                    <label for="name">Nome do Produto:</label>
                    <p class="readonly-text">${product.short_name}</p>
                    <p class="readonly-text">${product.name}</p>

                    <label for="short_name">Nome Curto:</label>
                    <p class="readonly-text">${product.short_name}</p>

                    <label for="description">Descrição:</label>
                    <textarea id="description" name="description" readonly class="readonly">${product.description}</textarea>

                    <label>Status:</label>
                    <div class="status-checkboxes">
                        <input type="checkbox" id="status-enabled" name="status" value="enabled" ${product.status === 'enabled' ? 'checked' : ''} onclick="toggleStatus(this)">
                        <label for="status-enabled" class="enabled">Ativo</label>

                        <input type="checkbox" id="status-disabled" name="status" value="disabled" ${product.status === 'disabled' ? 'checked' : ''} onclick="toggleStatus(this)">
                        <label for="status-disabled" class="disabled">Inativo</label>
                    </div>

                    <label for="word_keys">Palavras-chave:</label>
                    <p class="readonly-text">${product.word_keys}</p>

                    <label for="price">Preço:</label>
                    <input type="text" id="price" name="price" value="${parseFloat(product.price).toFixed(2)}">

                    <label for="promotional_price">Preço Promocional:</label>
                    <input type="text" id="promotional_price" name="promotional_price" value="${product.promotional_price ? parseFloat(product.promotional_price).toFixed(2) : ''}">

                    <label for="pricesite">Preço no Site:</label>
                    <input type="text" id="pricesite" name="pricesite" value="${product.pricesite ? parseFloat(product.pricesite).toFixed(2) : ''}">

                    <label for="cost">Custo:</label>
                    <input type="text" id="cost" name="cost" value="${product.cost ? parseFloat(product.cost).toFixed(2) : ''}">
                    
                    <label for="shippingtime">Prazo de Entrega (dias):</label>
                    <input type="text" id="shippingtime" name="shippingtime" value="${product.shippingtime}">

                    <label for="weight">Peso:</label>
                    <p class="readonly-text">${product.weight ? parseFloat(product.weight).toFixed(2) : ''}</p>

                    <label for="width">Largura:</label>
                    <p class="readonly-text">${product.width ? parseFloat(product.width).toFixed(2) : ''}</p>

                    <label for="height">Altura:</label>
                    <p class="readonly-text">${product.height ? parseFloat(product.height).toFixed(2) : ''}</p>

                    <label for="length">Comprimento:</label>
                    <p class="readonly-text">${product.length ? parseFloat(product.length).toFixed(2) : ''}</p>

                    <label for="brand">Marca:</label>
                    <p class="readonly-text">${product.brand}</p>

                    <label for="url_youtube">URL do YouTube:</label>
                    <p class="readonly-text">${product.url_youtube}</p>

                    <label for="google_description">Descrição no Google:</label>
                    <p class="readonly-text">${product.google_description}</p>

                    <label for="manufacturing">Fabricante:</label>
                    <p class="readonly-text">${product.manufacturing}</p>

                    <label for="nbm">NBM:</label>
                    <p class="readonly-text">${product.nbm}</p>

                    <label for="model">Modelo:</label>
                    <p class="readonly-text">${product.model}</p>

                    <label for="gender">Gênero:</label>
                    <p class="readonly-text">${product.gender}</p>

                    <label for="volumes">Volumes:</label>
                    <p class="readonly-text">${product.volumes}</p>

                    <label for="warranty_time">Tempo de Garantia:</label>
                    <p class="readonly-text">${product.warranty_time}</p>

                    <label for="category">Categoria:</label>
                    <p class="readonly-text">${product.category}</p>

                    <label for="subcategory">Subcategoria:</label>
                    <p class="readonly-text">${product.subcategory}</p>

                    <label for="endcategory">Categoria Final:</label>
                    <p class="readonly-text">${product.endcategory}</p>

                    <label for="stores">Lojas:</label>
                    <input type="text" id="stores" name="stores" value="${product.stores}">

                    <label for="availablestock">Estoque Disponível:</label>
                    <input type="text" id="availablestock" name="availablestock" value="${product.availablestock}">

                    <label for="realstock">Estoque Real:</label>
                    <input type="text" id="realstock" name="realstock" value="${product.realstock}">

                    <h2>Atributos</h2>

                    <label for="attributes">Descrição dos Atributos:</label>
                    <textarea id="attributes" name="attributes" readonly class="readonly">${product.attributes ? product.attributes.map(attr => `${attr.attribute_key}:${attr.attribute_value}`).join('\n') : ''}</textarea>
                    
                    <h2>Variações</h2>

                    <label for="ref">Referência:</label>
                    <input type="text" id="ref" name="ref" value="${product.variations.ref || ''}">

                    <label for="sku_variation">SKU Variação:</label>
                    <input type="text" id="sku_variation" name="sku_variation" value="${product.variations.sku || ''}">

                    <label for="ean">EAN:</label>
                    <input type="text" id="ean" name="ean" value="${product.variations.ean || ''}" readonly class="readonly">
                    
                    <h2>Especificação</h2>

                    <label for="specifications">Descrição das Especificações:</label>
                    <textarea id="specifications" name="specifications" readonly class="readonly">${product.specifications ? product.specifications.map(spec => `${spec.specification_key}:${spec.specification_value}`).join('\n') : ''}</textarea>
                `;
            } else {
                document.getElementById('productDetails').innerHTML = '<p>Produto não encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes do produto:', error);
            document.getElementById('productDetails').innerHTML = '<p>Erro ao carregar detalhes do produto.</p>';
        });
}

function toggleStatus(checkbox) {
    const statusEnabled = document.getElementById('status-enabled');
    const statusDisabled = document.getElementById('status-disabled');

    if (checkbox === statusEnabled) {
        statusDisabled.checked = false;
    } else if (checkbox === statusDisabled) {
        statusEnabled.checked = false;
    }
}

function updateProduct() {
    const formData = new FormData(document.getElementById('productForm'));
    const data = {};

    formData.forEach((value, key) => {
        if (key === 'attributes' || key === 'specifications') {
            const items = value.split('\n').map(item => {
                const [k, v] = item.split(':').map(str => str.trim());
                return { [key === 'attributes' ? 'attribute_key' : 'specification_key']: k, [key === 'attributes' ? 'attribute_value' : 'specification_value']: v };
            });
            data[key] = items;
        } else {
            data[key] = value;
        }
    });

    const statusEnabled = document.getElementById('status-enabled').checked;
    const statusDisabled = document.getElementById('status-disabled').checked;

    if (statusEnabled) {
        data.status = 'enabled';
    } else if (statusDisabled) {
        data.status = 'disabled';
    }

    const productId = getParameterByName('id');

    const externalData = {
        products: [{
            ref: data.ref || "",
            sku: parseInt(data.sku_variation, 10) || null,  
            promotional_price: parseFloat(data.promotional_price) || 0,
            price: parseFloat(data.price) || 0,
            priceSite: parseFloat(data.pricesite) || 0,
            cost: parseFloat(data.cost) || 0,
            shippingTime: parseInt(data.shippingtime, 10) || 0,
            status: data.status || "",
            stock: [{
                stores: parseInt(data.stores, 10) || 0,
                availableStock: parseInt(data.availablestock, 10) || 0,
                realStock: parseInt(data.realstock, 10) || 0
            }]
        }]
    };

    const jsonString = JSON.stringify(externalData, null, 2);
    document.getElementById('jsonOutput').textContent = jsonString;

    fetch('https://localhost/meu_projeto/assets/PHP/proxyedit.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonString
    })
    .then(response => response.json())
    .then(result => {
        if (result.products && result.products[0] && result.products[0].return && result.products[0].return[0].code === 0) {
            fetch('https://localhost/meu_projeto/assets/PHP/updateproductsbd.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, ...data })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Produto atualizado com sucesso!');
                    window.location.href = 'https://localhost/meu_projeto/assets/PainelCadProd.html';
                } else {
                    alert('Erro ao atualizar produto: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Erro ao atualizar produto:', error);
                alert('Erro ao atualizar produto.');
            });
        } else {
            alert('Erro ao atualizar na API externa: ' + (result.products && result.products[0] && result.products[0].return && result.products[0].return[0].message || 'Mensagem não disponível'));
        }
    })
    .catch(error => {
        console.error('Erro ao enviar dados para a API externa:', error);
        alert('Erro ao enviar dados para a API externa.');
    });
}

const productId = getParameterByName('id');
if (productId) {
    loadProductDetails(productId);
}
