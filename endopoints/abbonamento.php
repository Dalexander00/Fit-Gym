<?php
session_start();

$frontend_origin = "http://localhost:8080"; 
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non autenticato"]);
    exit;
}

$idCliente = intval($_SESSION['id']);
$input = json_decode(file_get_contents('php://input'), true);
$idPT = isset($input['idPT']) ? intval($input['idPT']) : null;

if (!$idPT || $idPT <= 0) {
    echo json_encode(["success" => false, "error" => "Nessun idPT fornito"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=findmypt_db;charset=utf8mb4", "root", "mattia12345", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Controlla se esiste giÃ  un abbonamento per il cliente
    $check = $pdo->prepare("SELECT idCliente FROM abbonamenti WHERE idCliente = :idCliente");
    $check->bindValue(":idCliente", $idCliente, PDO::PARAM_INT);
    $check->execute();
    $exists = $check->fetch(PDO::FETCH_ASSOC);

    if ($exists) {
        // Aggiorna solo idPT
        $sql = "UPDATE abbonamenti SET idPT = :idPT WHERE idCliente = :idCliente";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":idCliente", $idCliente, PDO::PARAM_INT);
        $stmt->bindValue(":idPT", $idPT, PDO::PARAM_INT);
    } else {
        // Inserisci nuovo record, idNutrizionista = null
        $sql = "INSERT INTO abbonamenti (idCliente, idPT, idNutrizionista) VALUES (:idCliente, :idPT, NULL)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":idCliente", $idCliente, PDO::PARAM_INT);
        $stmt->bindValue(":idPT", $idPT, PDO::PARAM_INT);
    }

    $stmt->execute();
    echo json_encode(["success" => true, "message" => $exists ? "Abbonamento aggiornato" : "Abbonamento creato"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "DB error: " . $e->getMessage()]);
}
?>