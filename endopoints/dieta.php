<?php
session_start();

$frontend_origin = "http://localhost:8080";
header("Access-Control-Allow-Origin: $frontend_origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

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

// 🔎 recupero la dieta dell’utente
$stmt = $mysqli->prepare("SELECT Lunedi, Martedi, Mercoledi, Giovedi, Venerdi, Sabato, Domenica, idNutrizionista FROM diete WHERE idCliente = ? LIMIT 1");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

if (!$data) {
    echo json_encode(["success" => false, "error" => "Nessuna dieta trovata"]);
    exit;
}

// 🥗 funzione per splittare i pasti
function parseMeals($giorno) {
    if (!$giorno) return [];
    $parts = explode("*", $giorno); // separa i pasti
    $meals = [];
    foreach ($parts as $part) {
        $split = explode(":", $part, 2); // es. "Colazione: Yogurt, Frutta"
        if (count($split) === 2) {
            $meals[trim($split[0])] = trim($split[1]); // la parte dopo i due punti è una stringa
        }
    }
    return $meals; // { "Colazione": "Yogurt, Frutta", "Pranzo": "Riso, Pollo" }
}


$response = [
    "success" => true,
    "dieta" => [
        [
            "day" => "GIORNO 1",
            "dayName" => "Lunedì",
            "focus" => "Nutrizione",
            "meals" => parseMeals($data["Lunedi"])
        ],
        [
            "day" => "GIORNO 2",
            "dayName" => "Martedì",
            "focus" => "Nutrizione",
            "meals" => parseMeals($data["Martedi"])
        ],
        [
            "day" => "GIORNO 3",
            "dayName" => "Mercoledì",
            "focus" => "Nutrizione",
            "meals" => parseMeals($data["Mercoledi"])
        ],
        [
            "day" => "GIORNO 4",
            "dayName" => "Giovedì",
            "focus" => "Nutrizione",
            "meals" => parseMeals($data["Giovedi"])
        ],
        [
            "day" => "GIORNO 5",
            "dayName" => "Venerdì",
            "focus" => "Nutrizione",
            "meals" => parseMeals($data["Venerdi"])
        ],
        [
            "day" => "GIORNO 6",
            "dayName" => "Sabato",
            "focus" => "Nutrizione",
            "meals" => parseMeals($data["Sabato"])
        ],
        [
            "day" => "GIORNO 7",
            "dayName" => "Domenica",
            "focus" => "Nutrizione",
            "meals" => parseMeals($data["Domenica"])
        ],
    ],
    "idNutrizionista" => $data["idNutrizionista"]
];


echo json_encode($response);
$mysqli->close();
?>