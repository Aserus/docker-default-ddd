FROM oven/bun:1.2.4-alpine

WORKDIR /usr/src/app

COPY package.json bun.lockb tsconfig.json ./
RUN bun install
COPY . ./
RUN bun run build

ENV FASTIFY_AUTOLOAD_TYPESCRIPT 1

EXPOSE 3000


CMD [ "bun","run", "serve" ]