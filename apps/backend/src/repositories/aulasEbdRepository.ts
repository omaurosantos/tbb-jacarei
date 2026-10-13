import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';

export const aulasEbdRepository = {
  findAll: async (orderBy: 'asc' | 'desc' = 'desc') => {
    return prisma.aulaEbd.findMany({
      orderBy: { data: orderBy },
    });
  },

  findById: async (id: string) => {
    return prisma.aulaEbd.findUnique({
      where: { id },
    });
  },

  create: async (data: Prisma.AulaEbdCreateInput) => {
    return prisma.aulaEbd.create({ data });
  },

  update: async (id: string, data: Prisma.AulaEbdUpdateInput) => {
    return prisma.aulaEbd.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.aulaEbd.delete({
      where: { id },
    });
  },
};

