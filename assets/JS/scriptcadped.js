document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const addItemsBtn = document.getElementById('addItemsBtn');
    const clearItemsBtn = document.getElementById('clearItemsBtn');
    const itemsSummary = document.getElementById('itemsSummary');
    const skuInput = document.getElementById('sku');
    const valorUnitarioInput = document.getElementById('valorUnitario');
    const quantidadeInput = document.getElementById('quantidade');
    const jsonOutput = document.getElementById('jsonOutput');
    const urlParams = new URLSearchParams(window.location.search);
    const selectedSku = urlParams.get('sku');
    if (selectedSku) {
        skuInput.value = selectedSku;
    }

    let jsonData = {
        pedido: {
            idPedidoParceiro: "",
            valorFrete: 0,
            prazoEntrega: 0,
            valorTotalCompra: 0,
            formaPagamento: "",
            dadosCliente: {
                cpfCnpj: "",
                nomeRazao: "",
                fantasia: "",
                sexo: "",
                dataNascimento: "",
                email: "",
                dadosEntrega: {
                    cep: "",
                    endereco: "",
                    numero: "",
                    bairro: "",
                    complemento: "",
                    cidade: "",
                    uf: "",
                    responsavelRecebimento: ""
                },
                telefones: {
                    residencial: "",
                    comercial: "",
                    celular: ""
                }
            },
            pagamento: [{
                valor: 0,
                quantidadeParcelas: 0,
                meioPagamento: "",
                autorizacao: "",
                nsu: "",
                sefaz: {
                    idOperacao: "",
                    idFormaPagamento: "",
                    idMeioPagamento: "",
                    cnpjInstituicaoPagamento: "",
                    idBandeira: "",
                    autorizacao: "",
                    cnpjIntermediadorTransacao: "",
                    intermediadorIdentificador: ""
                }
            }],
            itens: []
        }
    };

    function atualizarValorTotalCompra() {
        const valorTotalItens = jsonData.pedido.itens.reduce((acc, item) => {
            return acc + (item.valorUnitario * item.quantidade);
        }, 0);

        const valorFrete = parseFloat(document.getElementById('valorFrete').value) || 0;
        const valorTotalCompra = valorTotalItens + valorFrete;

        document.getElementById('valorTotalCompra').value = valorTotalCompra;

        jsonData.pedido.valorTotalCompra = valorTotalCompra;
    }

    addItemsBtn.addEventListener('click', () => {
        const item = {
            sku: parseInt(skuInput.value) || 0,
            valorUnitario: parseFloat(valorUnitarioInput.value) || 0,
            quantidade: parseInt(quantidadeInput.value) || 0
        };

        jsonData.pedido.itens.push(item);
        atualizarResumoItens();
        atualizarValorTotalCompra(); 
        limparCampos(); 
    });

    clearItemsBtn.addEventListener('click', () => {
        if (jsonData.pedido.itens.length > 0) {
            jsonData.pedido.itens.pop(); 
            atualizarResumoItens();
            atualizarValorTotalCompra(); 
        } else {
            alert('Nenhum item para remover.');
        }
    });

    productForm.addEventListener('submit', function (e) {
        e.preventDefault();
        atualizarValorTotalCompra();

        jsonData.pedido.idPedidoParceiro = document.getElementById('idPedidoParceiro').value || "";
        jsonData.pedido.valorFrete = parseFloat(document.getElementById('valorFrete').value) || 0;
        jsonData.pedido.prazoEntrega = parseInt(document.getElementById('prazoEntrega').value) || 0;
        jsonData.pedido.valorTotalCompra = parseFloat(document.getElementById('valorTotalCompra').value) || 0;
        jsonData.pedido.formaPagamento = document.getElementById('formaPagamento').value || "";
        jsonData.pedido.dadosCliente.cpfCnpj = document.getElementById('cpfCnpj').value || "";
        jsonData.pedido.dadosCliente.nomeRazao = document.getElementById('nomeRazao').value || "";
        jsonData.pedido.dadosCliente.fantasia = document.getElementById('fantasia').value || "";
        jsonData.pedido.dadosCliente.sexo = document.getElementById('sexo').value || "";
        jsonData.pedido.dadosCliente.dataNascimento = document.getElementById('dataNascimento').value || "";
        jsonData.pedido.dadosCliente.email = document.getElementById('email').value || "";
        jsonData.pedido.dadosCliente.dadosEntrega.cep = document.getElementById('cep').value || "";
        jsonData.pedido.dadosCliente.dadosEntrega.endereco = document.getElementById('endereco').value || "";
        jsonData.pedido.dadosCliente.dadosEntrega.numero = document.getElementById('numero').value || "";
        jsonData.pedido.dadosCliente.dadosEntrega.bairro = document.getElementById('bairro').value || "";
        jsonData.pedido.dadosCliente.dadosEntrega.complemento = document.getElementById('complemento').value || "";
        jsonData.pedido.dadosCliente.dadosEntrega.cidade = document.getElementById('cidade').value || "";
        jsonData.pedido.dadosCliente.dadosEntrega.uf = document.getElementById('uf').value || "";
        jsonData.pedido.dadosCliente.dadosEntrega.responsavelRecebimento = document.getElementById('responsavelRecebimento').value || "";
        jsonData.pedido.dadosCliente.telefones.residencial = document.getElementById('residencial').value || "";
        jsonData.pedido.dadosCliente.telefones.comercial = document.getElementById('comercial').value || "";
        jsonData.pedido.dadosCliente.telefones.celular = document.getElementById('celular').value || "";
        jsonData.pedido.pagamento[0].valor = parseFloat(document.getElementById('valor').value) || 0;
        jsonData.pedido.pagamento[0].quantidadeParcelas = parseInt(document.getElementById('quantidadeParcelas').value) || 0;
        jsonData.pedido.pagamento[0].meioPagamento = document.getElementById('tipopagamento').value || "";
        jsonData.pedido.pagamento[0].autorizacao = document.getElementById('idautorizacao').value || "";
        jsonData.pedido.pagamento[0].nsu = document.getElementById('nsu').value || "";
        jsonData.pedido.pagamento[0].sefaz.idOperacao = document.getElementById('idOperacao').value || "";
        jsonData.pedido.pagamento[0].sefaz.idFormaPagamento = document.getElementById('idFormaPagamento').value || "";
        jsonData.pedido.pagamento[0].sefaz.idMeioPagamento = document.getElementById('idMeioPagamento').value || "";
        jsonData.pedido.pagamento[0].sefaz.cnpjInstituicaoPagamento = document.getElementById('cnpjInstituicaoPagamento').value || "";
        jsonData.pedido.pagamento[0].sefaz.idBandeira = document.getElementById('idBandeira').value || "";
        jsonData.pedido.pagamento[0].sefaz.autorizacao = document.getElementById('idautorizacao').value || "";
        jsonData.pedido.pagamento[0].sefaz.cnpjIntermediadorTransacao = document.getElementById('cnpjIntermediadorTransacao').value || "";
        jsonData.pedido.pagamento[0].sefaz.intermediadorIdentificador = document.getElementById('intermediadorIdentificador').value || "";

        console.log('JSON enviado:', JSON.stringify(jsonData, null, 4));
        
        if (jsonOutput) {
            jsonOutput.textContent = JSON.stringify(jsonData, null, 4);
        } else {
            console.error('Elemento jsonOutput não encontrado.');
        }

        enviarDadosParaAPI(jsonData);
    });

    function atualizarResumoItens() {
        itemsSummary.textContent = jsonData.pedido.itens.map(item => 
            `SKU: ${item.sku}, Valor Unitário: ${item.valorUnitario}, Quantidade: ${item.quantidade}`
        ).join('\n');
    }

    function limparCampos() {
        skuInput.value = '';
        valorUnitarioInput.value = '';
        quantidadeInput.value = '';
    }

    function atualizarValorTotalCompra() {
        const valorTotalItens = jsonData.pedido.itens.reduce((acc, item) => {
            return acc + (item.valorUnitario * item.quantidade);
        }, 0);

        const valorFrete = parseFloat(document.getElementById('valorFrete').value) || 0;
        const valorTotalCompra = valorTotalItens + valorFrete;

        document.getElementById('valorTotalCompra').value = valorTotalCompra;

        jsonData.pedido.valorTotalCompra = valorTotalCompra;
    }
});

async function enviarDadosParaAPI(jsonData) {
    try {
        const response = await fetch('https://localhost/meu_projeto/assets/PHP/proxyped.php', {
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
                jsonData.pedido.numeroPedido = resultadoAPI.data.numeroPedido;
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

async function inserirDadosNoBanco(jsonData) {
    try {
        const response = await fetch('https://localhost/meu_projeto/assets/PHP/gravapeddb.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            const resultadoBanco = await response.json();
            console.log('Dados inseridos no banco com sucesso:', resultadoBanco);
            alert('Dados inseridos no banco com sucesso!');
            window.location.href = 'https://localhost/meu_projeto/assets/PainelCadPed.html';
        } else {
            console.error('Erro ao inserir dados no banco:', response.statusText);
            alert('Erro ao inserir dados no banco: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro de conexão ou outro erro:', error);
        alert('Erro ao inserir dados no banco: ' + error.message);
    }
}
