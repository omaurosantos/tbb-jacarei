import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppRole } from 'shared';

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

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
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
    // Deletar roles existentes e criar nova
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    return prisma.userRole.create({
      data: {
        userId,
        role,
      },
    });
  },

  delete: async (id: string) => {
    return prisma.user.delete({
      where: { id },
    });
  },
};

