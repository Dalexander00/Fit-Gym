<?php
   header("Access-Control-Allow-Origin: *"); 
   header("Access-Control-Allow-Methods: GET, POST"); 
   header("Access-Control-Allow-Headers: Content-Type"); 
   header('Content-Type: application/json');

   $con = new PDO("mysql:host=localhost;dbname=findmypt_db", 'root', 'mattia12345');;
   
   $query = "select * from esercizi";
   $stm = $con->prepare($query);
   $stm->setFetchMode(PDO::FETCH_OBJ);
   $stm->execute();
   $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

   $exercises = []; 
  foreach ($rows as $row) {
   $exercises[] = $row; 
  }
echo json_encode($exercises);

?>