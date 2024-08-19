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

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO products (shippingTime,sku, name, description, short_name, status, word_keys, price, promotional_price, cost, weight, width, height, length, brand, url_youtube, google_description, manufacturing, nbm, model, gender, volumes, warranty_time, category, subcategory, endcategory)
                           VALUES (0,:sku, :name, :description, :short_name, :status, :word_keys, :price, :promotional_price, :cost, :weight, :width, :height, :length, :brand, :url_youtube, :google_description, :manufacturing, :nbm, :model, :gender, :volumes, :warranty_time, :category, :subcategory, :endcategory)
                           RETURNING id");
    $stmt->execute([
        ':sku' => $data['product']['sku'],
        ':name' => $data['product']['name'],
        ':description' => $data['product']['description'],
        ':short_name' => $data['product']['shortName'],
        ':status' => $data['product']['status'],
        ':word_keys' => $data['product']['wordKeys'],
        ':price' => $data['product']['price'],
        ':promotional_price' => $data['product']['promotional_price'],
        ':cost' => $data['product']['cost'],
        ':weight' => $data['product']['weight'],
        ':width' => $data['product']['width'],
        ':height' => $data['product']['height'],
        ':length' => $data['product']['length'],
        ':brand' => $data['product']['brand'],
        ':url_youtube' => $data['product']['urlYoutube'],
        ':google_description' => $data['product']['googleDescription'],
        ':manufacturing' => $data['product']['manufacturing'],
        ':nbm' => $data['product']['nbm'],
        ':model' => $data['product']['model'],
        ':gender' => $data['product']['gender'],
        ':volumes' => $data['product']['volumes'],
        ':warranty_time' => $data['product']['warrantyTime'],
        ':category' => $data['product']['category'],
        ':subcategory' => $data['product']['subcategory'],
        ':endcategory' => $data['product']['endcategory']
    ]);

    $product_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO product_attributes (product_id, attribute_key, attribute_value) VALUES (:product_id, :attribute_key, :attribute_value)");
    foreach ($data['product']['attribute'] as $attr) {
        $stmt->execute([
            ':product_id' => $product_id,
            ':attribute_key' => $attr['key'],
            ':attribute_value' => $attr['value']
        ]);
    }

    $stmt = $pdo->prepare("INSERT INTO variations (product_id, ref, sku, qty, ean) VALUES (:product_id, :ref, :sku, :qty, :ean) RETURNING id");
    foreach ($data['product']['variations'] as $var) {
        $stmt->execute([
            ':product_id' => $product_id,
            ':ref' => $var['ref'],
            ':sku' => $var['sku'],
            ':qty' => $var['qty'],
            ':ean' => $var['ean']
        ]);

        $variation_id = $pdo->lastInsertId();

        $stmt_img = $pdo->prepare("INSERT INTO variation_images (variation_id, image_url) VALUES (:variation_id, :image_url)");
        foreach ($var['images'] as $img) {
            $stmt_img->execute([
                ':variation_id' => $variation_id,
                ':image_url' => $img
            ]);
        }

        $stmt_spec = $pdo->prepare("INSERT INTO specifications (variation_id, specification_key, specification_value) VALUES (:variation_id, :specification_key, :specification_value)");
        foreach ($var['specifications'] as $spec) {
            $stmt_spec->execute([
                ':variation_id' => $variation_id,
                ':specification_key' => $spec['key'],
                ':specification_value' => $spec['value']
            ]);
        }

        $stmt_stock = $pdo->prepare("INSERT INTO stock (product_id, stores, availableStock, realStock) VALUES (:product_id, 1, :availableStock, :realStock)");
        $stmt_stock->execute([
            ':product_id' => $product_id,
            ':availableStock' => $var['qty'],
            ':realStock' => $var['qty']
        ]);
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Produto registrado com sucesso']);

} catch (Exception $e) {
    if ($pdo) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>