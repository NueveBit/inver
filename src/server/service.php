<?php
/*
$data = json_decode(file_get_contents("php://input"));
$fstname = mysql_real_escape_string($data->fstname);
$lstname = mysql_real_escape_string($data->lstname);
*/

$con = mysql_connect("localhost", "blanca", "blanca123") or die("No hay conexión");
mysql_select_db("inver", $con);
mysql_set_charset("utf8");


echo "\n>>> Seleccionar Tipos de Sujetos Obligados Existentes: \n\n";
$tiposSujetos = getTiposSujetos($con);
echo $tiposSujetos. "\n\n";

echo "\n>>> Seleccionar Sujeto Obligado por id=123:\n\n";
$getSujetoObligadoById = getSujetoObligadoById($con, 123);
echo $getSujetoObligadoById . "\n";

echo "\n>>> Seleccionar Sujeto Obligado por Tipo de Sujeto = 2:\n\n";
$getSujetosObligadosByTipoSujeto = getSujetosObligadosByTipoSujeto($con, 2);
echo $getSujetosObligadosByTipoSujeto . "\n";

echo "\n>>> Seleccionar Indicadores por Tipo de Sujeto = 8:\n\n";
$getIndicadoresBySujeto = getIndicadoresByTipoSujeto($con, 2);
echo $getIndicadoresBySujeto . "\n";

echo "\n>>> Obtener perfil de Usuario:\n\n";
$getPerfil = getPerfilUsuario($con, "sagiblank");
echo $getPerfil . "\n";

echo "\n>>> Obtener solicitudes por Usuario:\n\n";
$getSolicitudesByusuario = getSolicitudesByusuario($con, 1);
echo $getSolicitudesByusuario . "\n";

echo "\n>>> Obtener solicitudes por tipo de solicitud = datos personales:\n\n";
$getSolicitudByTipoSolicitud = getSolicitudByTipoSolicitud($con, "Datos Personales");
echo $getSolicitudByTipoSolicitud . "\n";

echo "\n>>> Obtener solicitudes por estado de solicitud = Terminada:\n\n";
$getSolicitudByEstado = getSolicitudByEstado($con, "Terminada");
echo $getSolicitudByEstado . "\n";


mysql_close($con);

function getTiposSujetos($con){
  $sql = "select * from TipoSujeto";
  $resultadoConsulta = consulta($sql, $con);
  $tiposSujetos = json_encode($resultadoConsulta);
  return $tiposSujetos; 
}

function getSujetoObligadoById($con, $id){
  $sql = "select * from SujetoObligado where id=".$id;
  $resultado = consulta($sql, $con);
  $sujetoObligado = json_encode($resultado);
  return $sujetoObligado; 
}

function getSujetosObligadosByTipoSujeto($con, $idTipoSujeto){
  $sql = "select TipoSujeto.nombre as tipoSujeto, SujetoObligado.id, SujetoObligado.nombre from TipoSujeto, 
  SujetoObligado where idTipoSujeto=".$idTipoSujeto." and SujetoObligado.idTipoSujeto=TipoSujeto.id
  ";
  $result = mysql_query($sql, $con);
  if (! $result){
    echo "La consulta SQL contiene errores.".mysql_error();
    exit();
  }else {
    while($obj = mysql_fetch_array($result)) {      
      $result_list[]=$obj;
    }
    foreach ($result_list as $obj) {
      $arr["tipoSujeto"]=array("nombre"=>$obj["tipoSujeto"]);
      $arr["sujetosObligados"][]=array(
        "id"=> $obj["id"],
        "nombre"=>$obj["nombre"]
        );
    }
    $sujetosObligados = json_encode($arr);
  }
  return $sujetosObligados;
}

function getIndicadoresByTipoSujeto($con, $idTipoSujeto){
  $sql = "select TipoSujeto.id as idTipoSujeto, TipoSujeto.nombre as tipoSujeto, Indicador.nombre as indicador, Indicador.valor as valor, Indicador.tipo as tipoIndicador, SujetoObligado.id as sujetoObligadoId, 
  SujetoObligado.nombre as sujetoObligado from TipoSujeto, Indicador, SujetoObligado  where idTipoSujeto =".$idTipoSujeto." and Indicador.idSujetoObligado=SujetoObligado.id and SujetoObligado.idTipoSujeto = TipoSujeto.id";
  $resultado = mysql_query($sql, $con);
  if (! $resultado){
    echo "La consulta SQL contiene errores.".mysql_error();
    exit();
  }else {
    $result_list= array();
    while($obj = mysql_fetch_array($resultado)) { 
      $result_list[]=$obj;
    }
    $sujetosObligados=array();
    $indicadores= array();
    foreach ($result_list as $obj) {
      $idSujeto = $obj["sujetoObligadoId"];
      if (!array_key_exists($idSujeto, $indicadores)) {
        $indicadores[$idSujeto] = array();
        $sujeto = array("id"=>$obj["sujetoObligadoId"],"nombre"=>$obj["sujetoObligado"]);
        $sujeto["indicadores"]=&$indicadores[$idSujeto];
        $sujetosObligados[]=$sujeto;   
      }
      $indicador = array("tipo"=>$obj["tipoIndicador"], "indicador"=>$obj["indicador"], "valor"=>$obj["valor"]);
      $indicadores[$idSujeto][] =$indicador;
    }   

    $arr=array(
      "tipoSujeto"=>array("nombre"=>$obj["tipoSujeto"]),
      "sujetosObligados"=>$sujetosObligados
      );
    $indicadoresBySujeto = json_encode($arr);
  }
  return $indicadoresBySujeto;  
}

function getPerfilUsuario($con, $username){
  $sql = "select * from Usuario where username='".$username."'";
  $resultado = consulta($sql, $con);
  $perfil = json_encode($resultado);
  return $perfil;
}

function getSolicitudesByusuario($con, $idUsuario){
  $sql="  select SolicitudInformacion.id as idSolicitud, SolicitudInformacion.tipo as tiposolicitud, SolicitudInformacion.tipoGestion as tipoGestion, SolicitudInformacion.descripcion as descripcion, SolicitudInformacion.status as status, SolicitudInformacion.formaNotificacion as notificacion, SolicitudInformacion.fechaInicio as fechaInicio, SolicitudInformacion.fechaNotificacion as fechaNotificacion, SolicitudInformacion.fechaLimite as fechaLimite, SujetoObligado.nombre as sujetoObligado, TipoSujeto.nombre as tipoSujeto, Usuario.username as username from SolicitudInformacion, Usuario, SujetoObligado, TipoSujeto where SolicitudInformacion.idUsuario=".$idUsuario." and SolicitudInformacion.idUsuario=Usuario.id and SolicitudInformacion.idSujetoObligado=SujetoObligado.id and SujetoObligado.idTipoSujeto=TipoSujeto.id
  ";
  $resultado = consulta($sql, $con);
  $solicitud = json_encode($resultado);
  return $solicitud;
}

function getSolicitudByTipoSolicitud($con, $tipoSolicitud){
  $sql="select SolicitudInformacion.id as idSolicitud, SolicitudInformacion.tipo as tiposolicitud, 
  SolicitudInformacion.tipoGestion as tipoGestion, SolicitudInformacion.descripcion as descripcion, 
  SolicitudInformacion.status as status, SolicitudInformacion.formaNotificacion as notificacion, 
  SolicitudInformacion.fechaInicio as fechaInicio, SolicitudInformacion.fechaNotificacion as 
  fechaNotificacion, SolicitudInformacion.fechaLimite as fechaLimite, SujetoObligado.nombre as 
  sujetoObligado, TipoSujeto.nombre as tipoSujeto, Usuario.username as username from SolicitudInformacion, 
  Usuario, SujetoObligado, TipoSujeto where SolicitudInformacion.idUsuario=Usuario.id and 
  SolicitudInformacion.idSujetoObligado=SujetoObligado.id and SujetoObligado.idTipoSujeto=TipoSujeto.id 
  and SolicitudInformacion.tipo='".$tipoSolicitud."'";
  $resultado = consulta($sql, $con);
  $solicitud = json_encode($resultado);
  return $solicitud;
}
function getSolicitudByEstado($con, $estado){
  $sql="select * from SolicitudInformacion where status='".$estado."'";
  $resultado = consulta($sql, $con);
  $solicitud = json_encode($resultado);
  return $solicitud;
}

function consulta($sql, $con){
  $resultado = mysql_query($sql, $con);
  if (!$resultado){
    echo "La consulta SQL contiene errores.".mysql_error();
    exit();
  }else {
    while($obj = mysql_fetch_object($resultado)) {
      $arr[] = $obj;
    }
  }
  return $arr; 
}

?>