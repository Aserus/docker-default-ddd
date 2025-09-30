import Fastify from 'fastify';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { authRoutes } from './auth.routes';
import { env } from '../../../config/env';
import URL from 'node:url';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(fp(async (instance) => {
    await instance.register(cors, { origin: true, credentials: true });
    await instance.register(sensible);
  }));

  app.register(authRoutes, { prefix: '/api/v1/auth' });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    return reply.code(500).send({ message: 'Internal Server Error' });
  });

  return app;
}

export async function start() {
  const app = buildApp();
  await app.listen({ port: env.port, host: '0.0.0.0' });
}

const isMain = (() => {
  try {
    return URL.fileURLToPath(import.meta.url) === process.argv[1];
  } catch {
    return false;
  }
})();

if (isMain) {
  start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}



