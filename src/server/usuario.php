<?php
header("Content-Type: application/json; charset=utf-8");

$db = require_once dirname(__FILE__) . "/db.php";
mysqli_set_charset($db, "utf8");

if (isset($_GET["idUsuario"])){
	$resultado = getPerfil($db, $_GET["idUsuario"]);
	echo json_encode($resultado);
}
mysqli_close($db);
function getPerfil($db, $idUsuario){
	$sql=  "select username, password, preguntaSecreta, respuestaSecreta, 
	personalidadJuridica, nombre,apellidoPaterno, apellidoMaterno, fechaNacimiento, 
	email, estado, municipio, codigoPostal, colonia, calle, numeroExterior, 
	numeroInterior, telefono, fax from Usuario where id=?";
	$stmt= $db->prepare($sql);
	$stmt->bind_param("s", $idUsuario);
	$stmt->execute();
	$stmt->bind_result($username, $password, $preguntaSecreta, $respuestaSecreta, 
		$personalidadJuridica, $nombre, $apellidoPaterno, $apellidoMaterno, 
		$fechaNacimiento, $email, $estado, $municipio, $codigoPostal, 
		$colonia, $calle, $numeroExterior, $numeroInterior, $telefono, $fax);
	while ($stmt->fetch()) {
		$perfil[] = array("username" => $username, "password" => $password, 
			"preguntaSecreta"=>$preguntaSecreta, "respuestaSecreta"=>$respuestaSecreta,
			"personalidadJuridica"=>$personalidadJuridica, "nombre"=>$nombre,
			"apellidoPaterno"=>$apellidoPaterno, "apellidoMaterno"=>$apellidoMaterno,
			"fechaNacimiento"=>$fechaNacimiento, "email"=>$email,"estado"=>$estado,
			"municipio"=>$municipio, "codigoPostal"=>$codigoPostal, "colonia"=>$colonia, 
			"calle"=>$calle, "numeroExterior"=>$numeroExterior, "numeroInterior"=> $numeroInterior, 
			"telefono"=>$telefono, "fax"=>$fax);
	}
	return $perfil;
}
?>