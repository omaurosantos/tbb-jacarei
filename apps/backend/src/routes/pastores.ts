import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { pastoresRepository } from '../repositories/pastoresRepository.js';
import { AppRole } from 'shared';

const router = Router();

const createPastorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  funcao: z.string().min(1, 'Função é obrigatória'),
  bio: z.string().optional().nullable(),
  fotoUrl: z.string().url('URL inválida').optional().nullable(),
  ordem: z.number().int().default(0),
  ativo: z.boolean().default(true),
});

const updatePastorSchema = createPastorSchema.partial();

router.get('/', async (req, res, next) => {
  try {
    const ativo = req.query.ativo === 'true' ? true : req.query.ativo === 'false' ? false : undefined;
    const pastores = await pastoresRepository.findAll(ativo);
    res.json(pastores);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const pastor = await pastoresRepository.findById(req.params.id);
    if (!pastor) {
      return res.status(404).json({ error: 'Pastor não encontrado' });
    }
    res.json(pastor);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = createPastorSchema.parse(req.body);
    const pastor = await pastoresRepository.create({
      ...data,
      createdBy: req.userId,
    });
    res.status(201).json(pastor);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = updatePastorSchema.parse(req.body);
    const pastor = await pastoresRepository.update(req.params.id, {
      ...data,
    });
    res.json(pastor);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req, res, next) => {
  try {
    await pastoresRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as pastoresRoutes };

