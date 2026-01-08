import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { sermoesRepository } from '../repositories/sermoesRepository.js';
import { AppRole } from 'shared';

const router = Router();

const createSermaoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  pregador: z.string().min(1, 'Pregador é obrigatório'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  textoBase: z.string().optional().nullable(),
  resumo: z.string().optional().nullable(),
  linkYoutube: z.string().url('URL inválida').optional().nullable(),
  linkSpotify: z.string().url('URL inválida').optional().nullable(),
});

const updateSermaoSchema = createSermaoSchema.partial();

// GET /api/sermoes - Público
router.get('/', async (req, res, next) => {
  try {
    const orderBy = req.query.order === 'asc' ? 'asc' : 'desc';
    const sermoes = await sermoesRepository.findAll(orderBy);
    res.json(sermoes);
  } catch (error) {
    next(error);
  }
});

// GET /api/sermoes/:id - Público
router.get('/:id', async (req, res, next) => {
  try {
    const sermao = await sermoesRepository.findById(req.params.id);
    if (!sermao) {
      return res.status(404).json({ error: 'Sermão não encontrado' });
    }
    res.json(sermao);
  } catch (error) {
    next(error);
  }
});

// POST /api/sermoes - Admin/Editor
router.post('/', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = createSermaoSchema.parse(req.body);
    const sermao = await sermoesRepository.create({
      ...data,
      data: new Date(data.data),
      createdBy: req.userId,
    });
    res.status(201).json(sermao);
  } catch (error) {
    next(error);
  }
});

// PUT /api/sermoes/:id - Admin/Editor
router.put('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = updateSermaoSchema.parse(req.body);
    const sermao = await sermoesRepository.update(req.params.id, {
      ...data,
      ...(data.data && { data: new Date(data.data) }),
    });
    res.json(sermao);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/sermoes/:id - Admin/Editor
router.delete('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req, res, next) => {
  try {
    await sermoesRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as sermoesRoutes };

