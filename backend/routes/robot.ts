import { FastifyInstance } from 'fastify';
import { createRobot, getRobots, 
  getRobotById, updateRobot,
  deactivateRobot, resetRobot,
  taskCreationData, recipientCreationData,
  startQueuedTasks, getUserDashboardData,
} from '../controller/robot';

export default async function robotRoutes(fastify: FastifyInstance) {
  fastify.post('/robot', createRobot);
  fastify.get('/robot', getRobots);
  fastify.get('/robot/:id', getRobotById);
  fastify.put('/robot/:id', updateRobot);
  fastify.patch('/robot/:id/deactivate', deactivateRobot);
  fastify.patch('/robot/:id/reset', resetRobot);
  fastify.get('/robot/:id/task-creation', taskCreationData);
  fastify.get('/robot/:id/recipient-creation', recipientCreationData);
  // fastify.post('/robot/:id/start', startQueuedTasks);
  fastify.get('/robot/:id/dashboard', getUserDashboardData);
}