<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$pdo = null;

function convertDate($date) {
    if (preg_match('/^(\d{2})(\d{2})(\d{4})$/', $date, $matches)) {
        return $matches[3] . '-' . $matches[2] . '-' . $matches[1];
    }
    return $date;
}

try {
    $host = '127.0.0.1';
    $dbname = 'inventorydb';
    $user = 'postgres';
    $pass = 'teste';

    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Erro ao decodificar JSON: ' . json_last_error_msg());
    }

    $data['pedido']['dadosCliente']['dataNascimento'] = convertDate($data['pedido']['dadosCliente']['dataNascimento']);

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO pedidos (numeroPedido, idPedidoParceiro, valorFrete, prazoEntrega, valorTotalCompra, formaPagamento, status)
                        VALUES (:numeroPedido, :idPedidoParceiro, :valorFrete, :prazoEntrega, :valorTotalCompra, :formaPagamento, :status) RETURNING id");
    $stmt->execute([
        ':numeroPedido' => $data['pedido']['numeroPedido'],
        ':idPedidoParceiro' => $data['pedido']['idPedidoParceiro'],
        ':valorFrete' => $data['pedido']['valorFrete'],
        ':prazoEntrega' => $data['pedido']['prazoEntrega'],
        ':valorTotalCompra' => $data['pedido']['valorTotalCompra'],
        ':formaPagamento' => $data['pedido']['formaPagamento'],
        ':status' => 'NOVO'
    ]);

    $pedido_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO clientes (pedidos_id, cpfCnpj, nomeRazao, fantasia, sexo, dataNascimento, email)
                           VALUES (:pedidos_id, :cpfCnpj, :nomeRazao, :fantasia, :sexo, :dataNascimento, :email) RETURNING id");
    $stmt->execute([
        ':pedidos_id' => $pedido_id,
        ':cpfCnpj' => $data['pedido']['dadosCliente']['cpfCnpj'],
        ':nomeRazao' => $data['pedido']['dadosCliente']['nomeRazao'],
        ':fantasia' => $data['pedido']['dadosCliente']['fantasia'],
        ':sexo' => $data['pedido']['dadosCliente']['sexo'],
        ':dataNascimento' => $data['pedido']['dadosCliente']['dataNascimento'],
        ':email' => $data['pedido']['dadosCliente']['email']
    ]);

    $cliente_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO dados_entrega (clientes_id, cep, endereco, numero, bairro, complemento, cidade, uf, responsavelRecebimento)
                           VALUES (:clientes_id, :cep, :endereco, :numero, :bairro, :complemento, :cidade, :uf, :responsavelRecebimento)");
    $stmt->execute([
        ':clientes_id' => $cliente_id,
        ':cep' => $data['pedido']['dadosCliente']['dadosEntrega']['cep'],
        ':endereco' => $data['pedido']['dadosCliente']['dadosEntrega']['endereco'],
        ':numero' => $data['pedido']['dadosCliente']['dadosEntrega']['numero'],
        ':bairro' => $data['pedido']['dadosCliente']['dadosEntrega']['bairro'],
        ':complemento' => $data['pedido']['dadosCliente']['dadosEntrega']['complemento'],
        ':cidade' => $data['pedido']['dadosCliente']['dadosEntrega']['cidade'],
        ':uf' => $data['pedido']['dadosCliente']['dadosEntrega']['uf'],
        ':responsavelRecebimento' => $data['pedido']['dadosCliente']['dadosEntrega']['responsavelRecebimento']
    ]);

    $stmt = $pdo->prepare("INSERT INTO telefones_cliente (clientes_id, residencial, comercial, celular)
                           VALUES (:clientes_id, :residencial, :comercial, :celular)");
    $stmt->execute([
        ':clientes_id' => $cliente_id,
        ':residencial' => $data['pedido']['dadosCliente']['telefones']['residencial'],
        ':comercial' => $data['pedido']['dadosCliente']['telefones']['comercial'],
        ':celular' => $data['pedido']['dadosCliente']['telefones']['celular']
    ]);

    $stmt = $pdo->prepare("INSERT INTO pagamentos (pedidos_id, valor, quantidadeParcelas, meioPagamento, autorizacao, nsu)
                           VALUES (:pedidos_id, :valor, :quantidadeParcelas, :meioPagamento, :autorizacao, :nsu) RETURNING id");
    $stmt->execute([
        ':pedidos_id' => $pedido_id,
        ':valor' => $data['pedido']['pagamento'][0]['valor'],
        ':quantidadeParcelas' => $data['pedido']['pagamento'][0]['quantidadeParcelas'],
        ':meioPagamento' => $data['pedido']['pagamento'][0]['meioPagamento'],
        ':autorizacao' => $data['pedido']['pagamento'][0]['autorizacao'],
        ':nsu' => $data['pedido']['pagamento'][0]['nsu']
    ]);

    $pagamento_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO sefaz_info (pagamentos_id, idOperacao, idFormaPagamento, idMeioPagamento, cnpjInstituicaoPagamento, idBandeira, autorizacao, cnpjIntermediadorTransacao, intermediadorIdentificador, idPedidoParceiro)
                           VALUES (:pagamentos_id, :idOperacao, :idFormaPagamento, :idMeioPagamento, :cnpjInstituicaoPagamento, :idBandeira, :autorizacao, :cnpjIntermediadorTransacao, :intermediadorIdentificador, :idPedidoParceiro)");
    $stmt->execute([
        ':pagamentos_id' => $pagamento_id,
        ':idOperacao' => $data['pedido']['pagamento'][0]['sefaz']['idOperacao'],
        ':idFormaPagamento' => $data['pedido']['pagamento'][0]['sefaz']['idFormaPagamento'],
        ':idMeioPagamento' => $data['pedido']['pagamento'][0]['sefaz']['idMeioPagamento'],
        ':cnpjInstituicaoPagamento' => $data['pedido']['pagamento'][0]['sefaz']['cnpjInstituicaoPagamento'],
        ':idBandeira' => $data['pedido']['pagamento'][0]['sefaz']['idBandeira'],
        ':autorizacao' => $data['pedido']['pagamento'][0]['sefaz']['autorizacao'],
        ':cnpjIntermediadorTransacao' => $data['pedido']['pagamento'][0]['sefaz']['cnpjIntermediadorTransacao'],
        ':intermediadorIdentificador' => $data['pedido']['pagamento'][0]['sefaz']['intermediadorIdentificador'],
        ':idPedidoParceiro' => $data['pedido']['idPedidoParceiro']
    ]);

    $stmt = $pdo->prepare("INSERT INTO itens_pedido (pedidos_id, sku, valorUnitario, quantidade)
                           VALUES (:pedidos_id, :sku, :valorUnitario, :quantidade)");
    foreach ($data['pedido']['itens'] as $item) {
        $stmt->execute([
            ':pedidos_id' => $pedido_id,
            ':sku' => $item['sku'],
            ':valorUnitario' => $item['valorUnitario'],
            ':quantidade' => $item['quantidade']
        ]);
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Dados inseridos com sucesso']);
} catch (Exception $e) {
    if ($pdo) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
