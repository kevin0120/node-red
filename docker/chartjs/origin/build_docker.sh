#!/bin/sh

version="0.0.6"

docker_repo="ghcr.io/kevin0120/node-red/chartjs-origin"

docker build -t ${docker_repo}:${version} .
#docker build -t ${docker_repo}:latest .

#docker login ghcr.io -u kevin0120 -p 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
#docker push ${docker_repo}:${version}
#docker push ${docker_repo}:latest
