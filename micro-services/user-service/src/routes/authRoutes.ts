import Router from 'express';
import { healthCheck, login, refreshToken, register } from '../controllers/authController';

const authRoutes = Router();

authRoutes.get('/health', healthCheck);
authRoutes.get('/refresh', refreshToken)
authRoutes.post('/login', login);
authRoutes.post('/register', register);

export default authRoutes;
