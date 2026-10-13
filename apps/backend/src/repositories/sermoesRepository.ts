import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';

export const sermoesRepository = {
  findAll: async (orderBy: 'asc' | 'desc' = 'desc') => {
    return prisma.sermao.findMany({
      orderBy: { data: orderBy },
    });
  },

  findById: async (id: string) => {
    return prisma.sermao.findUnique({
      where: { id },
    });
  },

  create: async (data: Prisma.SermaoCreateInput) => {
    return prisma.sermao.create({ data });
  },

  update: async (id: string, data: Prisma.SermaoUpdateInput) => {
    return prisma.sermao.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.sermao.delete({
      where: { id },
    });
  },
};

