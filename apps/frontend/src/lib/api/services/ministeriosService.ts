import { api } from '../client.js';
import { API_ROUTES, Ministerio } from 'shared';

export const ministeriosService = {
  getAll: (ativo?: boolean) => {
    const params = ativo !== undefined ? `?ativo=${ativo}` : '';
    return api.get<Ministerio[]>(`${API_ROUTES.MINISTERIOS}${params}`);
  },

  getById: (id: string) => {
    return api.get<Ministerio>(`${API_ROUTES.MINISTERIOS}/${id}`);
  },

  create: (data: Omit<Ministerio, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lideres'> & { lideres?: Array<{ nome: string; ordem?: number }> }) => {
    return api.post<Ministerio>(API_ROUTES.MINISTERIOS, data);
  },

  update: (id: string, data: Partial<Omit<Ministerio, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lideres'> & { lideres?: Array<{ nome: string; ordem?: number }> }>) => {
    return api.put<Ministerio>(`${API_ROUTES.MINISTERIOS}/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete<void>(`${API_ROUTES.MINISTERIOS}/${id}`);
  },
};

