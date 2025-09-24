<?php
session_start();

// ✅ Configura CORS per React (http://localhost:8080)
$frontend_origin = "http://localhost:8080";
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// ✅ Gestione richiesta OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ✅ Controllo sessione
if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non loggato"]);
    exit;
}

// ✅ Controllo idCliente cliente passato via GET
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["success" => false, "error" => "Nessun idCliente cliente fornito"]);
    exit;
}

$idCliente = intval($_GET['id']);

try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=findmypt_db;charset=utf8mb4",
        "root",
        "mattia12345",
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // ✅ Query per prendere i dati del cliente
    $stmt = $pdo->prepare("
        SELECT *
        FROM user_dati
        WHERE user_id = :idCliente
    ");
    $stmt->bindValue(":idCliente", $idCliente, PDO::PARAM_INT);
    $stmt->execute();

    $client = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($client) {
        echo json_encode(["success" => true, "data" => $client]);
    } else {
        echo json_encode(["success" => false, "error" => "Cliente non trovato"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "DB error: " . $e->getMessage()]);
}
