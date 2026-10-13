# Backend Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY packages/prisma ./packages/prisma
COPY apps/backend ./apps/backend

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
WORKDIR /app/packages/prisma
RUN pnpm generate

# Build backend
WORKDIR /app/apps/backend
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy only necessary files
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/shared ./packages/shared
COPY --from=base /app/packages/prisma ./packages/prisma
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
COPY --from=base /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=base /app/packages/prisma/package.json ./packages/prisma/package.json
COPY --from=base /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=base /app/pnpm-workspace.yaml ./
COPY --from=base /app/package.json ./

# Create uploads directory
RUN mkdir -p /app/apps/backend/public/uploads

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["node", "dist/index.js"]

