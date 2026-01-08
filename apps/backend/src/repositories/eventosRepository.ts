import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';

export const eventosRepository = {
  findAll: async (orderBy: 'asc' | 'desc' = 'desc') => {
    return prisma.evento.findMany({
      orderBy: { data: orderBy },
    });
  },

  findById: async (id: string) => {
    return prisma.evento.findUnique({
      where: { id },
    });
  },

  create: async (data: Prisma.EventoCreateInput) => {
    return prisma.evento.create({ data });
  },

  update: async (id: string, data: Prisma.EventoUpdateInput) => {
    return prisma.evento.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.evento.delete({
      where: { id },
    });
  },
};

