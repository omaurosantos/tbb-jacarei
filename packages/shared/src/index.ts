// Enums
export enum AppRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
}

export enum EbdClasse {
  HOMENS = 'Homens',
  BELAS = 'Belas',
  ADOLESCENTES = 'Adolescentes',
}

// Types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// DTOs - Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
    role: AppRole;
  };
}

export interface CreateUserRequest {
  email: string;
  password: string;
  nome: string;
  role: AppRole;
}

export interface UpdateUserRoleRequest {
  role: AppRole;
}

// Entity types (baseado no Prisma)
export interface Sermao {
  id: string;
  titulo: string;
  pregador: string;
  data: string; // ISO date string
  textoBase: string | null;
  resumo: string | null;
  linkYoutube: string | null;
  linkSpotify: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AulaEbd {
  id: string;
  titulo: string;
  professor: string;
  data: string; // ISO date string
  classe: EbdClasse;
  textoBase: string | null;
  resumo: string | null;
  linkPdf: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Evento {
  id: string;
  nome: string;
  data: string; // ISO date string
  horario: string | null;
  local: string;
  descricao: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pastor {
  id: string;
  nome: string;
  funcao: string;
  bio: string | null;
  fotoUrl: string | null;
  ordem: number;
  ativo: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ministerio {
  id: string;
  nome: string;
  descricao: string;
  descricaoCompleta: string | null;
  icone: string;
  fotoUrl: string | null;
  ordem: number;
  ativo: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  lideres?: MinisterioLider[];
}

export interface MinisterioLider {
  id: string;
  ministerioId: string;
  nome: string;
  ordem: number;
}

export interface ConteudoPagina {
  id: string;
  pagina: string;
  titulo: string;
  subtitulo: string | null;
  conteudo: string;
  conteudoExtra: Json | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface User {
  id: string;
  email: string;
  nome: string;
  role: AppRole | null;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Constants
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  SERMOES: '/api/sermoes',
  AULAS_EBD: '/api/aulas-ebd',
  EVENTOS: '/api/eventos',
  PASTORES: '/api/pastores',
  MINISTERIOS: '/api/ministerios',
  CONTEUDOS: '/api/conteudos',
  USERS: '/api/users',
  UPLOAD: '/api/upload',
} as const;

