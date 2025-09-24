<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080"); 
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non autenticato"]);
    exit;
}

$idCliente = intval($_SESSION['id']);

try {
    $pdo = new PDO("mysql:host=localhost;dbname=findmypt_db;charset=utf8mb4", "root", "mattia12345", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $sql = "SELECT t.* 
            FROM abbonamenti a
            JOIN pt_dati t ON a.idPT = t.pt_id
            WHERE a.idCliente = :idCliente
            LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(":idCliente", $idCliente, PDO::PARAM_INT);
    $stmt->execute();
    $trainer = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "trainer" => $trainer ?: null]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "DB error: " . $e->getMessage()]);
}
?>