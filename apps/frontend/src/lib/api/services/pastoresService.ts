import { api } from '../client.js';
import { API_ROUTES, Pastor } from 'shared';

export const pastoresService = {
  getAll: (ativo?: boolean) => {
    const params = ativo !== undefined ? `?ativo=${ativo}` : '';
    return api.get<Pastor[]>(`${API_ROUTES.PASTORES}${params}`);
  },

  getById: (id: string) => {
    return api.get<Pastor>(`${API_ROUTES.PASTORES}/${id}`);
  },

  create: (data: Omit<Pastor, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    return api.post<Pastor>(API_ROUTES.PASTORES, data);
  },

  update: (id: string, data: Partial<Omit<Pastor, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>) => {
    return api.put<Pastor>(`${API_ROUTES.PASTORES}/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete<void>(`${API_ROUTES.PASTORES}/${id}`);
  },
};

