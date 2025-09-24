<?php
session_start();

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

$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");

$userId = $_SESSION['id'];

// ✅ Query con JOIN per prendere dati utente + user_dati + immagini
$query = "
    SELECT *
    FROM users u
    JOIN user_dati ud ON u.id = ud.user_id
    LEFT JOIN immagini i ON u.id = i.idUtente
    WHERE u.id = ?
";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$userData = $result->fetch_assoc();
echo json_encode($userData);
$stmt->close();
$mysqli->close();
?>
