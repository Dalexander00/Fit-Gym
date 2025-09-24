<?php 
session_start();

// Configura CORS se frontend remoto
header("Access-Control-Allow-Origin: http://localhost:8080"); 
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
$nome            = $_POST['nome']            ?? '';
$anniEsperienza  = $_POST['anniEsperienza']  ?? '';
$tariffa         = $_POST['tariffa']         ?? '';
$recapito        = $_POST['recapito']        ?? '';
$titoloStudio    = $_POST['titoloStudio']    ?? '';

// Validazione campi
if (!$nome || !$anniEsperienza || !$tariffa || !$recapito || !$titoloStudio) {
    echo json_encode(["success" => false, "error" => "Campi mancanti"]);
    exit();
}

// Converte la tariffa in stringa "$x/mese"
$tariffaString = "$" . $tariffa . "/mese";

// Inserisci i dati nella tabella pt_dati
$stmt = $mysqli->prepare("INSERT INTO pt_dati 
    (pt_id, Nome, AnniDiEsperienza, Tariffa, Recapito, TitoloDiStudio) 
    VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isisss", $user_id, $nome, $anniEsperienza, $tariffaString, $recapito, $titoloStudio);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
