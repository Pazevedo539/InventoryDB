<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!isset($data) || empty($data)) {
    http_response_code(400);
    echo "Erro: dados inválidos";
    exit;
}

$url = 'https://www.replicade.com.br/api/v3/products/inventory';

$options = array(
    'http' => array(
        'method' => 'PUT',  
        'header' => array(
            'Content-Type: application/json',
            'Authorization: Basic aXdPMzVLZ09EZnRvOHY3M1I6'  
        ),
        'content' => json_encode($data)
    )
);

$context = stream_context_create($options);

$result = file_get_contents($url, false, $context);

if ($result === false) {
    http_response_code(500);
    echo "Erro: não foi possível fazer a requisição para a API externa";
    exit;
}

echo $result;
?>