#!/bin/sh

version="0.0.1"

docker_repo="ghcr.io/kevin0120/node-red/chartjs-customize-byd"

docker build -t ${docker_repo}:${version} .
#docker build -t ${docker_repo}:latest .

docker login ghcr.io -u kevin0120 -p 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
docker push ${docker_repo}:${version}
#docker push ${docker_repo}:latest
