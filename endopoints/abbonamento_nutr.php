<?php
session_start();

$frontend_origin = "http://localhost:8080"; // Cambia con il dominio del frontend
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// controllo sessione
if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non autenticato"]);
    exit;
}

$idCliente = intval($_SESSION['id']);

// leggo JSON
$input = json_decode(file_get_contents('php://input'), true);
$idNutr = isset($input['idNutrizionista']) ? intval($input['idNutrizionista']) : null;

if ($idNutr === null || $idNutr === 0) {
    echo json_encode(["success" => false, "error" => "Nessun idNutrizionista fornito"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=findmypt_db;charset=utf8mb4", "root", "mattia12345", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // controlla se l'utente ha già un abbonamento
    $check = $pdo->prepare("SELECT COUNT(*) FROM abbonamenti WHERE idCliente = :idCliente");
    $check->bindValue(":idCliente", $idCliente, PDO::PARAM_INT);
    $check->execute();
    $exists = $check->fetchColumn();

    if ($exists > 0) {
        // aggiorna solo il nutrizionista
        $sql = "UPDATE abbonamenti 
                   SET idNutrizionista = :idNutr 
                 WHERE idCliente = :idCliente";
    } else {
        // inserisce nuovo record
        $sql = "INSERT INTO abbonamenti (idCliente, idPT, idNutrizionista) 
                VALUES (:idCliente, NULL, :idNutr)";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(":idCliente", $idCliente, PDO::PARAM_INT);
    $stmt->bindValue(":idNutr", $idNutr, PDO::PARAM_INT);

    $ok = $stmt->execute();

    if ($ok) {
        echo json_encode(["success" => true, "message" => $exists > 0 ? "Nutrizionista aggiornato" : "Nutrizionista scelto"]);
    } else {
        echo json_encode(["success" => false, "error" => "Errore nel salvataggio"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "DB error: " . $e->getMessage()]);
}
