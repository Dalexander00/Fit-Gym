<?php
session_start();

$frontend_origin = "http://localhost:8080"; // Cambia se il frontend gira su un'altra porta
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (!isset($_SESSION['user_type'])) {
    echo json_encode([
        "success" => false,
        "error" => "Utente non autenticato",
        "user_type" => null
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "user_type" => $_SESSION['user_type']
]);
