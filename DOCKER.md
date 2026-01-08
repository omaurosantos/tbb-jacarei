# 🐳 Docker Setup

Este projeto está configurado para rodar completamente com Docker Compose.

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose v2+

## 🚀 Início Rápido

1. **Copie o arquivo de exemplo de variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env` e configure as variáveis necessárias:**
   - `JWT_SECRET`: Gere uma chave secreta forte para JWT
   - `POSTGRES_PASSWORD`: Defina uma senha segura para o banco de dados
   - Outras variáveis podem ser mantidas com os valores padrão

3. **Construa e inicie todos os serviços:**
   ```bash
   docker compose up --build
   ```

4. **Acesse a aplicação:**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

## 📦 Serviços

O `docker-compose.yml` inclui os seguintes serviços:

- **postgres**: Banco de dados PostgreSQL 16
- **prisma-migrate**: Executa as migrações do Prisma (roda uma vez antes do backend)
- **backend**: API Node.js/Express na porta 3000
- **frontend**: Aplicação React servida pelo Nginx na porta 80

## 🔧 Comandos Úteis

### Parar todos os serviços:
```bash
docker compose down
```

### Parar e remover volumes (limpar banco de dados):
```bash
docker compose down -v
```

### Ver logs:
```bash
docker compose logs -f
```

### Ver logs de um serviço específico:
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Reconstruir um serviço específico:
```bash
docker compose up --build backend
```

### Executar comandos dentro de um container:
```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh

# Banco de dados
docker compose exec postgres psql -U postgres -d tbb_jacarei
```

### Rodar migrações manualmente:
```bash
docker compose run --rm prisma-migrate
```

### Acessar Prisma Studio:
```bash
docker compose exec backend sh -c "cd /app/packages/prisma && pnpm studio"
```

## 🔐 Variáveis de Ambiente

As principais variáveis de ambiente estão no arquivo `.env`:

- `POSTGRES_USER`: Usuário do PostgreSQL (padrão: postgres)
- `POSTGRES_PASSWORD`: Senha do PostgreSQL
- `POSTGRES_DB`: Nome do banco de dados (padrão: tbb_jacarei)
- `JWT_SECRET`: Chave secreta para JWT (obrigatório)
- `JWT_EXPIRES_IN`: Tempo de expiração do JWT (padrão: 1d)
- `FRONTEND_URL`: URL do frontend para CORS (padrão: http://localhost:80)
- `BACKEND_PORT`: Porta do backend (padrão: 3000)
- `FRONTEND_PORT`: Porta do frontend (padrão: 80)

## 📁 Volumes

- `postgres_data`: Dados persistentes do PostgreSQL
- `backend_uploads`: Arquivos enviados pelo backend (uploads)

## 🐛 Troubleshooting

### Backend não conecta ao banco:
- Verifique se o serviço `postgres` está rodando: `docker compose ps`
- Verifique os logs: `docker compose logs postgres`
- Verifique se a `DATABASE_URL` está correta no `.env`

### Frontend não conecta ao backend:
- Verifique se o backend está rodando: `docker compose ps`
- Verifique a variável `VITE_API_URL` no build do frontend
- Verifique os logs do backend: `docker compose logs backend`

### Erro de permissão:
- No Linux/Mac, pode ser necessário ajustar permissões:
  ```bash
  sudo chown -R $USER:$USER .
  ```

### Limpar tudo e começar do zero:
```bash
docker compose down -v
docker system prune -a
docker compose up --build
```

## 🔄 Desenvolvimento

Para desenvolvimento local sem Docker, veja o README.md principal.

Para desenvolvimento com hot-reload usando Docker, você pode usar volumes para montar o código:

```yaml
# Adicione ao docker-compose.yml na seção do serviço desejado
volumes:
  - ./apps/backend/src:/app/apps/backend/src
```

Mas isso requer ajustes adicionais nos Dockerfiles para desenvolvimento.

