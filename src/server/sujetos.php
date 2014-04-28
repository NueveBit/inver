<?php 

$db = include(dirname(__FILE__) . "/db.php");

echo json_encode(findTiposSujetos($db));

function findTiposSujetos($db) {
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