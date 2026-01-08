import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';

export const pastoresRepository = {
  findAll: async (ativo?: boolean) => {
    return prisma.pastor.findMany({
      where: ativo !== undefined ? { ativo } : undefined,
      orderBy: { ordem: 'asc' },
    });
  },

  findById: async (id: string) => {
    return prisma.pastor.findUnique({
      where: { id },
    });
  },

  create: async (data: Prisma.PastorCreateInput) => {
    return prisma.pastor.create({ data });
  },

  update: async (id: string, data: Prisma.PastorUpdateInput) => {
    return prisma.pastor.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.pastor.delete({
      where: { id },
    });
  },
};

