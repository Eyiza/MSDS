import { FastifyInstance } from 'fastify';
import {
    createRecipient, getRecipientById, 
    updateRecipient, searchRecipients,
    checkOutRecipient
} from '../controller/recipient';

export default async function recipientRoutes (fastify: FastifyInstance) {
    fastify.post('/recipients', createRecipient);
    fastify.get('/recipients/:id', getRecipientById);
    fastify.put('/recipients/:id', updateRecipient);
    fastify.get('/recipients/search', searchRecipients);
    fastify.post('/recipients/:id/checkout', checkOutRecipient);
};

