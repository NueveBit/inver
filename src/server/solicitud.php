<?php

header("Content-Type: application/json; charset=utf-8");
session_start();
date_default_timezone_set('America/Mexico_City');

$data = json_decode(file_get_contents("php://input"), true);
$db = require_once dirname(__FILE__) . "/db.php";
mysqli_set_charset($db, "utf8");

if (isset($_GET["completar"])) {
    $folio = intval($_GET["idSolicitud"]);
    completarSolicitud($db, $folio);
} else if (isset($_GET["mediosNotificacion"])) {
    echo json_encode(array(
        array("medio" => "Consulta física o directamente - Sin costo"),
        array("medio" => "Consulta vía Infomex - Sin costo"),
        array("medio" => "Copia certificada - Con costo"),
        array("medio" => "Copia simple - Con costo"),
        array("medio" => "Otro medio")
    ));
} else if (isset($_GET["tiposGestion"])) {
// Sólo la solicitud de información requiere este dato, pero no
// está relacionado con ninguna otra entidad, por eso simplemente
// devolvemos valores estáticos.
    echo json_encode(array(
        array("tipo" => "Acceso"),
        array("tipo" => "Actualización"),
        array("tipo" => "Rectificación"),
        array("tipo" => "Supresión"),
        array("tipo" => "Mantener confidencialidad")
    ));
} else if (isset($_GET["tiposSolicitudes"])) {
    echo json_encode(getTiposSolicitudes($db));
} else if (isset($_GET["tiposSujetos"])) {
    $resultado = getTiposSujetos($db);
    echo json_encode($resultado);
} elseif (isset($_GET["idTipoSujeto"])) {
    $resultado = getSujetosObligados($db, $_GET["idTipoSujeto"]);
    echo json_encode($resultado);
} else if (isset($_REQUEST["save"])) {
    if (!isset($_REQUEST["token"])) {
        die("Not authorized");
    }

// $data == solicitud en json, si no tiene id, es nueva solicitud   
    echo json_encode(saveSolicitud($db, $data));
} elseif (isset($_REQUEST["seguidores"]) && isset($_REQUEST["idSolicitud"])) {
    $seguidores = getSeguidores($db, $_REQUEST["idSolicitud"]);
    echo json_encode($seguidores);
} elseif (isset($_GET["idSolicitud"])) {
    $resultado = getDetalleSolicitud($db, $_GET["idSolicitud"]);
    echo json_encode($resultado);
} else if (isset($_GET["search"])) {

    $searchCriteria = array();
    if (!isset($_GET["usuarioId"])) { // usuario id necesario (token)
        //die("Not authorized");
    } else {
        $searchCriteria["idUsuario"] = intval($_GET["usuarioId"]);
    }

    $dateRange = array();

    if (isset($_GET["fechaInicio"])) {
        $dateRange["fechaInicio"] = $_GET["fechaInicio"];
    }

    if (isset($_GET["fechaFin"])) {
        $dateRange["fechaFin"] = $_GET["fechaFin"];
    }

    if (isset($_GET["status"])) {
        $searchCriteria["status"] = $_GET["status"];
    }

    if (isset($_GET["tipo"])) {
        $searchCriteria["tipoId"] = intval($_GET["tipoId"]);
    }

    echo json_encode(find($db, $searchCriteria));
} else if (isset($_REQUEST["seguir"]) && isset($_REQUEST["token"])) {
    if (isset($data["solicitudId"])) {
        $solicitudId = filter_var($data["solicitudId"], FILTER_SANITIZE_NUMBER_INT);
        $token = filter_var($_REQUEST["token"], FILTER_SANITIZE_NUMBER_INT);
        $resultado = seguirSolicitud($db, $solicitudId, $token);
        echo json_encode($resultado);
    }
}

function find($db, $searchCriteria) {
    $sql = "select s.id, t.nombre, s.fechaInicio, s.status from SolicitudInformacion as s, TipoSolicitud as t ";

    if (isset($searchCriteria["idUsuario"])) {
        $sql .= ", Usuario as u, Seguidor as g where g.idUsuario = u.id and s.tipoId = t.id and g.idSolicitudInformacion = s.id ";
    } else {
        $sql .= "where s.tipoId = t.id ";
    }

    $types = "";
    $params = array();

    foreach ($searchCriteria as $key => $criteria) {
        if (!$criteria) {
            continue;
        }
        if ($key == "idUsuario") {
            $sql .= "and g.idUsuario=? ";
        } else {
            $sql .= "and s." . $key . "=? ";
        }
        $types .= "s";
        $params[] = &$searchCriteria[$key];
    }

    if (isset($dateRange["fechaInicio"]) && isset($dateRange["fechaFin"])) {
        $sql .= "and (s.fechaInicio between ? and ? )";
        $params[] = &$dateRange["fechaInicio"];
        $params[] = &$dateRange["fechaFin"];
        $types .= "ss";
    }
    $stmt = $db->prepare($sql);
    if ($params) {
        $params = array_merge(array($types), $params);
        call_user_func_array(array($stmt, "bind_param"), $params);
    }
    $stmt->execute();

    $stmt->bind_result($id, $tipo, $fechaInicio, $status);
    $solicitudes = array();
    while ($stmt->fetch()) {
        $solicitudes[] = array("id" => $id, "tipo" => $tipo, "fechaInicio" => $fechaInicio, "status" => $status);
    }
    return $solicitudes;
}

// cierra la conexión a la DB.
mysqli_close($db);

function getTiposSolicitudes($db) {
    $sql = "select id, nombre from TipoSolicitud";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $stmt->bind_result($id, $nombre);
    while ($stmt->fetch()) {
        $tiposSolicitudes[] = array("id" => $id, "nombre" => $nombre);
    }
    return $tiposSolicitudes;
}

function getTiposSujetos($db) {
    $sql = "select id, nombre from TipoSujeto";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $stmt->bind_result($id, $nombre);
    while ($stmt->fetch()) {
        $tiposSujetos[] = array("id" => $id, "tipoSujeto" => $nombre);
    }
    return $tiposSujetos;
}

function getSujetosObligados($db, $idTipoSujeto) {
    $sql = "select SujetoObligado.id as id, SujetoObligado.nombre as nombre from SujetoObligado, 
	TipoSujeto where idTipoSujeto=? and SujetoObligado.idTipoSujeto=TipoSujeto.id";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("d", $idTipoSujeto);
    $stmt->execute();
    $stmt->bind_result($id, $nombre);
    while ($stmt->fetch()) {
        $tiposSujetos[] = array("id" => $id, "sujeto" => $nombre);
    }
    return $tiposSujetos;
}

// TODO: Soportar actualización de solicitudes
function saveSolicitud($db, $solicitud) {
    $solicitud["idSujetoObligado"] = $solicitud["sujetoObligado"]["id"];
    $solicitud["tipoId"] = $solicitud["tipo"]["id"];
    $solicitud["fechaInicio"] = date('Y-m-j');
    $solicitud["fechaLimite"] = date('Y-m-j', strtotime('+10 day'));
    $solicitud["status"] = "En proceso";
    if (isset($solicitud["tipoGestion"])) {
        $solicitud["tipoGestion"] = $solicitud["tipoGestion"]["tipo"];
    }
    $cols = array(
        "tipoId",
        "tipoGestion",
        "descripcion",
        "status",
        "formaNotificacion",
        "fechaInicio",
        "fechaLimite",
        "idSujetoObligado"
    );

    $sql = "insert into SolicitudInformacion (" . implode(",", $cols) . ") values (";

    $params = array();
    $types = "";
    foreach ($cols as $col) {
        $types .= "s";
        if (!isset($solicitud[$col]) && $col !== "tipoGestion") {
            die("Solicitud inválida. " . $col);
        }
        $params[] = &$solicitud[$col];
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

        $sql = "insert into Seguidor (idSolicitudInformacion, idUsuario, propietario, fecha) values (?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("ddds", $id, $usuarioId, $propietario, $fecha);
        $usuarioId = $_REQUEST["token"];
        $fecha = date('Y-m-j');
        $propietario = 1;
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $idSeguidor = $stmt->insert_id;
            $estado = array("id" => $id, "idSeguidor" => $idSeguidor);
        }
    } else {
        $estado = array("error" => "Ocurrió un error al guardar la solicitud, inténtalo de nuevo.");
    }
    return $estado;
}

function getDetalleSolicitud($db, $idSolicitud) {
    $sql = "select s.id as id, 
	t.nombre as tipo, 
	s.tipoGestion as tipoGestion, 
	s.descripcion as descripcion, 
	s.status as status,
	s.formaNotificacion as formaNotificacion,
	s.fechaInicio as fechaInicio,
	s.fechaNotificacion as fechaNotificacion,
	s.fechaLimite as fechaLimite,
	s.fechaCompletado as fechaCompletado,
	o.nombre as sujetoObligado
	from SolicitudInformacion as s, SujetoObligado as o, TipoSolicitud as t
	where s.id=? and 
	s.idSujetoObligado=o.id and s.tipoId = t.id";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("d", $idSolicitud);
    $stmt->execute();
    $stmt->bind_result($id, $tipo, $tipoGestion, $descripcion, $status, $formaNotificacion, $fechaInicio, $fechaNotificacion, $fechaLimite, $fechaCompletado, $sujetoObligado);
    while ($stmt->fetch()) {
        $detalle = array("id" => $id, "tipo" => $tipo,
            "tipoGestion" => $tipoGestion, "descripcion" => $descripcion,
            "estado" => $status, "formaNotificacion" => $formaNotificacion,
            "fechaInicio" => $fechaInicio, "fechaLimite" => $fechaLimite,
            "fechaNotificacion" => $fechaNotificacion, "fechaCompletado" => $fechaCompletado,
            "sujetoObligado" => $sujetoObligado);
    }
    return $detalle;
}

// devuelve una lista de ids de usuarios que siguen la $solicitudId dada
function getSeguidores($db, $solicitudId) {
    $sql = "select idUsuario from Seguidor as s where s.idSolicitudInformacion = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("d", $solicitudId);
    $stmt->execute();
    $stmt->bind_result($id);
    $seguidores = array();
    while ($stmt->fetch()) {
        $seguidores[] = array("id" => $id);
    }

    return $seguidores;
}

function completarSolicitud($db, $folio) {
    $sql = "update SolicitudInformacion set status = ?, fechaCompletado = NOW() where id = ?";

    $status = "Completado";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("si", $status, $folio);
    $stmt->execute();

    echo "Completada solicitud: " . $folio;
}

function getPropiedad($db, $solicitudId, $token) {
    $resutado = array();
    $sql = "select Seguidor.idUsuario from Seguidor where Seguidor.propietario=true and Seguidor.idSolicitudInformacion=?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $solicitudId);
    $stmt->execute();
    $stmt->bind_result($idUsuario);
    $stmt->fetch();

    if ($token == $idUsuario) {
        $resultado["ispropietario"] = true;
    } else {
        $resultado["ispropietario"] = false;
    }
    return $resultado;
}

function seguirSolicitud($db, $idSolicitud, $token) {
    $sql = "select fecha from Seguidor as s where s.idSolicitudInformacion=? and s.idUsuario = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("dd", $idSolicitud, $token);
    $stmt->execute();
    $stmt->bind_result($fecha);
    $stmt->fetch();
    if (!$fecha) {
        $sql = "insert into Seguidor (idSolicitudInformacion, idUsuario, propietario, fecha) values (?, ?, 0, NOW())";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("dd", $idSolicitud, $token);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $idSeguidor = $stmt->insert_id;
            $siguiendo = true;
        } else {
            $siguiendo = false;
            $idSeguidor = -1;
        }
    }
    return array("siguiendo" => $siguiendo, "seguidores" => getSeguidores($db, $idSolicitud));
}
