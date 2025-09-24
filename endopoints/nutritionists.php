<?php
   header("Access-Control-Allow-Origin: *"); 
   header("Access-Control-Allow-Methods: GET, POST"); 
   header("Access-Control-Allow-Headers: Content-Type"); 
   header('Content-Type: application/json');

   $con = new PDO("mysql:host=localhost;dbname=findmypt_db", 'root', 'mattia12345');;
   
   $query = "select * from nutrizionisti_dati n LEFT JOIN users u ON n.idNutrizionista = u.id
   LEFT JOIN immagini i ON n.idNutrizionista = i.idUtente";
   $stm = $con->prepare($query);
   $stm->setFetchMode(PDO::FETCH_OBJ);
   $stm->execute();
   $rows = $stm->fetchAll(PDO::FETCH_ASSOC);

   $nutritionists = []; 
  foreach ($rows as $row) {
   $nutritionists[] = $row; 
  }
echo json_encode($nutritionists);

?>