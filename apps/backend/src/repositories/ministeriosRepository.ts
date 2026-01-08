import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';

export const ministeriosRepository = {
  findAll: async (ativo?: boolean) => {
    return prisma.ministerio.findMany({
      where: ativo !== undefined ? { ativo } : undefined,
      include: { lideres: { orderBy: { ordem: 'asc' } } },
      orderBy: { ordem: 'asc' },
    });
  },

  findById: async (id: string) => {
    return prisma.ministerio.findUnique({
      where: { id },
      include: { lideres: { orderBy: { ordem: 'asc' } } },
    });
  },

  create: async (data: Prisma.MinisterioCreateInput) => {
    return prisma.ministerio.create({
      data,
      include: { lideres: true },
    });
  },

  update: async (id: string, data: Prisma.MinisterioUpdateInput) => {
    return prisma.ministerio.update({
      where: { id },
      data,
      include: { lideres: { orderBy: { ordem: 'asc' } } },
    });
  },

  delete: async (id: string) => {
    return prisma.ministerio.delete({
      where: { id },
    });
  },
};

