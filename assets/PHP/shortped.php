<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require __DIR__ . '/db_connection.php';

$field = $_GET['field'] ?? '';
$order = $_GET['order'] ?? 'asc';

$validFields = ['id', 'numeroPedido', 'idPedidoParceiro', 'valorFrete', 'prazoEntrega', 'valorTotalCompra', 'status'];
if (in_array($field, $validFields) && in_array($order, ['asc', 'desc'])) {
    try {
        $field = htmlspecialchars($field); // Segurança: Evita SQL Injection
        $stmt = $pdo->query("SELECT * FROM pedidos ORDER BY $field $order");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro na ordenação: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Campo ou ordem de ordenação inválida.']);
}
?>