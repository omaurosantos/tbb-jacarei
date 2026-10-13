import { z } from 'zod';

// Foto pode ser um arquivo enviado pelo upload (/uploads/...) ou uma URL externa completa
export const fotoUrlSchema = z
  .string()
  .refine((value) => value.startsWith('/uploads/') || /^https?:\/\/\S+$/i.test(value), 'URL inválida')
  .optional()
  .nullable();
