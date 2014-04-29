<?php

session_start();
header("Content-Type: application/json; charset=utf-8");

$db = require_once dirname(__FILE__) . "/db.php";

mysqli_set_charset($db, "utf8");

if (isset($_GET["username"]) && isset($_GET["password"])) {
	$resultado = login($_GET["username"], $_GET["password"], $db);
	echo json_encode($resultado);
}
elseif (isset($_GET["loggedIn"])) {
	echo json_encode(isLoggedIn());
}
elseif (isset($_GET["logout"])) {
	logout();
}
$db->close();

function isLoggedIn (){
	return (array_key_exists("loggedIn", $_SESSION) && $_SESSION["loggedIn"]) 
			? array("isLoggedIn"=>true)
			: array("isLoggedIn"=>false);
}

function login($usuario, $password, $db){
	$sql=  "select id from Usuario where username=? and password=?";
	$stmt= $db->prepare($sql);
	$stmt->bind_param("ss", $usuario, $password);
	$stmt->execute();
	$stmt->bind_result($id);
	$stmt->fetch();
	
	if ($id){
		$_SESSION["loggedIn"]=true;
		$loggedIn = true;
	}
	else{
		$loggedIn = false;
	}
	$isLoggedIn=array("idUsuario"=>$id);
	return $isLoggedIn;
}

function logout(){
	$_SESSION["loggedIn"]=false;

}
?>

