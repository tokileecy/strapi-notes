ARG NODE_VERSION=16
FROM node:${NODE_VERSION}

COPY --chown=node:node apps/next-app /srv/app
COPY --chown=node:node docker/next-app/docker-entrypoint.sh /usr/local/bin/

WORKDIR /srv/app

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["strapi", "develop"]