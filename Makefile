.PHONY: up up-d down down-v build logs clean migrate seed studio

# Inicia todos os serviços
up:
	docker compose up --build

# Inicia em background
up-d:
	docker compose up --build -d

# Para os serviços
down:
	docker compose down

# Para e remove volumes
down-v:
	docker compose down -v

# Reconstroi um serviço específico
build:
	docker compose build

# Ver logs
logs:
	docker compose logs -f

# Limpar tudo
clean:
	docker compose down -v
	docker system prune -f

# Executar migrações (e o seed)
migrate:
	docker compose run --rm prisma-migrate

# Acessar Prisma Studio
studio:
	docker compose exec backend sh -c "cd /app/packages/prisma && pnpm studio"

# Popular dados iniciais (seed é idempotente; roda junto com as migrações)
seed:
	docker compose run --rm prisma-migrate
