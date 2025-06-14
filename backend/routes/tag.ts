import { FastifyInstance } from 'fastify';
import { 
    createTag, getTagById, 
    updateTag, searchTags 
} from '../controller/tag';

export default async function tagRoutes(fastify: FastifyInstance) {
    fastify.post('/tag', createTag);
    fastify.get('/tag/:id', getTagById);
    fastify.put('/tag/:id', updateTag);
    fastify.get('/tag/search', searchTags);
}