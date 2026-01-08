import { api } from '../client.js';
import { API_ROUTES, User, CreateUserRequest, AppRole } from 'shared';

export const usersService = {
  getAll: () => {
    return api.get<User[]>(API_ROUTES.USERS);
  },

  create: (data: CreateUserRequest) => {
    return api.post<User>(API_ROUTES.USERS, data);
  },

  updateRole: (id: string, role: AppRole) => {
    return api.patch<void>(`${API_ROUTES.USERS}/${id}/role`, { role });
  },

  delete: (id: string) => {
    return api.delete<void>(`${API_ROUTES.USERS}/${id}`);
  },
};

