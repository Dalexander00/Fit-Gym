<?php
session_start();

// Configura CORS se frontend remoto
header("Access-Control-Allow-Origin: http://localhost:8080"); // metti il tuo dominio frontend
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "Connessione fallita: " . $mysqli->connect_error]);
    exit();
}

// Ricevi dati dal form
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$user_type = $_POST['user_type'] ?? '';

if (!$email || !$password || !$user_type) {
    echo json_encode(["success" => false, "error" => "Campi mancanti"]);
    exit();
}

// Cripta la password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Inserisci utente (ID generato automaticamente)
$stmt = $mysqli->prepare("INSERT INTO users (Email, Password, user_type) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $password_hash, $user_type);

if ($stmt->execute()) {
    // Prendi l'ID generato dal DB
    $_SESSION['id'] = $mysqli->insert_id;

    echo json_encode([
        "success" => true,
        "id" => $_SESSION['id']
    ]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>