#! /bin/bash

if ! systemctl is-active --quiet docker.service && \
   ! systemctl is-active --quiet docker.socket; then
    echo -e "\033[1m[\033[31m XX \033[0;1m]\033[0m Docker not running"
    echo "        - starting docker.socket"
    systemctl start docker.socket
    echo -e "        - \033[1m[\033[32m OK \033[0;1m]\033[0m docker.socket started"


else
   echo -e "\033[1m[\033[32m OK \033[0;1m]\033[0m Docker is running"
fi

if [ "$#" -ge 1 ]; then
   if [ "$1" = "-b" ]; then
      echo "       Building"
      docker compose build
   else
      echo -e "\nScript starts docker compose with watch for fast reload"
      echo "  -b also do build"
   fi         
fi
echo "       Starting"
docker compose up --watch



