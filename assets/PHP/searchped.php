<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require __DIR__ . '/db_connection.php';

$field = $_GET['field'] ?? '';
$value = $_GET['value'] ?? '';

if ($field && $value) {
    try {
        $field = htmlspecialchars($field); // Segurança: Evita SQL Injection
        if ($field === 'numeroPedido') {
            $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE $field = :value");
            $stmt->execute(['value' => (int)$value]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE $field ILIKE :value");
            $stmt->execute(['value' => "%$value%"]);
        }
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro na pesquisa: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Campo ou valor de pesquisa ausente.']);
}
?>