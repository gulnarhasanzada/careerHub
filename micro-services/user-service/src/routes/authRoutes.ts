import Router from 'express';
import { healthCheck, login, register } from '../controllers/authController';

const authRoutes = Router();

authRoutes.get('/health', healthCheck);
authRoutes.post('/login', login);
authRoutes.post('/register', register);

export default authRoutes;
