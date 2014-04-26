<?php
/*
$request = json_decode(file_get_contents("php://input"), true);
var_dump($request);
if (isset($request["tipo"]) && isset($request["tipoGestion"])){
	echo "Bien muy bien";
}*/
header("Content-Type: application/json; charset=utf-8");

$db = require_once dirname(__FILE__) . "/db.php";

mysqli_set_charset($db, "utf8");

getTiposSolicitud($db);

function getTiposSolicitud($db){
	$datos = array();
	$sql=  "select id, nombre from TipoSujeto";
	$stmt= $db->prepare($sql);
	$stmt->execute();
	$stmt->bind_result($id, $nombre);
	while ($stmt->fetch()) {
		$datos[] = array("id" => $id, "nombre" => $nombre);
	}
	var_dump($datos);
	$tiposSujetos = json_encode($datos);
	echo $tiposSujetos;
}


?>
