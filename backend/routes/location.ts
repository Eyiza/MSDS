import { FastifyInstance } from 'fastify';
import { 
    createLocation, getLocations, 
    getLocationById, updateLocation, 
    deleteLocation, searchLocations
 } from '../controller/location';

export default async function locationRoutes(fastify: FastifyInstance) {
    fastify.post('/location', createLocation);
    fastify.get('/location', getLocations);
    fastify.get('/location/:id', getLocationById);
    fastify.put('/location/:id', updateLocation);
    fastify.delete('/location/:id', deleteLocation);
    fastify.get('/location/search', searchLocations);
}