<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$temp = $_GET['temp'] ?? null;
$hum = $_GET['hum'] ?? null;

if ($temp && $hum) {
    $log = date("Y-m-d H:i:s") . " | Temp: $temp | Hum: $hum\n";
    file_put_contents(__DIR__ ."/log.txt", $log, FILE_APPEND);

    echo json_encode(["status" => "ok", "message" => "Datos recibidos"]);
} else {
    echo json_encode(["status" => "error", "message" => "Faltan parámetros"]);
}
