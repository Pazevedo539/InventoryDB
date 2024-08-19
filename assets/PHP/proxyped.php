<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!isset($data) || empty($data)) {
    http_response_code(400);
    echo json_encode(["code" => 1, "message" => "Dados inválidos"]);
    exit;
}

$url = 'https://www.replicade.com.br/api/v1/pedido/pedido';

$options = array(
    'http' => array(
        'method' => 'POST',
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
    echo json_encode(["code" => 1, "message" => "Não foi possível fazer a requisição para a API externa"]);
    exit;
}

$result_data = json_decode($result, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(["code" => 1, "message" => "Resposta da API externa inválida"]);
    exit;
}

if (isset($result_data['pedido']['mensagem']) && $result_data['pedido']['mensagem'] === "Sucesso") {
    echo json_encode(["code" => 0, "message" => "Dados enviados com sucesso", "data" => $result_data['pedido']]);
} else {
    http_response_code(400);
    echo json_encode(["code" => 1, "message" => $result_data['pedido']['mensagem'] ?? "Erro desconhecido"]);
}
?>