<?php
session_start();

// Configura CORS se frontend remoto
header("Access-Control-Allow-Origin: http://localhost:8080"); // stesso dominio frontend
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "Connessione fallita: " . $mysqli->connect_error]);
    exit();
}

// Verifica sessione
if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non loggato"]);
    exit();
}

$user_id = $_SESSION['id'];

// Ricevi dati dal form
$nome       = $_POST['nome']       ?? '';
$eta        = $_POST['eta']        ?? '';
$peso       = $_POST['peso']       ?? '';
$altezza    = $_POST['altezza']    ?? '';
$sesso      = $_POST['sesso']      ?? '';
$attivita   = $_POST['attivita']   ?? '';
$obbiettivo = $_POST['obbiettivo'] ?? '';

// Validazione campi
if (!$nome || !$eta || !$peso || !$altezza || !$sesso || !$attivita || !$obbiettivo) {
    echo json_encode(["success" => false, "error" => "Campi mancanti"]);
    exit();
}

// Inserisci i dati nella tabella user_dati
$stmt = $mysqli->prepare("INSERT INTO user_dati 
    (user_id, nome, eta, peso, altezza, sesso, attivita, obbiettivo) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssssss", $user_id, $nome, $eta, $peso, $altezza, $sesso, $attivita, $obbiettivo);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
