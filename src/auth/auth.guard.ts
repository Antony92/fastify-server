import { onRequestAsyncHookHandler } from 'fastify';

export const secured: onRequestAsyncHookHandler = async (request, reply) => {
    console.log('secured')
}