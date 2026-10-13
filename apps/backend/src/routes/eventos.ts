import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { eventosRepository } from '../repositories/eventosRepository.js';
import { AppRole } from 'shared';

const router = Router();

const createEventoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  horario: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido').optional().nullable(),
  local: z.string().min(1, 'Local é obrigatório'),
  descricao: z.string().optional().nullable(),
});

const updateEventoSchema = createEventoSchema.partial();

router.get('/', async (req, res, next) => {
  try {
    const orderBy = req.query.order === 'asc' ? 'asc' : 'desc';
    const eventos = await eventosRepository.findAll(orderBy);
    res.json(eventos);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const evento = await eventosRepository.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(evento);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = createEventoSchema.parse(req.body);
    const evento = await eventosRepository.create({
      ...data,
      data: new Date(data.data),
      createdBy: req.userId,
    });
    res.status(201).json(evento);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = updateEventoSchema.parse(req.body);
    const evento = await eventosRepository.update(req.params.id, {
      ...data,
      ...(data.data && { data: new Date(data.data) }),
    });
    res.json(evento);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req, res, next) => {
  try {
    await eventosRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as eventosRoutes };

