ARG BASE_IMAGE
FROM ${BASE_IMAGE}

ARG STRAPI_VERSION
RUN yarn global add @strapi/strapi@${STRAPI_VERSION}

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod 777 /usr/local/bin/docker-entrypoint.sh 
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["strapi", "develop"]