#!/bin/zsh

cat mysql/init.sql | docker-compose exec -T mysql mysql --user=root --password=rootpassword