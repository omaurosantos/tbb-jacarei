import { api } from '../client.js';
import { API_ROUTES, AulaEbd } from 'shared';

export const aulasEbdService = {
  getAll: (order?: 'asc' | 'desc') => {
    const params = order ? `?order=${order}` : '';
    return api.get<AulaEbd[]>(`${API_ROUTES.AULAS_EBD}${params}`);
  },

  getById: (id: string) => {
    return api.get<AulaEbd>(`${API_ROUTES.AULAS_EBD}/${id}`);
  },

  create: (data: Omit<AulaEbd, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    return api.post<AulaEbd>(API_ROUTES.AULAS_EBD, data);
  },

  update: (id: string, data: Partial<Omit<AulaEbd, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>) => {
    return api.put<AulaEbd>(`${API_ROUTES.AULAS_EBD}/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete<void>(`${API_ROUTES.AULAS_EBD}/${id}`);
  },
};

