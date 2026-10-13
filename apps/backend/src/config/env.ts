import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  uploadDir: process.env.UPLOAD_DIR || './public/uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
} as const;

// Validação de variáveis obrigatórias
if (!env.databaseUrl) {
  throw new Error('DATABASE_URL é obrigatória');
}

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET é obrigatória');
}

