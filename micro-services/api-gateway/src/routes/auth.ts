// routes/auth.ts
import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter';
import { forwardRequest } from '../utils/requestForwarder';

const router = Router();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4001';

// Auth routes (public, rate limited)
router.post('/login', authLimiter, (req, res) => {
  forwardRequest(req, res, USER_SERVICE_URL, '/login');
});

router.post('/register', authLimiter, (req, res) => {
  forwardRequest(req, res, USER_SERVICE_URL, '/api/auth/register');
});

router.post('/logout', authLimiter, (req, res) => {
  forwardRequest(req, res, USER_SERVICE_URL, '/api/auth/logout');
});

export default router;