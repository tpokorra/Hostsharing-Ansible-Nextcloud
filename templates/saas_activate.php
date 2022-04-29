<?php

include "/home/pacs/{{pac}}/users/{{user}}/nextcloud/config/config.php";

function Get($index, $defaultValue) {
  return isset($_GET[$index]) ? $_GET[$index] : $defaultValue;
}

# check SaasActivationPassword
if (Get('SaasActivationPassword', 'invalid') != '{{SaasActivationPassword}}') {
  echo '{"success": false, "msg": "invalid SaasActivationPassword"}';
  exit(1);
}

$USER_EMAIL_ADDRESS = Get('UserEmailAddress', '');
if (empty($USER_EMAIL_ADDRESS)) {
  echo '{"success": false, "msg": "missing email address"}';
  exit(1);
}

try {
    # enable the administrator user
    # could run alternatively: php occ user:enable {{adminuser}}
    $pdo = new PDO('mysql:host=localhost;dbname='.$CONFIG['dbname'], $CONFIG['dbuser'], $CONFIG['dbpassword']);
    $stmtUpdate = $pdo->prepare("INSERT INTO ".$CONFIG['dbtableprefix']."preferences (userid, appid, configkey, configvalue) ".
        "VALUES(?, 'core', 'enabled', 'true') ON DUPLICATE KEY UPDATE configvalue='true'");
    $stmtUpdate->execute(['{{adminuser}}']);

    # set the email address of the administrator user
    $stmtUpdate = $pdo->prepare("INSERT INTO ".$CONFIG['dbtableprefix']."preferences (userid, appid, configkey, configvalue) ".
        "VALUES(?, 'settings', 'email', ?) ON DUPLICATE KEY UPDATE configvalue=?");
    $stmtUpdate->execute(['{{adminuser}}', $USER_EMAIL_ADDRESS, $USER_EMAIL_ADDRESS]);
}
catch (Exception $e) {
    // echo 'Exception caught: ',  $e->getMessage(), "\n";
    echo '{"success": false, "msg": "error happened"}';
    exit(1);
}

echo '{"success": true}';
?>
