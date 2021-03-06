#!/bin/sh

BASEDIR=$(dirname $(realpath "$0"))
ROOT_DIR=$(cd $BASEDIR; cd ..; pwd)

docker build -t strapi-notes-strapi-app -f docker/strapi-app/Dockerfile .
docker build -t strapi-notes-next-app -f docker/next-app/Dockerfile .