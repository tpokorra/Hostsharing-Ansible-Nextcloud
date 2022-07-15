#!/bin/bash

HOME="/home/pacs/{{pac}}/users/{{user}}"
HDD_HOME="/home/storage/{{pac}}/users/{{user}}"

if [ ! -d $HDD_HOME ]
then
  HDD_HOME=$HOME
fi

mkdir -p "$HDD_HOME/backup"
mysqldump --defaults-extra-file=$HOME/.my.cnf {{pac}}_{{user}} | gzip > $HDD_HOME/backup/mysql-`date +%Y%m%d%H`.sql.gz

# delete older backups
rm -f $HDD_HOME/backup/mysql-`date --date='5 days ago' +%Y%m%d`*.sql.gz
rm -f $HDD_HOME/backup/mysql-`date --date='6 days ago' +%Y%m%d`*.sql.gz
rm -f $HDD_HOME/backup/mysql-`date --date='7 days ago' +%Y%m%d`*.sql.gz