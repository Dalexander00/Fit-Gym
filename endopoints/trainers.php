<?php
   header("Access-Control-Allow-Origin: *"); 
   header("Access-Control-Allow-Methods: GET, POST"); 
   header("Access-Control-Allow-Headers: Content-Type"); 
   header('Content-Type: application/json');

   $con = new PDO("mysql:host=localhost;dbname=findmypt_db", 'root', 'mattia12345');;
   
   $query = "select * from pt_dati t LEFT JOIN users u ON t.pt_id = u.id
   LEFT JOIN immagini i ON t.pt_id = i.idUtente";
   $stm = $con->prepare($query);
   $stm->setFetchMode(PDO::FETCH_OBJ);
   $stm->execute();
   $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

   $trainers = []; 
  foreach ($rows as $row) {
   $trainers[] = $row; 
  }
echo json_encode($trainers);

?>