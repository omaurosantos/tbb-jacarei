import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { authService } from '../services/authService.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

router.post('/login', async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.login(validated);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
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

