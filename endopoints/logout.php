<?php
// Imposta header per CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:8080"); // 🔹 cambia con la porta del tuo frontend (es. 3000/5173)
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Se la richiesta è OPTIONS (preflight), termina qui
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

// Distruggi la sessione
session_unset();
session_destroy();

// Risposta JSON
echo json_encode(["success" => true]);
