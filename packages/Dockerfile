### Если есть fronted
# FROM node:22-alpine AS build-deps
# WORKDIR /usr/src/app
# COPY fronted/package.json fronted/yarn.lock fronted/index.html fronted/quasar.config.ts ./
# RUN yarn install
# COPY fronted ./
# ARG VUE_ENV....
# RUN yarn build


# FROM nginx
FROM nginx:1.29-alpine AS nginx
RUN apk add --no-cache nginx-module-njs
COPY ./nginx/oauth2.js /etc/nginx/conf.d/oauth2.js

### Если есть fronted
# COPY --from=build-deps /usr/src/app/dist/spa /var/www
# RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log