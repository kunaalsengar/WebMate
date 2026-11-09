import Fastify from 'fastify';
import dotenv from 'dotenv';
import type { HealthStatus } from '@webmate/shared';

// Load local environment variables from .env
dotenv.config();

const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || '127.0.0.1';

/**
 * Fastify server instance.
 * Phase 0: Basic server initialization and health probe only.
 * Full AI routing, rate limiting, and SSE streaming will be added in Phase 3.
 */
const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Basic Health Check Endpoint
server.get('/health', async (): Promise<HealthStatus> => {
  return {
    status: 'ok',
    service: '@webmate/backend',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  };
});

async function start() {
  try {
    await server.listen({ port, host });
    server.log.info(`WebMate backend listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown handling
const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
for (const signal of signals) {
  process.on(signal, async () => {
    server.log.info(`Received ${signal}. Shutting down gracefully...`);
    await server.close();
    process.exit(0);
  });
}

// Only start when executed directly (not when imported in tests)
if (process.env.NODE_ENV !== 'test') {
  start();
}

export default server;
