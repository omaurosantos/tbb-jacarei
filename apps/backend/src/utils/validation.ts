import { z } from 'zod';

// Foto pode ser um arquivo enviado pelo upload (/uploads/<nome>) ou uma URL externa http(s)
export const fotoUrlSchema = z
  .string()
  .max(2048, 'URL muito longa')
  .refine(
    (value) => (/^\/uploads\/[\w.-]+$/.test(value) && !value.includes('..')) || /^https?:\/\/\S+$/i.test(value),
    'URL inválida'
  )
  .optional()
  .nullable();
