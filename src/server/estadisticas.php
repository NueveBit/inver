<?php

$db = include(dirname(__FILE__) . "/db.php");
mysqli_set_charset($db, 'utf8');

if (isset($_GET["resumenIndicadores"])) {
    echo json_encode(findResumenIndicadores($db));
} else if (isset($_GET["tipoSujeto"])) {
    $searchCriteria = array();
    $searchCriteria["tipoSujeto"] = intval($_GET["tipoSujeto"]);

    if (isset($_GET["sujetoObligado"])) {
        $searchCriteria["sujetoObligado"] = intval($_GET["sujetoObligado"]);
    }

    if (isset($_GET["indicador"])) {
        $searchCriteria["indicador"] = intval($_GET["indicador"]);
    }

    echo json_encode(findIndicadores($db, $searchCriteria));
} else if (isset($_GET["tiposIndicadores"])) {
    echo json_encode(findTiposIndicadores($db));
}

function findTiposIndicadores($db) {
    $sql = "select t.id, t.nombre from TipoIndicador as t";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $stmt->bind_result($id, $nombre);
    
    $tipos = array();
    while ($stmt->fetch()) {
        $tipos[] = array(
            "id" => $id,
            "nombre" => $nombre
        );
    }

    return $tipos;
}

function findResumenIndicadores($db) {
    $sql = "select ti.id, ti.nombre, sum(i.valor)/count(i.valor) from Indicador i, TipoIndicador ti where i.tipoId = ti.id group by ti.id order by ti.nombre";

    $stmt = $db->prepare($sql);
    $stmt->execute();

    $stmt->bind_result($tipoId, $tipoNombre, $promedio);
    $resumen = array();
    while ($stmt->fetch()) {
        $resumen[] = array(
            "id" => $tipoId,
            "nombre" => $tipoNombre,
            "promedio" => $promedio
        );
    }

    return $resumen;
}

function findIndicadores($db, $searchCriteria) {
    if (!isset($searchCriteria["tipoSujeto"])) {
        return array();
    }

    $sql = "select i.id, i.nombre, sum(i.valor)/count(i.valor), ti.id, ti.nombre, t.id from Indicador i, TipoIndicador ti, TipoSujeto t, SujetoObligado s where i.tipoId = ti.id and i.idSujetoObligado = s.id and s.idTipoSujeto = t.id ";

    $sql .= "and t.id = ? ";
    $params = array(&$searchCriteria["tipoSujeto"]);

    if (isset($searchCriteria["sujetoObligado"])) {
        $sql .= "and s.id = ? ";
        $params[] = &$searchCriteria["sujetoObligado"];
    }

    if (isset($searchCriteria["indicador"])) {
        $sql .= "and i.tipoId = ? ";
        $params[] = &$searchCriteria["indicador"];
    }

    $sql .= "group by t.id, i.nombre order by t.id, i.tipoId, cast(i.nombre as unsigned)";

    $stmt = $db->prepare($sql);
    $types = "";
    foreach ($params as $param) {
        $types .= "i";
    }
    $params = array_merge(array($types), $params);
    call_user_func_array(array($stmt, "bind_param"), $params);

    $stmt->execute();
    $stmt->bind_result($id, $nombre, $valor, $tipoId, $tipoNombre, $tipoSujetoId);

    $indicadores = array();

    while ($stmt->fetch()) {
        if (!isset($indicadores[$tipoId])) {
            $indicadores[$tipoId] = array(
                "id" => $tipoId,
                "nombre" => $tipoNombre,
                "indicadores" => array()
            );
        }

        $tipo = & $indicadores[$tipoId];
        $tipo["indicadores"][] = array("nombre" => $nombre, "valor" => $valor);
    }

    return array_values($indicadores);
}

?>