<?php

header("Content-Type: application/json; charset=utf-8");

$db = require_once dirname(__FILE__) . "/db.php";
mysqli_set_charset($db, "utf8");

if (isset($_GET["idUsuario"])) {
    $resultado = getPerfil($db, $_GET["idUsuario"]);
    echo json_encode($resultado);
} else if (isset($_REQUEST["save"])) {
    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode(saveUsuario($db, $data));
}

mysqli_close($db);

function getPerfil($db, $idUsuario) {
    $sql = "select id, username, password, preguntaSecreta, respuestaSecreta, 
	personalidadJuridica, nombre,apellidoPaterno, apellidoMaterno, fechaNacimiento, 
	email, estado, municipio, codigoPostal, colonia, calle, numeroExterior, 
	numeroInterior, telefono, fax from Usuario where id=?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $idUsuario);
    $stmt->execute();
    $stmt->bind_result($id, $username, $password, $preguntaSecreta, $respuestaSecreta, $personalidadJuridica, $nombre, $apellidoPaterno, $apellidoMaterno, $fechaNacimiento, $email, $estado, $municipio, $codigoPostal, $colonia, $calle, $numeroExterior, $numeroInterior, $telefono, $fax);
    $stmt->fetch();
    $perfil = array(
        "id" => $id,
        "username" => $username,
        "preguntaSecreta" => $preguntaSecreta, "respuestaSecreta" => $respuestaSecreta,
        "personalidadJuridica" => $personalidadJuridica, "nombre" => $nombre,
        "apellidoPaterno" => $apellidoPaterno, "apellidoMaterno" => $apellidoMaterno,
        "fechaNacimiento" => $fechaNacimiento, "email" => $email, "estado" => $estado,
        "municipio" => $municipio, "codigoPostal" => $codigoPostal, "colonia" => $colonia,
        "calle" => $calle, "numeroExterior" => $numeroExterior, "numeroInterior" => $numeroInterior,
        "telefono" => $telefono, "fax" => $fax);
    return $perfil;
}

function saveUsuario($db, $usuario) {
    $cols = array(
        "username",
        "preguntaSecreta",
        "respuestaSecreta",
        "personalidadJuridica",
        "nombre",
        "apellidoPaterno",
        "apellidoMaterno",
        "fechaNacimiento",
        "email",
        "estado",
        "municipio", "codigoPostal",
        "colonia",
        "calle",
        "numeroExterior",
        "numeroInterior",
        "telefono",
        "fax"
    );
    if (isset($usuario["password"])) { // cambiar pass
        $cols[] = "password";
    }

    $params = array();
    $types = "";

    if (!isset($usuario ["id"])) { // nuevo usuario
        $sql = "select count(*) from Usuario where username = ? or email = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("ss", $usuario["username"], $usuario["email"]);
        $stmt->execute();

        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        if ($count > 0) {
            return array("error" => "El nombre de usuario o correo electrónico no está disponible.");
        }
        
        $sql = "insert into Usuario (" . implode(", ", $cols) . ") values (";
        foreach ($cols as $col) {
            $types .= "s";
            $params[] = &$usuario[$col];
            $sql .= "?,";
        }

        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= ")";

        $stmt = $db->prepare($sql);
        $params = array_merge(array($types), $params);
        call_user_func_array(array($stmt, "bind_param"), $params);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $id = $stmt->insert_id;
            $estado = array("id" => $id);
        } else {
            $estado = array("error" => "Ocurrió un error al guardar la solicitud, inténtalo de nuevo.");
        }
        return $estado;
    } else { // update
        $sql = "update Usuario set ";
        foreach ($cols as $col) {
            $sql .= $col . "= ?,";
            $types .= "s";
            $params[] = &$usuario[$col];
        }
        $sql = substr($sql, 0, strlen($sql) - 1);
        $sql .= " where id = ?";
        $types .= "i";
        $params[] = &$usuario["id"];

        $stmt = $db->prepare($sql);
        $params = array_merge(array($types), $params);
        call_user_func_array(array($stmt, "bind_param"), $params);
        $stmt->execute();
        delete($usuario["password"]);
        return $usuario;
    }

}

?>