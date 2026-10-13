import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middleware/auth.js';
import { env } from '../config/env.js';
import { AppRole } from 'shared';
import { AppError } from '../utils/AppError.js';
import { promises as fs } from 'fs';

const router = Router();

// Tipos de imagem aceitos e a extensão usada ao salvar
const EXTENSOES_PERMITIDAS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

// Configurar storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(env.uploadDir, { recursive: true });
      cb(null, env.uploadDir);
    } catch (error) {
      cb(error as Error, env.uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // A extensão vem do tipo validado, nunca do nome enviado pelo cliente
    // (evita, por exemplo, um "foto.html" servido como página pelo express.static)
    const ext = Object.hasOwn(EXTENSOES_PERMITIDAS, file.mimetype) ? EXTENSOES_PERMITIDAS[file.mimetype] : undefined;
    if (!ext) {
      return cb(new AppError('Tipo de arquivo não permitido. Apenas imagens são aceitas.', 400, 'BadRequest'), '');
    }
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: env.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (Object.hasOwn(EXTENSOES_PERMITIDAS, file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Tipo de arquivo não permitido. Apenas imagens são aceitas.', 400, 'BadRequest'));
    }
  },
});

// POST /api/upload - Admin/Editor
router.post(
  '/',
  authenticate,
  authorize(AppRole.ADMIN, AppRole.EDITOR),
  upload.single('file'),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'BadRequest', message: 'Nenhum arquivo enviado' });
    }

    // Retornar URL do arquivo
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  }
);

export { router as uploadRoutes };

