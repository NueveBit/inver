<?php

header("Content-Type: application/json; charset=utf-8");
session_start();
date_default_timezone_set('America/Mexico_City');

$data = json_decode(file_get_contents("php://input"), true);
$db = require_once dirname(__FILE__) . "/db.php";
mysqli_set_charset($db, "utf8");

if (isset($_GET["mediosNotificacion"])) {
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
} elseif (isset($data["solicitud"])) {
    $tipoSolicitud = $data["solicitud"]["tipo"];
    $tipo = $tipoSolicitud["tipo"];
    $tipoGestion = $data["solicitud"]["tipoGestion"];
    $descripcion = $data["solicitud"]["descripcion"];
    $fechaInicio = date('Y-m-j');
    $fechaLimite = date('Y-m-j', strtotime('+10 day', strtotime($fechaInicio)));
    $status = "En proceso";
    $sujetoObligado = $data["solicitud"]["sujetoObligado"];
    $idSujetoObligado = $sujetoObligado["id"];
    $idUsuario = $data["solicitud"]["idUsuario"];
    $formaNotificacion = $data["solicitud"]["formaNotificacion"];
    $resultado = guardarSolicitud($db, $tipo, $tipoGestion, $descripcion, $formaNotificacion, $fechaInicio, $fechaLimite, $status, $idSujetoObligado, $idUsuario);
    echo json_encode($resultado);
} elseif (isset($_GET["fechaRangoInicio"]) && isset($_GET["fechaRangoFin"]) && isset($_GET["status"]) && isset($_GET["idUsuario"])) {
    $resultado = getListaSolicitudesByFechaStatus($db, $_GET["fechaRangoInicio"], $_GET["fechaRangoFin"], isset($_GET["status"]), $_GET["idUsuario"]);
    echo json_encode($resultado);
} elseif (isset($_GET["fechaInicio"]) && isset($_GET["idUsuario"])) {
    $resultado = getListaSolicitudesByFecha($db, $_GET["fechaInicio"], $_GET["idUsuario"]);
    echo json_encode($resultado);
} elseif (isset($_GET["fechaRangoInicio"]) && isset($_GET["fechaRangoFin"]) && isset($_GET["idUsuario"])) {
    $resultado = getListaSolicitudesByRangoFecha($db, $_GET["fechaRangoInicio"], $_GET["fechaRangoFin"], $_GET["idUsuario"]);
    echo json_encode($resultado);
} elseif (isset($_GET["status"]) && isset($_GET["idUsuario"])) {
    $resultado = getListaSolicitudesByStatus($db, $_GET["status"], $_GET["idUsuario"]);
    echo json_encode($resultado);
} elseif (isset($_GET["tipo"])) {
    $resultado = getListaSolicitudesByTipo($db, $_GET["tipo"]);
    echo json_encode($resultado);
} elseif (isset($_GET["idSolicitud"])) {
    $resultado = getDetalleSolicitud($db, $_GET["idSolicitud"]);
    echo json_encode($resultado);
}

$db->close();

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
    $usuarioId = $_REQUEST["token"];

    $solicitud["idSujetoObligado"] = $solicitud["sujetoObligado"]["id"];
    $solicitud["tipoId"] = $solicitud["tipo"]["id"];
    $solicitud["idUsuario"] = $usuarioId;
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
        "idSujetoObligado",
        "idUsuario"
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
        $estado = array("id" => $id);
    } else {
        $estado = array("error" => "Ocurrió un error al guardar la solicitud, inténtalo de nuevo.");
    }
    return $estado;
}

function guardarSolicitud($db, $tipo, $tipoGestion, $descripcion, $formaNotificacion, $fechaInicio, $fechaLimite, $status, $idSujetoObligado, $idUsuario) {
    $sql = "insert into SolicitudInformacion (tipo, tipoGestion, descripcion, status, formaNotificacion, 
		fechaInicio, fechaLimite,  idSujetoObligado, idUsuario) values (?,?,?,?,?,?,?,?,?)";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("sssssssss", $tipo, $tipoGestion, $descripcion, $status, $formaNotificacion, $fechaInicio, $fechaLimite, $idSujetoObligado, $idUsuario);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        $id = $stmt->insert_id;
        $estado = array("estado" => "Registro guardado", "id" => $id);
    } else {
        $estado = array("estado" => "Error al guardar el registro");
    }
    return $estado;
}

function getListaSolicitudesByUsuario($db, $idUsuario) {
    $sql = "select SolicitudInformacion.id as id, 
	SolicitudInformacion.tipo as tipo, 
	SolicitudInformacion.fechaInicio as fechaInicio, 
	SolicitudInformacion.status as status
	from SolicitudInformacion, Usuario
	where SolicitudInformacion.idUsuario=? and 
	SolicitudInformacion.idUsuario=Usuario.id";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("d", $idUsuario);
    $stmt->execute();
    $stmt->bind_result($id, $tipo, $fechaInicio, $status);
    while ($stmt->fetch()) {
        $solicitudes[] = array("id" => $id, "tipo" => $tipo, "fechaInicio" => $fechaInicio, "estado" => $status);
    }
    return $solicitudes;
}

function getListaSolicitudesByFecha($db, $fechaInicio, $idUsuario) {
    $sql = "select SolicitudInformacion.id as id, 
	SolicitudInformacion.tipo as tipo, 
	SolicitudInformacion.fechaInicio as fechaInicio, 
	SolicitudInformacion.status as status
	from SolicitudInformacion, Usuario
	where SolicitudInformacion.fechaInicio = ? and
	SolicitudInformacion.idUsuario=? and 
	SolicitudInformacion.idUsuario=Usuario.id";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("ss", $fechaInicio, $idUsuario);
    $stmt->execute();
    $stmt->bind_result($id, $tipo, $fechaInicio, $status);
    while ($stmt->fetch()) {
        $solicitudes[] = array("id" => $id, "tipo" => $tipo, "fechaInicio" => $fechaInicio, "status" => $status);
    }
    return $solicitudes;
}

function getListaSolicitudesByRangoFecha($db, $fechaInicial, $fechaFinal, $idUsuario) {
    $sql = "select SolicitudInformacion.id as id, 
	SolicitudInformacion.tipo as tipo, 
	SolicitudInformacion.fechaInicio as fechaInicio, 
	SolicitudInformacion.status as status
	from SolicitudInformacion, Usuario
	where SolicitudInformacion.fechaInicio between ? and ? and
	SolicitudInformacion.idUsuario=? and 
	SolicitudInformacion.idUsuario=Usuario.id";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("sss", $fechaInicial, $fechaFinal, $idUsuario);
    $stmt->execute();
    $stmt->bind_result($id, $tipo, $fechaInicio, $status);
    while ($stmt->fetch()) {
        $solicitudes[] = array("id" => $id, "tipo" => $tipo, "fechaInicio" => $fechaInicio, "status" => $status);
    }
    return $solicitudes;
}

function getListaSolicitudesByStatus($db, $status, $idUsuario) {
    $sql = "select SolicitudInformacion.id as id, 
	SolicitudInformacion.tipo as tipo, 
	SolicitudInformacion.fechaInicio as fechaInicio, 
	SolicitudInformacion.status as status
	from SolicitudInformacion, Usuario
	where SolicitudInformacion.status = ? and
	SolicitudInformacion.idUsuario=? and 	
	SolicitudInformacion.idUsuario=Usuario.id";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("ss", $status, $idUsuario);
    $stmt->execute();
    $stmt->bind_result($id, $tipo, $fechaInicio, $status);
    while ($stmt->fetch()) {
        $solicitudes[] = array("id" => $id, "tipo" => $tipo, "fechaInicio" => $fechaInicio, "status" => $status);
    }
    return $solicitudes;
}

function getListaSolicitudesByFechaStatus($db, $fechaInicial, $fechaFinal, $status, $idUsuario) {
    $sql = "select SolicitudInformacion.id as id, 
	SolicitudInformacion.tipo as tipo, 
	SolicitudInformacion.fechaInicio as fechaInicio, 
	SolicitudInformacion.status as status
	from SolicitudInformacion, Usuario
	where SolicitudInformacion.fechaInicio between ? and ? and
	SolicitudInformacion.status= ? and 
	SolicitudInformacion.idUsuario=? and
	SolicitudInformacion.idUsuario=Usuario.id";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("ssss", $fechaInicial, $fechaFinal, $status, $idUsuario);
    $stmt->execute();
    $stmt->bind_result($id, $tipo, $fechaInicio, $status);
    while ($stmt->fetch()) {
        $solicitudes[] = array("id" => $id, "tipo" => $tipo, "fechaInicio" => $fechaInicio, "status" => $status);
    }
    return $solicitudes;
}

function getListaSolicitudesByTipo($db, $tipo) {
    $sujetosObligados = array();
    $sql = "select SolicitudInformacion.id as id, 
	SolicitudInformacion.tipo as tipo, 
	SolicitudInformacion.fechaInicio as fechaInicio, 
	SolicitudInformacion.status as status
	from SolicitudInformacion
	where SolicitudInformacion.tipo = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("s", $tipo);
    $stmt->execute();
    $stmt->bind_result($id, $tipo, $fechaInicio, $status);
    while ($stmt->fetch()) {
        $solicitudes[] = array("id" => $id, "tipo" => $tipo, "fechaInicio" => $fechaInicio, "status" => $status);
    }
    return $solicitudes;
}

function getDetalleSolicitud($db, $idSolicitud) {
    $sujetosObligados = array();
    $sql = "select SolicitudInformacion.id as id, 
	SolicitudInformacion.tipo as tipo, 
	SolicitudInformacion.tipoGestion as tipoGestion, 
	SolicitudInformacion.descripcion as descripcion, 
	SolicitudInformacion.status as status,
	SolicitudInformacion.formaNotificacion as formaNotificacion,
	SolicitudInformacion.fechaInicio as fechaInicio,
	SolicitudInformacion.fechaNotificacion as fechaNotificacion,
	SolicitudInformacion.fechaLimite as fechaLimite,
	SolicitudInformacion.fechaCompletado as fechaCompletado,
	SujetoObligado.nombre as sujetoObligado
	from SolicitudInformacion, SujetoObligado 
	where SolicitudInformacion.id=? and 
	SolicitudInformacion.idSujetoObligado=SujetoObligado.id";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("d", $idSolicitud);
    $stmt->execute();
    $stmt->bind_result($id, $tipo, $tipoGestion, $descripcion, $status, $formaNotificacion, $fechaInicio, $fechaNotificacion, $fechaLimite, $fechaCompletado, $sujetoObligado);
    while ($stmt->fetch()) {
        $detalle[] = array("id" => $id, "tipo" => $tipo,
            "tipoGestion" => $tipoGestion, "descripcion" => $descripcion,
            "estado" => $status, "formaNotificacion" => $formaNotificacion,
            "fechaInicio" => $fechaInicio, "fechaLimite" => $fechaLimite,
            "fechaNotificacion" => $fechaNotificacion, "fechaCompletado" => $fechaCompletado,
            "sujetoObligado" => $sujetoObligado);
    }
    return $detalle;
}

?>
