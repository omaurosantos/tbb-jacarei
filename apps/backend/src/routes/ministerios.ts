import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { ministeriosRepository } from '../repositories/ministeriosRepository.js';
import { AppRole } from 'shared';

const router = Router();

const liderSchema = z.object({
  nome: z.string().min(1),
  ordem: z.number().int().default(0),
});

const createMinisterioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  descricaoCompleta: z.string().optional().nullable(),
  icone: z.string().default('Users'),
  fotoUrl: z.string().url('URL inválida').optional().nullable(),
  ordem: z.number().int().default(0),
  ativo: z.boolean().default(true),
  lideres: z.array(liderSchema).optional(),
});

const updateMinisterioSchema = createMinisterioSchema.partial();

router.get('/', async (req, res, next) => {
  try {
    const ativo = req.query.ativo === 'true' ? true : req.query.ativo === 'false' ? false : undefined;
    const ministerios = await ministeriosRepository.findAll(ativo);
    res.json(ministerios);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const ministerio = await ministeriosRepository.findById(req.params.id);
    if (!ministerio) {
      return res.status(404).json({ error: 'Ministério não encontrado' });
    }
    res.json(ministerio);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = createMinisterioSchema.parse(req.body);
    const ministerio = await ministeriosRepository.create({
      ...data,
      lideres: data.lideres ? {
        create: data.lideres,
      } : undefined,
      createdBy: req.userId,
    });
    res.status(201).json(ministerio);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = updateMinisterioSchema.parse(req.body);
    
    // Se lideres foram enviados, atualizar
    if (data.lideres) {
      // Deletar lideres existentes
      const ministerio = await ministeriosRepository.findById(req.params.id);
      if (ministerio?.lideres) {
        // Prisma vai deletar automaticamente devido ao onDelete: Cascade
      }
    }

    const ministerio = await ministeriosRepository.update(req.params.id, {
      ...data,
      ...(data.lideres && {
        lideres: {
          deleteMany: {},
          create: data.lideres,
        },
      }),
    });
    res.json(ministerio);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req, res, next) => {
  try {
    await ministeriosRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as ministeriosRoutes };

