<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$logFile = __DIR__ . '/log.txt';

if (!file_exists($logFile)) {
    echo json_encode(["status" => "error", "message" => "Archivo no encontrado."]);
    exit;
}

// Leer líneas no vacías
$lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

// Obtener solo las últimas 10
$lines = array_slice($lines, -10);

$data = [];

foreach ($lines as $line) {
    // Formato: 2025-07-12 21:07:04 | Temp: 58.60 | Hum: 40.00
    if (preg_match('/^(.*?)\s+\|\s+Temp:\s+([\d.]+)\s+\|\s+Hum:\s+([\d.]+)/', $line, $matches)) {
        $data[] = [
            "fecha" => $matches[1],
            "temp" => floatval($matches[2]),
            "hum" => floatval($matches[3])
        ];
    }
}

echo json_encode([
    "status" => "ok",
    "total" => count($data),
    "datos" => $data
], JSON_PRETTY_PRINT);
