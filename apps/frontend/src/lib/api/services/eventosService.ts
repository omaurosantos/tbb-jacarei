import { api } from '../client.js';
import { API_ROUTES, Evento } from 'shared';

export const eventosService = {
  getAll: (order?: 'asc' | 'desc') => {
    const params = order ? `?order=${order}` : '';
    return api.get<Evento[]>(`${API_ROUTES.EVENTOS}${params}`);
  },

  getById: (id: string) => {
    return api.get<Evento>(`${API_ROUTES.EVENTOS}/${id}`);
  },

  create: (data: Omit<Evento, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    return api.post<Evento>(API_ROUTES.EVENTOS, data);
  },

  update: (id: string, data: Partial<Omit<Evento, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>) => {
    return api.put<Evento>(`${API_ROUTES.EVENTOS}/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete<void>(`${API_ROUTES.EVENTOS}/${id}`);
  },
};

