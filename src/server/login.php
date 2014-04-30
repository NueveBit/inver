<?php

session_start();
header("Content-Type: application/json; charset=utf-8");

$db = require_once dirname(__FILE__) . "/db.php";

mysqli_set_charset($db, "utf8");

if (isset($_REQUEST["login"])) {
    $json = file_get_contents('php://input');
    $user = json_decode($json);
    $resultado = login($user->username, $user->password, $db);
    echo json_encode($resultado);
} elseif (isset($_POST["loggedIn"])) {
    echo json_encode(isLoggedIn());
} elseif (isset($_POST["logout"])) {
    logout();
}
$db->close();

function isLoggedIn() {
    return (array_key_exists("loggedIn", $_SESSION) && $_SESSION["loggedIn"]) ? array("isLoggedIn" => true) : array("isLoggedIn" => false);
}

function login($usuario, $password, $db) {
    $sql = "select id from Usuario where username=? and password=?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("ss", $usuario, $password);
    $stmt->execute();
    $stmt->bind_result($id);
    $stmt->fetch();

    if ($id) {
        $_SESSION["usuarioId"] = $id;
        $loggedIn = true;
    } else {
        $loggedIn = false;
    }
    // por ahora, el token es simplemente el id del usuario
    return array("loggedIn" => $loggedIn, "token" => $id);
}

function logout() {
    $_SESSION["loggedIn"] = false;
}
?>

