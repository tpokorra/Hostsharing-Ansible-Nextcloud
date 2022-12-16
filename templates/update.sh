#!/bin/bash

export HOME=/home/pacs/{{pac}}/users/{{user}}
cd $HOME/nextcloud

sed -i "s#'updater.server.url' => '.*'#'updater.server.url' => '{{updater_server_url}}'#g" $HOME/nextcloud/config/config.php

php occ maintenance:mode --on

php updater/updater.phar -vv --no-backup --no-interaction

php occ db:add-missing-primary-keys --no-interaction
php occ db:add-missing-columns --no-interaction
php occ db:add-missing-indices --no-interaction
php occ db:convert-filecache-bigint --no-interaction

php occ app:update --all -n --no-ansi

php occ maintenance:mode --off
