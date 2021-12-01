#!/bin/bash

cd "/var/www/cryptopinion/website/" || exit

git pull

cd ..

docker kill website

docker rm website

docker image build -t website -f website/Dockerfile website

docker run -d -p 80:80 -p 443:443 --name website website
