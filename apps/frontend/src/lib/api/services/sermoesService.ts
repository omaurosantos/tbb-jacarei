import { api } from '../client.js';
import { API_ROUTES, Sermao } from 'shared';

export const sermoesService = {
  getAll: (order?: 'asc' | 'desc') => {
    const params = order ? `?order=${order}` : '';
    return api.get<Sermao[]>(`${API_ROUTES.SERMOES}${params}`);
  },

  getById: (id: string) => {
    return api.get<Sermao>(`${API_ROUTES.SERMOES}/${id}`);
  },

  create: (data: Omit<Sermao, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    return api.post<Sermao>(API_ROUTES.SERMOES, data);
  },

  update: (id: string, data: Partial<Omit<Sermao, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>) => {
    return api.put<Sermao>(`${API_ROUTES.SERMOES}/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete<void>(`${API_ROUTES.SERMOES}/${id}`);
  },
};

