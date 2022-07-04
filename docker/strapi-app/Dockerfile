ARG NODE_VERSION=16
FROM node:${NODE_VERSION}

ARG STRAPI_VERSION
RUN yarn global add @strapi/strapi@${STRAPI_VERSION}

COPY --chown=node:node apps/strapi-app /srv/app
COPY --chown=node:node docker/strapi-app/docker-entrypoint.sh /usr/local/bin/

WORKDIR /srv/app

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["strapi", "develop"]