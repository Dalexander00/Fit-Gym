<?php
session_start();

// CORS
$frontend_origin = "http://localhost:8080";
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Controllo sessione
if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non loggato"]);
    exit;
}

$userId = intval($_SESSION['id']);
$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "Errore DB"]);
    exit;
}

// Preleva scheda senza parsare
$stmt = $mysqli->prepare("
    SELECT Giorno1, Giorno2, Giorno3, Giorno4, Giorno5, Giorno6, Giorno7, idPT
    FROM schede
    WHERE user_id = ?
    LIMIT 1
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

if (!$data) {
    echo json_encode(["success" => false, "error" => "Nessuna scheda trovata"]);
    exit;
}

// Manda i giorni così come sono salvati nel DB
$days = [
    ["day" => "GIORNO 1", "dayName" => "Lunedì", "focus" => "Allenamento", "exercises" => $data["Giorno1"]],
    ["day" => "GIORNO 2", "dayName" => "Martedì", "focus" => "Allenamento", "exercises" => $data["Giorno2"]],
    ["day" => "GIORNO 3", "dayName" => "Mercoledì", "focus" => "Allenamento", "exercises" => $data["Giorno3"]],
    ["day" => "GIORNO 4", "dayName" => "Giovedì", "focus" => "Allenamento", "exercises" => $data["Giorno4"]],
    ["day" => "GIORNO 5", "dayName" => "Venerdì", "focus" => "Allenamento", "exercises" => $data["Giorno5"]],
    ["day" => "GIORNO 6", "dayName" => "Sabato", "focus" => "Allenamento", "exercises" => $data["Giorno6"]],
    ["day" => "GIORNO 7", "dayName" => "Domenica", "focus" => "Allenamento", "exercises" => $data["Giorno7"]],
];

echo json_encode([
    "success" => true,
    "scheda" => $days,
    "idPT" => $data["idPT"]
]);

$mysqli->close();
?>