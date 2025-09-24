<?php
session_start();

// CORS per React
$frontend_origin = "http://localhost:8080";
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Controllo sessione PT
if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "PT non loggato"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['user_id'])) {
    echo json_encode(["success" => false, "error" => "Dati mancanti"]);
    exit;
}

$ptId = $_SESSION['id'];
$userId = intval($input['user_id']);

//Connessione DB
$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");
if ($mysqli->connect_error) {
    echo json_encode(["success" => false, "error" => "Errore DB: " . $mysqli->connect_error]);
    exit;
}

$giorni = [];
for ($i = 1; $i <= 7; $i++) {
    $giorni[] = isset($input["Giorno$i"]) ? $input["Giorno$i"] : '';
}

try {
    $checkStmt = $mysqli->prepare("SELECT idScheda FROM schede WHERE user_id = ? AND idPt = ?");
    $checkStmt->bind_param("ii", $userId, $ptId);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        $checkStmt->bind_result($existingId);
        $checkStmt->fetch();
        $updateStmt = $mysqli->prepare(
            "UPDATE schede SET Giorno1=?, Giorno2=?, Giorno3=?, Giorno4=?, Giorno5=?, Giorno6=?, Giorno7=? 
             WHERE idScheda=?"
        );
        $updateStmt->bind_param(
            "ssssssss",
            $giorni[0], $giorni[1], $giorni[2], $giorni[3], $giorni[4], $giorni[5], $giorni[6], $existingId
        );

        if ($updateStmt->execute()) {
            echo json_encode(["success" => true, "message" => "Scheda aggiornata con successo"]);
        } else {
            echo json_encode(["success" => false, "error" => "Errore aggiornamento: " . $updateStmt->error]);
        }

        $updateStmt->close();
    } else {
        $idScheda = $mysqli->insert_id;
        $insertStmt = $mysqli->prepare(
            "INSERT INTO schede 
             (idScheda, Giorno1, Giorno2, Giorno3, Giorno4, Giorno5, Giorno6, Giorno7, idPt, user_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $insertStmt->bind_param(
            "isssssssii",
            $idScheda,
            $giorni[0], $giorni[1], $giorni[2], $giorni[3], $giorni[4], $giorni[5], $giorni[6],
            $ptId,
            $userId
        );

        if ($insertStmt->execute()) {
            echo json_encode(["success" => true, "message" => "Scheda creata con successo"]);
        } else {
            echo json_encode(["success" => false, "error" => "Errore inserimento: " . $insertStmt->error]);
        }

        $insertStmt->close();
    }

    $checkStmt->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Errore generico: " . $e->getMessage()]);
}

$mysqli->close();
?>