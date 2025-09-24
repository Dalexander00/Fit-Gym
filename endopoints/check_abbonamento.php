<?php
session_start();

// Permetti solo richieste dal frontend
$frontend_origin = "http://localhost:8080";
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Controlla login
if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non loggato"]);
    exit;
}

$userId = intval($_SESSION['id']);

// Connessione DB
$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "Errore DB"]);
    exit;
}

// ✅ Controlla se esiste un abbonamento attivo (idPT non nullo)
$stmt = $mysqli->prepare("SELECT idPT FROM abbonamenti WHERE idCliente = ? AND idPT IS NOT NULL");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->store_result();

$hasSubscription = $stmt->num_rows > 0;


$stmt->close();
$mysqli->close();

echo json_encode([
    "success" => true,
    "hasSubscription" => $hasSubscription
]);
?>