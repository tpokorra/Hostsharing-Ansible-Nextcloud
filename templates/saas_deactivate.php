<?php

include "/home/pacs/{{pac}}/users/{{user}}/nextcloud/config/config.php";

function Get($index, $defaultValue) {
    return isset($_GET[$index]) ? $_GET[$index] : $defaultValue;
}

function is_run_from_cli() {
    if( defined('STDIN') )
    {
        return true;
    }
    return false;
}

if (!is_run_from_cli()) {
    # check SaasActivationPassword
    if (Get('SaasActivationPassword', 'invalid') != '{{SaasActivationPassword}}') {
        echo '{"success": false, "msg": "invalid SaasActivationPassword"}';
        exit(1);
    }
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname='.$CONFIG['dbname'], $CONFIG['dbuser'], $CONFIG['dbpassword']);
    # retrieve all users
    $stmt = $pdo->query("SELECT uid from ".$CONFIG['dbtableprefix']."users");
    while ($row = $stmt->fetch()) {
        # deactivate the user
        $stmtUpdate = $pdo->prepare("INSERT INTO ".$CONFIG['dbtableprefix']."preferences (userid, appid, configkey, configvalue) ".
            "VALUES(?, 'core', 'enabled', 'false') ON DUPLICATE KEY UPDATE configvalue='false'");
        $stmtUpdate->execute([$row['uid']]);
    }
}
catch (Exception $e) {
    // echo 'Exception caught: ',  $e->getMessage(), "\n";
    echo '{"success": false, "msg": "error happened"}';
    exit(1);
}

echo '{"success": true}';

?>