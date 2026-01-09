# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# pnpm yükleme
RUN npm install -g pnpm

# Bağımlılıkları kopyala
COPY pnpm-lock.yaml package.json ./

# Bağımlılıkları yükle
RUN pnpm install --frozen-lockfile

# Kaynak kodunu kopyala
COPY . .

# Build et
RUN pnpm build

# Runtime stage
FROM node:22-alpine

WORKDIR /app

# pnpm yükleme
RUN npm install -g pnpm

# Build stage'den dist ve node_modules'ü kopyala
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Port'u expose et
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "dist/index.js"]
