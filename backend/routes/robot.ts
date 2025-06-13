import { FastifyInstance } from 'fastify';
import { createRobot } from '../controller/robot';

export default async function robotRoutes(fastify: FastifyInstance) {
  // Route to create a new robot
  fastify.post('/robot', createRobot);

}