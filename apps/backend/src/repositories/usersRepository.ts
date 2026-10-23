import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppRole } from 'shared';
import { AppError } from '../utils/AppError.js';

export const usersRepository = {
  findAll: async () => {
    return prisma.user.findMany({
      include: {
        profile: true,
        roles: {
          select: { role: true },
          orderBy: { role: 'asc' },
          take: 1,
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        roles: true,
      },
    });
  },

  // Sem diferenciar maiúsculas: impede cadastrar "Ana@x.com" se já existe "ana@x.com"
  findByEmail: async (email: string) => {
    return prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      include: {
        profile: true,
        roles: true,
      },
    });
  },

  create: async (data: {
    email: string;
    password: string;
    nome: string;
    role: AppRole;
  }) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        profile: {
          create: {
            nome: data.nome,
            email: data.email,
          },
        },
        roles: {
          create: {
            role: data.role,
          },
        },
      },
      include: {
        profile: true,
        roles: true,
      },
    });
  },

  updateRole: async (userId: string, role: AppRole) => {
    // Numa transação: troca o papel e garante que sobre ao menos um admin
    return prisma.$transaction(async (tx) => {
      const eraAdmin = await tx.userRole.findFirst({ where: { userId, role: AppRole.ADMIN } });

      await tx.userRole.deleteMany({ where: { userId } });
      const criado = await tx.userRole.create({ data: { userId, role } });

      if (eraAdmin && role !== AppRole.ADMIN) {
        const restantes = await tx.userRole.count({ where: { role: AppRole.ADMIN } });
        if (restantes === 0) {
          throw new AppError('Não é possível remover o último administrador', 400, 'BadRequest');
        }
      }
      return criado;
    });
  },

  delete: async (id: string) => {
    return prisma.$transaction(async (tx) => {
      const eraAdmin = await tx.userRole.findFirst({ where: { userId: id, role: AppRole.ADMIN } });

      const removido = await tx.user.delete({ where: { id } });

      if (eraAdmin) {
        const restantes = await tx.userRole.count({ where: { role: AppRole.ADMIN } });
        if (restantes === 0) {
          throw new AppError('Não é possível remover o último administrador', 400, 'BadRequest');
        }
      }
      return removido;
    });
  },
};
