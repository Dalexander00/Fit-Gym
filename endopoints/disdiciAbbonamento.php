<?php
session_start();

// ✅ CORS
$frontend_origin = "http://localhost:8080";
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// ✅ Controllo sessione
if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non autenticato"]);
    exit;
}

$clienteId = intval($_SESSION['id']);

try {
    $mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");
    if ($mysqli->connect_error) throw new Exception($mysqli->connect_error);

    // ✅ Cancella abbonamento
    $stmt = $mysqli->prepare("UPDATE abbonamenti SET idPT = NULL WHERE idCliente = ?");
    $stmt->bind_param("i", $clienteId);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Abbonamento cancellato"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }
    $stmt->close();
    $mysqli->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Errore: " . $e->getMessage()]);
}
?>