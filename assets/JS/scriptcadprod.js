document.addEventListener('DOMContentLoaded', function () {
    const productForm = document.getElementById('productForm');
    const addAttributeButton = document.getElementById('add-attribute');
    const attributeKeyInput = document.getElementById('attributeKey');
    const attributeValueInput = document.getElementById('attributeValue');
    const attributeDescription = document.getElementById('attributeDescription');
    const addSpecificationButton = document.getElementById('add-specification');
    const specificationKeyInput = document.getElementById('specificationKey');
    const specificationValueInput = document.getElementById('specificationValue');
    const specificationDescription = document.getElementById('specificationDescription');
    const clearAttributeDescriptionButton = document.getElementById('clear-attribute-description');
    const clearSpecificationDescriptionButton = document.getElementById('clear-specification-description');

    const enabledCheckbox = document.getElementById('enabled');
    const disabledCheckbox = document.getElementById('disabled');


    let jsonData = {
        product: {
            sku: null,
            name: "",
            description: "",
            shortName: "",
            status: "",
            wordKeys: "",
            price: 0,
            promotional_price: 0,
            cost: 0,
            weight: 0,
            width: 0,
            height: 0,
            length: 0,
            brand: "",
            urlYoutube: "",
            googleDescription: "",
            manufacturing: "",
            nbm: "",
            model: "",
            gender: "",
            volumes: 0,
            warrantyTime: 0,
            category: "",
            subcategory: "",
            endcategory: "",
            attribute: [],
            variations: [{
                ref: "",
                sku: null,
                qty: "0",
                ean: "",
                images: [],
                specifications: [{}] 
            }]
        }
    };

    enabledCheckbox.addEventListener('change', function () {
        if (enabledCheckbox.checked) {
            disabledCheckbox.checked = false;
        }
    });

    disabledCheckbox.addEventListener('change', function () {
        if (disabledCheckbox.checked) {
            enabledCheckbox.checked = false;
        }
    });

    addAttributeButton.addEventListener('click', function () {
        const attributeKey = attributeKeyInput.value.trim();
        const attributeValue = attributeValueInput.value.trim();

        if (attributeKey && attributeValue) {
            jsonData.product.attribute.push({
                key: attributeKey,
                value: attributeValue
            });

            attributeDescription.value = attributeDescription.value ? 
                `${attributeDescription.value}, ${attributeKey}: ${attributeValue}` : 
                `${attributeKey}: ${attributeValue}`;

            attributeKeyInput.value = '';
            attributeValueInput.value = '';
        }
    });

    addSpecificationButton.addEventListener('click', function () {
        const specificationKey = specificationKeyInput.value.trim();
        const specificationValue = specificationValueInput.value.trim();

        if (specificationKey && specificationValue) {
            jsonData.product.variations[0].specifications.push({
                key: specificationKey,
                value: specificationValue
            });

            specificationDescription.value = specificationDescription.value ? 
                `${specificationDescription.value}, ${specificationKey}: ${specificationValue}` : 
                `${specificationKey}: ${specificationValue}`;

            specificationKeyInput.value = '';
            specificationValueInput.value = '';
        }
    });

    clearAttributeDescriptionButton.addEventListener('click', function () {
        if (jsonData.product.attribute.length > 0) {
            const removedAttribute = jsonData.product.attribute.pop();
            const currentDescription = attributeDescription.value.split(', ');
            currentDescription.pop();
            attributeDescription.value = currentDescription.join(', ');

            console.log(`Atributo removido: ${removedAttribute.key}: ${removedAttribute.value}`);
        } else {
            attributeDescription.value = '';
        }
    });

    clearSpecificationDescriptionButton.addEventListener('click', function () {
        if (jsonData.product.variations[0].specifications.length > 0) {
            const removedSpecification = jsonData.product.variations[0].specifications.pop();
            const currentDescription = specificationDescription.value.split(', ');
            currentDescription.pop();
            specificationDescription.value = currentDescription.join(', ');

            console.log(`Especificação removida: ${removedSpecification.key}: ${removedSpecification.value}`);
        } else {
            specificationDescription.value = '';
        }
    });

    productForm.addEventListener('submit', function (e) {
        e.preventDefault();

        jsonData.product.sku = parseInt(document.getElementById('sku').value) || null;
        jsonData.product.name = document.getElementById('name').value || "";
        jsonData.product.description = document.getElementById('description').value || "";
        jsonData.product.shortName = document.getElementById('shortName').value || "";
        jsonData.product.status = document.querySelector('input[name="status"]:checked')?.value || '';
        jsonData.product.wordKeys = document.getElementById('wordKeys').value || "";
        jsonData.product.price = parseFloat(document.getElementById('price').value) || 0;
        jsonData.product.promotional_price = parseFloat(document.getElementById('promotional_price').value) || 0;
        jsonData.product.cost = parseFloat(document.getElementById('cost').value) || 0;
        jsonData.product.weight = parseFloat(document.getElementById('weight').value) || 0;
        jsonData.product.width = parseFloat(document.getElementById('width').value) || 0;
        jsonData.product.height = parseFloat(document.getElementById('height').value) || 0;
        jsonData.product.length = parseFloat(document.getElementById('length').value) || 0;
        jsonData.product.brand = document.getElementById('brand').value || "";
        jsonData.product.urlYoutube = document.getElementById('urlYoutube').value || "";
        jsonData.product.googleDescription = document.getElementById('googleDescription').value || "";
        jsonData.product.manufacturing = document.getElementById('manufacturing').value || "";
        jsonData.product.nbm = document.getElementById('nbm').value || "";
        jsonData.product.model = document.getElementById('model').value || "";
        jsonData.product.gender = document.getElementById('gender').value || "";
        jsonData.product.volumes = parseInt(document.getElementById('volumes').value) || 0;
        jsonData.product.warrantyTime = parseInt(document.getElementById('warrantyTime').value) || 0;
        jsonData.product.category = document.getElementById('category').value || "";
        jsonData.product.subcategory = document.getElementById('subcategory').value || "";
        jsonData.product.endcategory = document.getElementById('endcategory').value || "";

        jsonData.product.variations[0].ref = document.getElementById('ref').value || "";
        jsonData.product.variations[0].sku = parseInt(document.getElementById('variation_sku').value) || null;
        jsonData.product.variations[0].qty = document.getElementById('qty').value || "0";
        jsonData.product.variations[0].ean = document.getElementById('ean').value || "";

        const imagesInput = document.getElementById('images');
        jsonData.product.variations[0].images = Array.from(imagesInput.files).map(file => file.name);

        enviarDadosParaAPI(jsonData);
    });
});

async function enviarDadosParaAPI(jsonData) {
    try {
        const response = await fetch('https://localhost/meu_projeto/assets/PHP/proxy.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            const resultadoAPI = await response.json();
            if (resultadoAPI.code === 0) {
                console.log('Dados enviados para a API com sucesso:', resultadoAPI);
                inserirDadosNoBanco(jsonData);
            } else {
                console.error('Erro na resposta da API:', resultadoAPI.message);
                alert('Erro ao enviar dados para a API: ' + resultadoAPI.message);
            }
        } else {
            console.error('Erro ao enviar dados para a API:', response.statusText);
            alert('Erro ao enviar dados para a API: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão ou outro erro:', error);
        alert('Erro ao enviar dados para a API: ' + error.message);
    }
}

function inserirDadosNoBanco(jsonData) {
    fetch('https://localhost/meu_projeto/assets/PHP/GravaDB.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro de rede: ' + response.statusText);
        }
        return response.text();
    })
    .then(text => {
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
            const jsonResponse = JSON.parse(jsonMatch[0]);
            if (jsonResponse.success) {
                alert('Produto cadastrado com sucesso!');
                window.location.href = 'https://localhost/meu_projeto/assets/PainelCadProd.html';
            } else {
                alert('Erro ao salvar os dados no banco de dados: ' + jsonResponse.message);
            }
        } else {
            console.error('JSON válido não encontrado na resposta:', text);
            alert('Erro ao processar a resposta do servidor. Veja o console para mais detalhes.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição ao backend PHP:', error);
        alert('Ocorreu um erro ao tentar salvar os dados no banco de dados. Veja o console para mais detalhes.');
    });
}
