<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/db_connection.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

file_put_contents('debug.log', print_r($data, true), FILE_APPEND);

if (!isset($data['productId']) || empty($data['productId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID do produto não fornecido.']);
    exit;
}

$productId = intval($data['productId']);
$productData = $data;
unset($productData['productId']);

function sanitizeValue($value) {
    return $value === '' ? null : $value;
}

file_put_contents('debug.log', print_r($productData, true), FILE_APPEND);

try {
    $stmt = $pdo->prepare("
        UPDATE products
        SET 
            promotional_price = :promotional_price,
            price = :price,
            pricesite = :pricesite,
            cost = :cost,
            shippingtime = :shippingtime,
            status = :status
        WHERE id = :product_id
    ");
    $stmt->execute([
        ':promotional_price' => sanitizeValue($productData['promotional_price']),
        ':price' => sanitizeValue($productData['price']),
        ':pricesite' => sanitizeValue($productData['pricesite']),
        ':cost' => sanitizeValue($productData['cost']),
        ':shippingtime' => sanitizeValue($productData['shippingtime']),
        ':status' => sanitizeValue($productData['status']),
        ':product_id' => $productId,
    ]);

    $stmt = $pdo->prepare("
        UPDATE variations
        SET 
            ref = :ref,
            sku = :sku
        WHERE product_id = :product_id
    ");
    $stmt->execute([
        ':ref' => sanitizeValue($productData['ref']),
        ':sku' => sanitizeValue($productData['sku_variation']),
        ':product_id' => $productId,
    ]);

    $stmt = $pdo->prepare("
        UPDATE stock
        SET 
            stores = :stores,
            availablestock = :availablestock,
            realstock = :realstock
        WHERE product_id = :product_id
    ");
    $stmt->execute([
        ':stores' => sanitizeValue($productData['stores']),
        ':availablestock' => sanitizeValue($productData['availablestock']),
        ':realstock' => sanitizeValue($productData['realstock']),
        ':product_id' => $productId,
    ]);

    echo json_encode(['success' => true, 'message' => 'Produto atualizado com sucesso.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar produto: ' . $e->getMessage()]);
}
?>