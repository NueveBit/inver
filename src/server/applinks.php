<?php
/**
 * Este script incluye metadatos para aplicaciones que soporten el AppLinks
 * http://applinks.org/
 * 
 */
$solicitudId = $_GET["solicitudId"];
?>
<html>
    <head>
        <title>Solicitud</title>
        <meta property="al:android:url" content="inver://solicitud=<?=$solicitudId?>"/>
        <meta property="al:android:app_name" content="inVer"/>
        <meta property="al:android:package" content="com.nuevebit.inver"/>
        <meta property="al:web:should_fallback" content="false" />
    </head>
    <body>
        Para ver esta solicitud, necesitas descargar la aplicación inVer en
        tu dispositivo móvil. Descárgalo.
    </body>
</html>
