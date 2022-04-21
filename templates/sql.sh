#!/bin/bash

cat ~/nextcloud/config/config.php | grep dbpassword
mysql -u {{pac}}_{{user}} {{pac}}_{{user}} -p