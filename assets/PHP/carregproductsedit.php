<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require __DIR__ . '/db_connection.php'; 

try {
    $productId = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($productId <= 0) {
        echo json_encode(['success' => false, 'message' => 'ID do produto inválido.']);
        exit();
    }

    $stmt = $pdo->prepare('
        SELECT p.*, 
               pa.attribute_key, pa.attribute_value, 
               v.ref, v.sku as variation_sku, v.ean, 
               vi.image_url, 
               s.specification_key, s.specification_value,
               st.stores, st.availablestock, st.realstock
        FROM products p
        LEFT JOIN product_attributes pa ON p.id = pa.product_id
        LEFT JOIN variations v ON p.id = v.product_id
        LEFT JOIN variation_images vi ON v.id = vi.variation_id
        LEFT JOIN specifications s ON v.id = s.variation_id
        LEFT JOIN stock st ON p.id = st.product_id
        WHERE p.id = :productId
    ');
    $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($result) {
        $product = [
            'id' => $result[0]['id'],
            'sku' => $result[0]['sku'],
            'name' => $result[0]['name'],
            'description' => $result[0]['description'],
            'short_name' => $result[0]['short_name'],
            'status' => $result[0]['status'],
            'word_keys' => $result[0]['word_keys'],
            'price' => $result[0]['price'],
            'promotional_price' => $result[0]['promotional_price'],
            'pricesite' => $result[0]['pricesite'],
            'cost' => $result[0]['cost'],
            'shippingtime' => $result[0]['shippingtime'],
            'weight' => $result[0]['weight'],
            'width' => $result[0]['width'],
            'height' => $result[0]['height'],
            'length' => $result[0]['length'],
            'brand' => $result[0]['brand'],
            'url_youtube' => $result[0]['url_youtube'],
            'google_description' => $result[0]['google_description'],
            'manufacturing' => $result[0]['manufacturing'],
            'nbm' => $result[0]['nbm'],
            'model' => $result[0]['model'],
            'gender' => $result[0]['gender'],
            'volumes' => $result[0]['volumes'],
            'warranty_time' => $result[0]['warranty_time'],
            'category' => $result[0]['category'],
            'subcategory' => $result[0]['subcategory'],
            'endcategory' => $result[0]['endcategory'],
            'attributes' => [],
            'variations' => [],
            'variation_images' => [],
            'specifications' => [],
            'stores' => $result[0]['stores'],
            'availablestock' => $result[0]['availablestock'],
            'realstock' => $result[0]['realstock'],
        ];

        foreach ($result as $row) {
            if (!empty($row['attribute_key'])) {
                $product['attributes'][] = [
                    'attribute_key' => $row['attribute_key'],
                    'attribute_value' => $row['attribute_value']
                ];
            }
            if (!empty($row['ref'])) {
                $product['variations'] = [
                    'ref' => !empty($result[0]['ref']) ? $result[0]['ref'] : '',
                    'sku' => !empty($result[0]['variation_sku']) ? $result[0]['variation_sku'] : '',
                    'ean' => !empty($result[0]['ean']) ? $result[0]['ean'] : ''
                ];
            }
            if (!empty($row['image_url'])) {
                $product['variation_images'][] = [
                    'image_url' => $row['image_url']
                ];
            }
            if (!empty($row['specification_key'])) {
                $product['specifications'][] = [
                    'specification_key' => $row['specification_key'],
                    'specification_value' => $row['specification_value']
                ];
            }
        }

        echo json_encode(['success' => true, 'product' => $product]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Produto não encontrado.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao buscar produto: ' . $e->getMessage()]);
}
?>