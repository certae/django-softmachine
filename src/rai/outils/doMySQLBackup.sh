#!/bin/bash

now="$(date +'%d-%m-%y')"
mysqldump -u manager -ppassword prototypeur > "mysql.bak-"$now".sql"
mysqldump -u manager -ppassword rai > "mysql-rai.bak-"$now".sql"
