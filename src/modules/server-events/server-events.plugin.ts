import type { FastifyPluginAsync, FastifyReply } from 'fastify';

export type ServerEvent = {
  event: string;
  data: unknown;
};

export type ServerEventsClients = {
  add: (id: string, reply: FastifyReply) => void;
  remove: (id: string) => void;
  send: (id: string, event: ServerEvent) => void;
  sendAll: (event: ServerEvent) => void;
};

declare module 'fastify' {
  interface FastifyInstance {
    sseClients: ServerEventsClients;
  }
}

export const serverEventsPlugin: FastifyPluginAsync = async (server) => {
  const clients = new Map<string, FastifyReply>();
  const sseClients: ServerEventsClients = {
    add: (id: string, reply: FastifyReply) => {
      clients.set(id, reply);
    },
    remove: (id: string) => {
      clients.delete(id);
    },
    send: (id: string, event: ServerEvent) => {
      const client = clients.get(id);
      if (client) {
        client.sse.send(event);
      }
    },
    sendAll: (event: ServerEvent) => {
      clients.forEach((reply) => {
        reply.sse.send(event);
      });
    },
  };
  server.decorate('sseClients', sseClients);
  server.addHook('onClose', () => clients.clear());
};

export default serverEventsPlugin;
