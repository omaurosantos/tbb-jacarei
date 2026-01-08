#!/bin/sh
set -e

echo "⏳ Aguardando banco de dados estar pronto..."
until pg_isready -h postgres -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-tbb_jacarei}; do
  sleep 1
done

echo "✅ Banco de dados pronto!"

echo "🔄 Gerando Prisma Client..."
cd /app/packages/prisma
pnpm generate

echo "🚀 Iniciando servidor backend..."
cd /app/apps/backend
exec node dist/index.js

