import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { aulasEbdRepository } from '../repositories/aulasEbdRepository.js';
import { AppRole, EbdClasse } from 'shared';

const router = Router();

const createAulaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  professor: z.string().min(1, 'Professor é obrigatório'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  classe: z.nativeEnum(EbdClasse),
  textoBase: z.string().optional().nullable(),
  resumo: z.string().optional().nullable(),
  linkPdf: z.string().url('URL inválida').optional().nullable(),
});

const updateAulaSchema = createAulaSchema.partial();

router.get('/', async (req, res, next) => {
  try {
    const orderBy = req.query.order === 'asc' ? 'asc' : 'desc';
    const aulas = await aulasEbdRepository.findAll(orderBy);
    res.json(aulas);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const aula = await aulasEbdRepository.findById(req.params.id);
    if (!aula) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    res.json(aula);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = createAulaSchema.parse(req.body);
    const aula = await aulasEbdRepository.create({
      ...data,
      data: new Date(data.data),
      createdBy: req.userId,
    });
    res.status(201).json(aula);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = updateAulaSchema.parse(req.body);
    const aula = await aulasEbdRepository.update(req.params.id, {
      ...data,
      ...(data.data && { data: new Date(data.data) }),
    });
    res.json(aula);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req, res, next) => {
  try {
    await aulasEbdRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as aulasEbdRoutes };

