import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { authService } from '../services/authService.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Freia tentativas de adivinhar senha: 10 por IP a cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TooManyRequests',
    message: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
  },
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.login(validated);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const user = await authService.getCurrentUser(userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', authenticate, (req, res) => {
  // Com JWT stateless, o logout é feito no frontend removendo o token
  // Aqui apenas confirmamos
  res.json({ message: 'Logout realizado com sucesso' });
});

export { router as authRoutes };

