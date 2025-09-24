<?php
session_start();

// Headers CORS
header("Access-Control-Allow-Origin: http://localhost:8080"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Controllo sessione
if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$idPT = intval($_SESSION['id']);

try {
    // Connessione PDO
    $con = new PDO("mysql:host=localhost;dbname=findmypt_db;charset=utf8", "root", "mattia12345");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query per prendere i clienti di questo PT
    $sql = "
        SELECT 
            u.user_id AS idCliente,
            u.Nome AS Nome,
            u.Eta AS Eta,
            u.Altezza AS Altezza,
            u.Peso AS Peso,
            u.Sesso AS Sesso,
            u.Attivita AS Attivita,
            u.Obbiettivo AS Obbiettivo
        FROM abbonamenti a
        INNER JOIN user_dati u ON a.idCliente = u.user_id
        WHERE a.idPT = :idPT
    ";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':idPT', $idPT, PDO::PARAM_INT);
    $stmt->execute();

    $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($clients);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
