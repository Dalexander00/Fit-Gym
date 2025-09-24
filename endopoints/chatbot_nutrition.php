<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "error" => "Utente non loggato"]);
    exit;
}

$userId = intval($_SESSION['id']);

// Connessione DB
$mysqli = new mysqli("localhost", "root", "mattia12345", "findmypt_db");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "Errore DB"]);
    exit;
}

// Recupero peso e altezza
$stmt = $mysqli->prepare("SELECT Peso, Altezza FROM user_dati WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$userData = $result->fetch_assoc();
$stmt->close();
$mysqli->close();

if (!$userData) {
    echo json_encode(["success" => false, "error" => "Utente non trovato"]);
    exit;
}

$weight = floatval($userData['Peso']);   // kg
$height = floatval($userData['Altezza']) / 100; // cm → metri

require 'vendor/autoload.php';

try {
    $client = new \GuzzleHttp\Client();

    // 1) Calcolo BMI
    $responseBmi = $client->request('GET', "https://body-mass-index-bmi-calculator.p.rapidapi.com/metric?weight={$weight}&height={$height}", [
        'headers' => [
            'x-rapidapi-host' => 'body-mass-index-bmi-calculator.p.rapidapi.com',
            'x-rapidapi-key' => '003847d5d8msh5fd3b45f3d5add5p1141c9jsne0419edc86f9',
        ],
    ]);

    $bmiData = json_decode($responseBmi->getBody(), true);

    if (!isset($bmiData['bmi'])) {
        echo json_encode(["success" => false, "error" => "Risposta API non valida (BMI)"]);
        exit;
    }

    $bmi = $bmiData['bmi'];

    // 2) Recupero categoria peso usando il BMI calcolato
    $responseCategory = $client->request('GET', "https://body-mass-index-bmi-calculator.p.rapidapi.com/weight-category?bmi={$bmi}", [
        'headers' => [
            'x-rapidapi-host' => 'body-mass-index-bmi-calculator.p.rapidapi.com',
            'x-rapidapi-key' => '003847d5d8msh5fd3b45f3d5add5p1141c9jsne0419edc86f9',
        ],
    ]);

    $categoryData = json_decode($responseCategory->getBody(), true);

    if (!isset($categoryData['weightCategory'])) {
        echo json_encode(["success" => false, "error" => "Risposta API non valida (Categoria)"]);
        exit;
    }

    $response = [
        "success" => true,
        "bmi" => round($bmi, 2),
        "weightCategory" => $categoryData['weightCategory']
    ];

    // Aggiungo ObeseClass se esiste
    if (isset($categoryData['ObeseClass'])) {
        $response["obeseClass"] = $categoryData['ObeseClass'];
    }

    echo json_encode($response);
} catch (\Exception $e) {
    echo json_encode(["success" => false, "error" => "Errore API: " . $e->getMessage()]);
}
