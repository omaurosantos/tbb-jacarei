import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';

export const conteudosRepository = {
  findByPagina: async (pagina: string) => {
    return prisma.conteudoPagina.findUnique({
      where: { pagina },
    });
  },

  findAll: async () => {
    return prisma.conteudoPagina.findMany();
  },

  upsert: async (pagina: string, data: Prisma.ConteudoPaginaCreateInput) => {
    return prisma.conteudoPagina.upsert({
      where: { pagina },
      update: data,
      create: { ...data, pagina },
    });
  },
};

