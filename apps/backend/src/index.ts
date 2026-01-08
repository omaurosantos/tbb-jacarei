import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.js';
import { sermoesRoutes } from './routes/sermoes.js';
import { aulasEbdRoutes } from './routes/aulas-ebd.js';
import { eventosRoutes } from './routes/eventos.js';
import { pastoresRoutes } from './routes/pastores.js';
import { ministeriosRoutes } from './routes/ministerios.js';
import { conteudosRoutes } from './routes/conteudos.js';
import { usersRoutes } from './routes/users.js';
import { uploadRoutes } from './routes/upload.js';

const app = express();

// Middleware
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static('public/uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sermoes', sermoesRoutes);
app.use('/api/aulas-ebd', aulasEbdRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/pastores', pastoresRoutes);
app.use('/api/ministerios', ministeriosRoutes);
app.use('/api/conteudos', conteudosRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload', uploadRoutes);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

// Start server
app.listen(env.port, () => {
  console.log(`🚀 Servidor rodando na porta ${env.port}`);
  console.log(`📝 Ambiente: ${env.nodeEnv}`);
  console.log(`🌐 Frontend URL: ${env.frontendUrl}`);
});

