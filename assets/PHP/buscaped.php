<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require __DIR__ . '/db_connection.php';

try {
    $stmt = $pdo->query('SELECT * FROM pedidos');
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao buscar pedidos: ' . $e->getMessage()]);
}
?>