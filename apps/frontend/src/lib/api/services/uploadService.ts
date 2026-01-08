import { API_ROUTES } from 'shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Não autenticado');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}${API_ROUTES.UPLOAD}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao fazer upload' }));
      throw new Error(error.message || 'Erro ao fazer upload');
    }

    return response.json();
  },
};

