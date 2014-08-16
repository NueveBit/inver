<?php
/**
 * Este script incluye metadatos para aplicaciones que soporten el AppLinks
 * http://applinks.org/
 * 
 */
$solicitudId = $_GET["solicitudId"];
$db = require_once dirname(__FILE__) . "/db.php";
mysqli_set_charset($db, "utf8");

$sql = "select s.descripcion as descripcion 
	from SolicitudInformacion as s where s.id=?";
$stmt = $db->prepare($sql);
$stmt->bind_param("d", $solicitudId);
$stmt->execute();
$stmt->bind_result($descripcion);
$stmt->fetch();
?>
<html>
    <head>
        <title>Solicitud de información : INVER</title>
        <!-- applinks begin -->
        <meta property="al:android:url" content="inver://solicitud=<?= $solicitudId ?>"/>
        <meta property="al:android:app_name" content="inVer"/>
        <meta property="al:android:package" content="com.nuevebit.inver"/>
        <meta property="al:web:should_fallback" content="false" />
        <!-- applinks end -->
        
        <link rel="image_src" href="/img/inver.png" />
        <!-- fb og begin -->
        <meta property="og:description" content="<?= $descripcion; ?>" />
        <!-- fb og end -->
    </head>
    <body>
        Para ver esta solicitud, necesitas descargar la aplicación inVer en
        tu dispositivo móvil. <a href="http://www.nuevebit.com/inver.apk">Descárgalo aquí</a>.
    </body>
</html>
