import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/database.js';
import { AppRole } from 'shared';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: AppRole;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token não fornecido',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
      req.userId = decoded.userId;

      // Buscar role do usuário
      const userRole = await prisma.userRole.findFirst({
        where: { userId: decoded.userId },
        select: { role: true },
      });

      req.userRole = userRole?.role as AppRole | undefined;

      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token inválido ou expirado',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: AppRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuário não autenticado',
      });
    }

    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Acesso negado. Permissões insuficientes.',
      });
    }

    next();
  };
};

