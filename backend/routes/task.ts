import { FastifyInstance } from 'fastify';
import {
    createTask, getTaskById, 
    queueTasks, dequeueTask,
    deleteTask, searchTasks, 
    updateTask 
} from '../controller/task';

export default async function taskRoutes(fastify: FastifyInstance) {
    fastify.post('/task', createTask);
    fastify.get('/task/:id', getTaskById);
    fastify.post('/task/queue', queueTasks);
    fastify.put('/task/:id/dequeue', dequeueTask);
    fastify.delete('/task/:id', deleteTask);
    fastify.get('/task/search', searchTasks);
    fastify.put('/task/:id', updateTask);

}