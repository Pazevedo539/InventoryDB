<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

file_put_contents('debug.log', print_r($data, true), FILE_APPEND);

if (empty($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

$url = 'https://www.replicade.com.br/api/v1/pedido/pedido';

$options = array(
    'http' => array(
        'method' => 'DELETE',
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
    echo json_encode(['success' => false, 'message' => 'Erro ao enviar dados para a API externa']);
    exit;
}

$response = json_decode($result, true);
file_put_contents('debug.log', print_r($response, true), FILE_APPEND);

echo json_encode($response);
?>