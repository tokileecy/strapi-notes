#!/bin/sh

find . | grep /node_modules$ | grep -v /node_modules/ | xargs rm -fR
rm -rf ./apps/strapi-app/.cache
rm -rf ./apps/strapi-app/build