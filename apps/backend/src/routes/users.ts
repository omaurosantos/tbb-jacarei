import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { usersRepository } from '../repositories/usersRepository.js';
import { AppRole } from 'shared';

const router = Router();

const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  role: z.nativeEnum(AppRole),
});

const updateRoleSchema = z.object({
  role: z.nativeEnum(AppRole),
});

// GET /api/users - Admin only
router.get('/', authenticate, authorize(AppRole.ADMIN), async (req, res, next) => {
  try {
    const users = await usersRepository.findAll();
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      nome: user.profile?.nome || user.email,
      role: user.roles[0]?.role || null,
    }));
    res.json(formattedUsers);
  } catch (error) {
    next(error);
  }
});

// POST /api/users - Admin only
router.post('/', authenticate, authorize(AppRole.ADMIN), async (req: AuthRequest, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    
    // Verificar se email já existe
    const existingUser = await usersRepository.findByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const user = await usersRepository.create(data);
    res.status(201).json({
      id: user.id,
      email: user.email,
      nome: user.profile?.nome || user.email,
      role: user.roles[0]?.role || null,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:id/role - Admin only
router.patch('/:id/role', authenticate, authorize(AppRole.ADMIN), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    
    // Não permitir alterar próprio role
    if (id === req.userId) {
      return res.status(400).json({ error: 'Não é possível alterar seu próprio role' });
    }

    const data = updateRoleSchema.parse(req.body);
    await usersRepository.updateRole(id, data.role);
    res.json({ message: 'Role atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Admin only
router.delete('/:id', authenticate, authorize(AppRole.ADMIN), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    
    // Não permitir deletar a si mesmo
    if (id === req.userId) {
      return res.status(400).json({ error: 'Não é possível deletar seu próprio usuário' });
    }

    await usersRepository.delete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as usersRoutes };

