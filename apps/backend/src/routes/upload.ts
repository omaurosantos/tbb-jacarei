import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, authorize } from '../middleware/auth.js';
import { env } from '../config/env.js';
import { AppRole } from 'shared';
import { promises as fs } from 'fs';

const router = Router();

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
    const ext = path.extname(file.originalname);
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
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas.'));
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
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
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

