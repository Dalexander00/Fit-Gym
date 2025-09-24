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

$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");

if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "Connessione DB fallita"]);
    exit;
}

$ptId = $_SESSION['id'];

// ✅ Query con JOIN per prendere dati PT + users + immagini
$query = "
    SELECT 
        p.pt_id,
        p.Nome,
        p.AnniDiEsperienza,
        p.TitoloDiStudio,
        p.Tariffa,
        p.Recapito,
        u.Email,
        i.file AS immagine
    FROM pt_dati p
    JOIN users u ON p.pt_id = u.id
    LEFT JOIN immagini i ON p.pt_id = i.idUtente
    WHERE p.pt_id = ?
";

$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $ptId);
$stmt->execute();
$result = $stmt->get_result();

$ptData = $result->fetch_assoc();

if ($ptData) {
    echo json_encode(["success" => true, "data" => $ptData]);
} else {
    echo json_encode(["success" => false, "error" => "Profilo non trovato"]);
}

$stmt->close();
$mysqli->close();
?>
