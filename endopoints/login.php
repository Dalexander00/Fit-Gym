<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$query = "SELECT * FROM users WHERE Email = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $hash = $row['Password'];
    $tipo = $row['user_type']; // 👈 deve esistere un campo tipo nella tabella users

    if (password_verify($password, $hash)) {
        $_SESSION['id'] = $id;
        $_SESSION['user_type'] = $tipo; // salvo in sessione

        echo json_encode([
            "success" => true,
            "id" => $id,
            "user_type" => $tipo, // 👈 lo restituiamo al frontend
            "session_id" => session_id()
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Password errata"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "error" => "Utente non trovato"
    ]);
}

$stmt->close();
$mysqli->close();
?>
