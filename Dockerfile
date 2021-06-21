FROM node:10.14.1-alpine

ARG NODE_ENV=production
ARG USER=node
ENV NODE_ENV=$NODE_ENV
ENV USER=$USER
RUN echo $NODE_ENV
RUN echo $USER

WORKDIR /usr/local/
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.2/wait /wait

COPY package*.json /usr/local/

RUN if [ "$NODE_ENV" = "production" ]; then npm install --production; else npm install; fi

COPY src /usr/local/src

RUN chmod +x /wait

EXPOSE 443
USER $USER

CMD  /wait && npm run start:prod
