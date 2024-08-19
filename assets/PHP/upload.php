<?php
$targetDir = __DIR__ . "/upload/";
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
$logFile = __DIR__ . '/upload_errors.log'; 

function logError($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0755, true)) {
        $error = 'Falha ao criar o diretório de upload.';
        http_response_code(500);
        echo json_encode(['error' => $error]);
        logError($error);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    file_put_contents($logFile, print_r($_FILES, true), FILE_APPEND);
    
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['file'];
        $fileName = basename($file['name']);
        $uploadFile = $targetDir . $fileName;

        $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (in_array($fileType, $allowedTypes)) {
            if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
                $imageUrl = 'https:/localhost/meu_projeto/upload/' . $fileName;
                $imageUrl = str_replace('\\', '/', $imageUrl);
                echo json_encode(['url' => $imageUrl]);
            } else {
                $error = 'Falha ao mover o arquivo. Verifique as permissões do diretório e o caminho do arquivo.';
                http_response_code(500);
                echo json_encode(['error' => $error]);
                logError($error . ' - Caminho Temporário: ' . $file['tmp_name'] . ' - Caminho de Upload: ' . $uploadFile . ' - ' . print_r(error_get_last(), true));
            }
        } else {
            $error = 'Tipo de arquivo não permitido.';
            http_response_code(400);
            echo json_encode(['error' => $error]);
            logError($error);
        }
    } else {
        $error = 'Nenhum arquivo enviado ou erro no upload.';
        http_response_code(400);
        echo json_encode(['error' => $error]);
        logError($error);
    }
} else {
    $error = 'Método de solicitação inválido.';
    http_response_code(405);
    echo json_encode(['error' => $error]);
    logError($error);
}
?>