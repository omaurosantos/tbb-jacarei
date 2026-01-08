import bcrypt from 'bcrypt';
import { prisma } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { AppRole } from 'shared';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
    role: AppRole;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password } = credentials;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        roles: {
          select: { role: true },
          orderBy: { role: 'asc' }, // admin vem antes de editor
          take: 1,
        },
      },
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    // Buscar role (admin tem prioridade)
    const role = (user.roles[0]?.role as AppRole) || AppRole.EDITOR;

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.profile?.nome || user.email,
        role,
      },
    };
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        roles: {
          select: { role: true },
          orderBy: { role: 'asc' },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const role = (user.roles[0]?.role as AppRole) || AppRole.EDITOR;

    return {
      id: user.id,
      email: user.email,
      nome: user.profile?.nome || user.email,
      role,
    };
  },
};

