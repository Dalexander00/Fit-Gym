<?php
session_start();

$frontend_origin = "http://localhost:8080";
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

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

// Aggiorna dati PT
if (isset($_POST['Email'], $_POST['Nome'], $_POST['AnniDiEsperienza'], $_POST['Tariffa'], $_POST['Recapito'], $_POST['TitoloDiStudio'])) {
    $stmt1 = $mysqli->prepare("UPDATE users SET Email = ? WHERE id = ?");
    $stmt1->bind_param("si", $_POST['Email'], $userId);
    $stmt1->execute();
    $stmt2 = $mysqli->prepare("UPDATE pt_dati 
        SET Nome = ?, AnniDiEsperienza = ?, Tariffa = ?, Recapito = ?, TitoloDiStudio = ? 
        WHERE pt_id = ?");
    $stmt2->bind_param(
        "sssssi",
        $_POST['Nome'],
        $_POST['AnniDiEsperienza'],
        $_POST['Tariffa'],
        $_POST['Recapito'],
        $_POST['TitoloDiStudio'],
        $userId
    );
    $stmt2->execute();

    $stmt1->close();
    $stmt2->close();
}

$response = ["success" => true, "message" => "Profilo PT aggiornato"];

// Upload immagine SOLO se presente
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = "C:/xampp/htdocs/findMyPT/Images/";
    $fileName = "pt_" . $userId . "_" . time() . ".jpg";
    $filePath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
        $check = $mysqli->prepare("SELECT idUtente FROM immagini WHERE idUtente = ?");
        $check->bind_param("i", $userId);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            $stmtImg = $mysqli->prepare("UPDATE immagini SET file = ? WHERE idUtente = ?");
            $stmtImg->bind_param("si", $fileName, $userId);
            $stmtImg->execute();
            $stmtImg->close();
        } else {
            $stmtImg = $mysqli->prepare("INSERT INTO immagini (idUtente, file) VALUES (?, ?)");
            $stmtImg->bind_param("is", $userId, $fileName);
            $stmtImg->execute();
            $stmtImg->close();
        }

        $response["file"] = $fileName;
    } else {
        $response = ["success" => false, "error" => "Errore upload immagine"];
    }
}

$mysqli->close();
echo json_encode($response);
?>
