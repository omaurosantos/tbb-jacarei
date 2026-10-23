import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Origens liberadas no CORS; aceita várias separadas por vírgula
  frontendUrls: (process.env.FRONTEND_URL || 'http://localhost:8080')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  uploadDir: path.resolve(process.env.UPLOAD_DIR || './public/uploads'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
} as const;

// Validação de variáveis obrigatórias
if (!env.databaseUrl) {
  throw new Error('DATABASE_URL é obrigatória');
}

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET é obrigatória');
}

// Valores de exemplo dos .env.example/compose: públicos, qualquer um forjaria um token de admin
const SEGREDOS_DE_EXEMPLO = [
  'your-secret-key-change-in-production',
  'your-super-secret-jwt-key-change-this-in-production',
];

if (env.nodeEnv === 'production') {
  if (SEGREDOS_DE_EXEMPLO.includes(env.jwtSecret) || env.jwtSecret.length < 32) {
    throw new Error(
      'JWT_SECRET insegura: em produção use um valor próprio com pelo menos 32 caracteres (ex.: openssl rand -base64 48)'
    );
  }
}

