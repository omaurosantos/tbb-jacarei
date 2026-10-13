import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import multer from 'multer';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: ApiError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Dados inválidos',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Registro inexistente em update/delete
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).json({
      error: 'NotFound',
      message: 'Registro não encontrado',
    });
  }

  // Erros do upload (tamanho, campos)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'BadRequest',
      message: err.code === 'LIMIT_FILE_SIZE' ? 'Arquivo maior que o permitido' : err.message,
    });
  }

  // API errors with status code
  const statusCode = (err as ApiError).statusCode;
  if (typeof statusCode === 'number') {
    return res.status(statusCode).json({
      error: err.name || 'Error',
      message: err.message,
    });
  }

  // Default error
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro interno',
  });
};

