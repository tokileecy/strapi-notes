ARG NODE_VERSION=16
FROM node:${NODE_VERSION}

RUN mkdir /srv/app && chown 1000:1000 -R /srv/app

WORKDIR /srv/app

VOLUME /srv/app

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod 777 /usr/local/bin/docker-entrypoint.sh 
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["yarn", "dev"]