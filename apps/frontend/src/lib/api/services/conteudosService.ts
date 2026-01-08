import { api } from '../client.js';
import { API_ROUTES, ConteudoPagina } from 'shared';

export const conteudosService = {
  getAll: () => {
    return api.get<ConteudoPagina[]>(API_ROUTES.CONTEUDOS);
  },

  getByPagina: (pagina: string) => {
    return api.get<ConteudoPagina>(`${API_ROUTES.CONTEUDOS}/${pagina}`);
  },

  update: (pagina: string, data: Partial<Omit<ConteudoPagina, 'id' | 'pagina' | 'updatedAt' | 'updatedBy'>>) => {
    return api.put<ConteudoPagina>(`${API_ROUTES.CONTEUDOS}/${pagina}`, data);
  },
};

