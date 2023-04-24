@echo off
rem change server in config file into "mongo"
docker build -t bibliothek ../
docker-compose up
