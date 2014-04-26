<?php

$data = json_decode(file_get_contents("php://input"), true);
if (isset($data["tipo"]) && isset($data["tipoGestion"])){
	echo "Bien muy bien";
}
header("Content-Type: application/json; charset=utf-8");

$db = require_once dirname(__FILE__) . "/db.php";

mysqli_set_charset($db, "utf8");

$resultado = getTiposSolicitudes($db);
	echo json_encode($resultado);

if (isset($data["tiposSujetos"])){
	$resultado = getTiposSolicitudes($db);
	echo json_encode($resultado);
}

function getTiposSolicitudes($db){
	$tiposSujetos = array();
	$sql=  "select id, nombre from TipoSujeto";
	$stmt= $db->prepare($sql);
	$stmt->execute();
	$stmt->bind_result($id, $nombre);
	while ($stmt->fetch()) {
		$tiposSujetos[] = array("id" => $id, "tipoSujeto" => $nombre);
	}
	return $tiposSujetos;
}


?>
