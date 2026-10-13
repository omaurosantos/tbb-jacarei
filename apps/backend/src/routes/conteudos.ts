import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { conteudosRepository } from '../repositories/conteudosRepository.js';
import { AppRole } from 'shared';

const router = Router();

const updateConteudoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  subtitulo: z.string().optional().nullable(),
  conteudo: z.string().min(1, 'Conteúdo é obrigatório'),
  conteudoExtra: z.any().optional().nullable(),
});

router.get('/', async (req, res, next) => {
  try {
    const conteudos = await conteudosRepository.findAll();
    res.json(conteudos);
  } catch (error) {
    next(error);
  }
});

router.get('/:pagina', async (req, res, next) => {
  try {
    const conteudo = await conteudosRepository.findByPagina(req.params.pagina);
    if (!conteudo) {
      return res.status(404).json({ error: 'Conteúdo não encontrado' });
    }
    res.json(conteudo);
  } catch (error) {
    next(error);
  }
});

router.put('/:pagina', authenticate, authorize(AppRole.ADMIN, AppRole.EDITOR), async (req: AuthRequest, res, next) => {
  try {
    const data = updateConteudoSchema.parse(req.body);
    const conteudo = await conteudosRepository.upsert(req.params.pagina, {
      ...data,
      updatedBy: req.userId,
    });
    res.json(conteudo);
  } catch (error) {
    next(error);
  }
});

export { router as conteudosRoutes };

